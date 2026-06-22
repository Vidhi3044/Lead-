import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import Swal from "sweetalert2";
import "../styles/leadsPage.css";
import "../styles/AdminSidebar.css";
import ThemeToggle from "../components/ThemeToggle";

function LeadsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  console.log("Reservations State:", reservations);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        "/api/reservations/all"
      );
      console.log("API DATA:", response.data);
      setReservations(response.data);
    } catch (error) {
      console.log("API ERROR:", error);
    }
  };

  const filteredLeads = reservations.filter((lead) =>
    lead.fullName
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    lead.phone
      ?.toString()
      .includes(search)
  );

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((lead) => lead._id));
    }
  };

  const handleDeleteOne = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete Lead?",
      text: `Are you sure you want to delete the lead for ${name || "N/A"}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/reservations/${id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Lead deleted successfully",
        confirmButtonColor: "#d4af37",
      });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      fetchReservations();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "Something went wrong while deleting the lead.",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const result = await Swal.fire({
      title: "Delete Selected Leads?",
      text: `Are you sure you want to delete ${selectedIds.length} selected leads? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete All",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post("/api/reservations/bulk-delete", { ids: selectedIds });
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `${selectedIds.length} leads deleted successfully.`,
        confirmButtonColor: "#d4af37",
      });
      setSelectedIds([]);
      fetchReservations();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "Something went wrong while deleting selected leads.",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  const handleExport = async () => {
    try {
   const response = await axios.get(
  "/api/leads/export",
  {
    params: { search },
    responseType: "blob",
  }
);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const today = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `Leads_${today}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "Something went wrong while exporting leads.",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  const handleDownloadTemplate = () => {
    window.open("/api/leads/template", "_blank");
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset file input value
    e.target.value = null;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "The maximum file size is 10 MB.",
        confirmButtonColor: "#d4af37",
      });
      return;
    }

    // Check file extension
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "xlsx" && ext !== "xls" && ext !== "csv") {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Only .xlsx, .xls, and .csv files are supported.",
        confirmButtonColor: "#d4af37",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      Swal.fire({
        title: "Importing Leads...",
        text: "Please wait while we process the file",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post("/api/leads/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { totalRows, successfullyImported, failedRows } = response.data;

      let summaryHTML = `
        <div style="text-align: left; font-size: 0.95rem;">
          <p><strong>Total Rows:</strong> ${totalRows}</p>
          <p style="color: green;"><strong>Successfully Imported:</strong> ${successfullyImported}</p>
          <p style="color: ${failedRows.length > 0 ? '#b52b2b' : 'inherit'};"><strong>Failed Rows:</strong> ${failedRows.length}</p>
      `;

      if (failedRows.length > 0) {
        summaryHTML += `
          <div style="max-height: 150px; overflow-y: auto; margin-top: 10px; border: 1px solid #ddd; padding: 5px; border-radius: 4px; background: #fafafa;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="background: #eee; border-bottom: 1px solid #ddd;">
                  <th style="padding: 4px; text-align: left;">Row</th>
                  <th style="padding: 4px; text-align: left;">Reason</th>
                </tr>
              </thead>
              <tbody>
                ${failedRows
                  .map(
                    (f) => `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 4px; font-weight: bold;">${f.row}</td>
                    <td style="padding: 4px; color: #b52b2b;">${f.error}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `;
      }

      summaryHTML += `</div>`;

      Swal.fire({
        icon: failedRows.length === 0 ? "success" : successfullyImported > 0 ? "warning" : "error",
        title: "Import Results",
        html: summaryHTML,
        confirmButtonColor: "#d4af37",
      });

      fetchReservations();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Import Failed",
        text: error.response?.data?.message || "Could not complete the import process.",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  return (

    <div className="admin-layout-container" style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      {/* Sidebar on the left */}
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main page content on the right */}
      <div className="leads-page" style={{ flex: 1, padding: "20px", boxSizing: "border-box" }}>
 <div
  className="leads-header-section"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  }}
>
  <h1></h1>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }}
  >
    {selectedIds.length > 0 && (
      <button
        className="bulk-delete-btn"
        onClick={handleBulkDelete}
      >
        Delete Selected ({selectedIds.length})
      </button>
    )}
  </div>
</div>

        <div className="excel-actions-container" style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <label className="excel-action-btn excel-import-label">
            Import Excel
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImport}
              style={{ display: "none" }}
            />
          </label>
          <button className="excel-action-btn" onClick={handleExport}>
            Export Excel
          </button>
          <button className="excel-action-btn excel-template-btn" onClick={handleDownloadTemplate}>
            Download Template
          </button>
        </div>

        <input

          type="text"
          placeholder="Search by name or phone number..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="leads-table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={filteredLeads.length > 0 && selectedIds.length === filteredLeads.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Phone</th>
                <th>Venue</th>
                <th>Guests</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(lead._id)}
                        onChange={() => handleSelectOne(lead._id)}
                      />
                    </td>
                    <td>{lead.fullName || "N/A"}</td>
                    <td>{lead.phone || "N/A"}</td>
                    <td>{lead.venue || "N/A"}</td>
                    <td>{lead.guests || "N/A"}</td>
                    <td>{lead.date || "N/A"}</td>
                    <td>
                      <span className="status-badge">
                        {lead.status || "Pending"}
                      </span>
                    </td>
                    <td style={{ display: "flex", gap: "10px" }}>
                      <Link to={`/admin/leads/${lead._id}`}>
                        <button className="view-btn">View</button>
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteOne(lead._id, lead.fullName)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No reservations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeadsPage;
