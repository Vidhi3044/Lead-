const express = require("express");
const router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");
const Reservation = require("../models/Reservation");

// Configure Multer for in-memory file storage with a 10MB size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Helper to sanitize input strings
const sanitizeString = (val, maxLen = 100) => {
  if (val === undefined || val === null) return "";
  // Stringify and trim
  let str = String(val).trim();
  // Strip simple HTML tags to prevent basic XSS
  str = str.replace(/<\/?[^>]+(>|$)/g, "");
  // Limit length
  return str.slice(0, maxLen);
};

// ======================
// DOWNLOAD TEMPLATE
// ======================
router.get("/template", (req, res) => {
  try {
    const templateData = [
      {
        "Name": "John Doe",
        "Phone": "9898232345",
        "Reservation Type": "Table Reservation",
        "Guests": 2,
        "Date": "2026-06-20",
        "Status": "New Lead"
      }
    ];

    const ws = xlsx.utils.json_to_sheet(templateData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Template");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=Leads_Template.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ======================
// EXPORT LEADS
// ======================
router.get("/export", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } }
        ]
      };
    }

    const leads = await Reservation.find(query).sort({ createdAt: -1 });

    const formattedData = leads.map((lead) => ({
      "Name": lead.fullName || "N/A",
      "Phone": lead.phone || "N/A",
      "Reservation Type": lead.reservationType || "N/A",
      "Guests": lead.guests || 0,
      "Date": lead.date || "N/A",
      "Status": lead.status || "New Lead",
      "Created At": lead.createdAt ? new Date(lead.createdAt).toISOString() : "N/A"
    }));

    const ws = xlsx.utils.json_to_sheet(formattedData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Leads");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
    const today = new Date().toISOString().split("T")[0];

    res.setHeader("Content-Disposition", `attachment; filename=Leads_${today}.xlsx`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ======================
// IMPORT LEADS
// ======================
router.post("/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const originalName = req.file.originalname || "";
    const ext = originalName.split(".").pop().toLowerCase();
    if (ext !== "xlsx" && ext !== "xls" && ext !== "csv") {
      return res.status(400).json({ message: "Only .xlsx, .xls, and .csv files are allowed." });
    }

    // Read the file buffer in memory
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: "The uploaded file is empty." });
    }

    // Fetch existing phone numbers to prevent duplicates
    const existingReservations = await Reservation.find({}, "phone");
    const dbPhones = new Set(existingReservations.map((r) => String(r.phone).trim()));

    const seenPhonesInFile = new Set();
    const toInsert = [];
    const failedRows = [];

    rows.forEach((row, index) => {
      const rowNum = index + 2; // header is row 1, data starts at row 2

      // Match columns (support case-insensitive or space-variations)
      const nameVal = row.Name || row.fullName || row.fullName || row.name;
      const phoneVal = row.Phone || row.phone;
      const resTypeVal = row["Reservation Type"] || row.reservationType || "";
      const guestsVal = row.Guests || row.guests || 0;
      const dateVal = row.Date || row.date || "";
      const statusVal = row.Status || row.status || "New Lead";

      // const name = sanitizeString(nameVal, 100);
      // const phone = sanitizeString(phoneVal, 30);
      // const resType = sanitizeString(resTypeVal, 100);
      // const guests = parseInt(guestsVal, 10) || 0;
      // const date = sanitizeString(dateVal, 50);
      // const status = sanitizeString(statusVal, 50);

      const name = sanitizeString(nameVal, 100) || "N/A";
const phone = sanitizeString(phoneVal, 30) || "N/A";
const resType = sanitizeString(resTypeVal, 100) || "N/A";
const guests = parseInt(guestsVal, 10) || 0;
const date = sanitizeString(dateVal, 50) || "N/A";
const status = sanitizeString(statusVal, 50) || "New Lead";

      // Validation
      if (!name) {
        failedRows.push({ row: rowNum, error: "Missing required field: Name" });
        return;
      }
      if (!phone) {
        failedRows.push({ row: rowNum, error: "Missing required field: Phone" });
        return;
      }

      // Duplicate checking
      if (phone !== "N/A" && dbPhones.has(phone)) {
        failedRows.push({ row: rowNum, error: `Duplicate: Phone number '${phone}' already exists in database` });
        return;
      }
      if (phone !== "N/A" && seenPhonesInFile.has(phone)) {
        failedRows.push({ row: rowNum, error: `Duplicate in file: Phone number '${phone}' listed multiple times` });
        return;
      }

      // Valid record
      toInsert.push({
        fullName: name,
        phone: phone,
        reservationType: resType,
        guests: guests,
        date: date,
        status: status
      });
      seenPhonesInFile.add(phone);
    });

    // Bulk insert the records
    if (toInsert.length > 0) {
      await Reservation.insertMany(toInsert);
    }

    return res.status(200).json({
      totalRows: rows.length,
      successfullyImported: toInsert.length,
      failedRows: failedRows
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
