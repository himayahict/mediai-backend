const express = require("express");

const router = express.Router();

const {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  completeReminder,
  updateReminderStatus,
} = require("../controllers/reminderController");

const protect = require("../middleware/authMiddleware");


// CREATE
router.post("/", protect, createReminder);

// READ
router.get("/", protect, getReminders);

// UPDATE
router.put("/:id", protect, updateReminder);

// DELETE
router.delete("/:id", protect, deleteReminder);

//COMPLETE
router.patch("/:id/complete", protect, completeReminder);

//UPDATE
router.patch("/:id/status", protect, updateReminderStatus);


module.exports = router;