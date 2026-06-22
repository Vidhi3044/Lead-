const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

// ======================
// TEST ROUTE
// ======================
router.get("/", (req, res) => {
  res.json({ message: "Reservation Route Working" });
});

// ======================
// BULK DELETE LEADS
// ======================
router.post("/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Invalid or empty IDs array",
      });
    }

    await Reservation.deleteMany({
      _id: { $in: ids },
    });

    res.status(200).json({
      message: "Leads deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ======================
// DASHBOARD STATS
// ======================
// Kept static routes at the top to prevent Express route collisions
router.get("/dashboard-stats", async (req, res) => {
  try {
    const reservations = await Reservation.find() || [];

    const totalReservations = reservations.length;

    // Uses optional chaining and lowercase conversion for status-matching safety
    const newLeads = reservations.filter(
      (r) => r.status?.toLowerCase() === "new lead" || r.status?.toLowerCase() === "new"
    ).length;

    const confirmed = reservations.filter(
      (r) => r.status?.toLowerCase() === "confirmed"
    ).length;

    const followUps = reservations.filter(
      (r) => r.status?.toLowerCase() === "follow up" || r.status?.toLowerCase() === "followup"
    ).length;

    res.status(200).json({
      totalReservations,
      newLeads,
      confirmed,
      followUps,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// GET ALL RESERVATIONS
// ======================
router.get("/all", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// CREATE RESERVATION
// ======================
router.post("/", async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json({
      success: true,
      message: "Reservation Created Successfully",
      reservation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const reservation =
      await Reservation.findById(
        req.params.id
      );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put(
  "/:id/status",
  async (req, res) => {
    try {
      const reservation =
        await Reservation.findByIdAndUpdate(
          req.params.id,
          {
            status: req.body.status,
          },
          {
            new: true,
          }
        );

      res.status(200).json(
        reservation
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
router.put("/:id/status", async (req, res) => {
  try {
    const reservation =
      await Reservation.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        {
          new: true,
        }
      );

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// ======================
// SET NEXT FOLLOW-UP DATE
// ======================

router.put("/:id/next-followup", async (req, res) => {
  try {
    const { nextFollowUp } = req.body;

    const reservation =
      await Reservation.findByIdAndUpdate(
        req.params.id,
        {
          nextFollowUp,
        },
        {
          new: true,
        }
      );

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// ======================
// ADD FOLLOW-UP NOTE
// ======================

router.put("/:id/followup", async (req, res) => {
  try {
    const { note } = req.body;

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    reservation.followUps.push({
      note,
      date: new Date(),
    });

    await reservation.save();

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// ======================
// DELETE LEAD
// ======================

router.delete("/:id", async (req, res) => {
  try {
    const reservation =
      await Reservation.findByIdAndDelete(
        req.params.id
      );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// router.delete("/:id", async (req, res) => {
//   try {
//     await Reservation.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//       message: "Lead deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    const reservation =
      await Reservation.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



module.exports = router;