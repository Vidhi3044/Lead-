const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    reservationType: {
      type: String,
    },

    guests: {
      type: Number,
    },

    date: {
      type: String,
    },

    time: {
      type: String,
    },

    duration: {
      type: String,
    },

    occasion: {
      type: String,
    },

   package: {
    type: String,
  },

    requirements: {
      type: String,
    },

    notes: {
      type: String,
    },

    status: {
      type: String,
      default: "New Lead",
    },

    // ======================
    // FOLLOW-UP HISTORY
    // ======================
    followUps: [
      {
        note: {
          type: String,
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ======================
    // NEXT FOLLOW-UP DATE
    // ======================
    nextFollowUp: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Reservation",
  reservationSchema
);