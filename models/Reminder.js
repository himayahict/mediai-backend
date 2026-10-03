const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Medication", "Water", "Exercise", "Appointment", "Other"],
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    repeat: {
      type: String,
      required: true,
      enum: ["None", "Daily", "Weekly", "Monthly"],
      default: "None",
    },

    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Reminder", reminderSchema);
