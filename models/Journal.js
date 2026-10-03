const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
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

    note: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "General",
        "Symptoms",
        "Sleep",
        "Nutrition",
        "Exercise",
        "Mood",
        "Medication",
        "Other",
      ],
      default: "General",
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Journal", journalSchema);