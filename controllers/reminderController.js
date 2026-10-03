const Reminder = require("../models/Reminder");

// CREATE REMINDER
const createReminder = async (req, res) => {
  try {
    const { title, type, date, time, repeat } = req.body;

    if (!title || !type || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const reminder = await Reminder.create({
      userId: req.user.id,
      title,
      type,
      date,
      time,
      repeat: repeat || "None",
    });

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    console.error("Create reminder error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET REMINDERS
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({
      userId: req.user.id,
    }).sort({
      date: 1,
      time: 1,
    });

    res.status(200).json({
      success: true,
      reminders,
    });
  } catch (error) {
    console.error("Get reminders error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE REMINDER
const updateReminder = async (req, res) => {
  try {
    const { title, type, date, time, repeat } = req.body;

    const reminder = await Reminder.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        title,
        type,
        date,
        time,
        repeat,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      reminder,
    });
  } catch (error) {
    console.error("Update reminder error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// COMPLETE REMINDER
const completeReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        status: "Completed",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder marked as completed",
      reminder,
    });
  } catch (error) {
    console.error("Complete reminder error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE REMINDER
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    console.error("Delete reminder error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE REMINDER
const updateReminderStatus = async (req, res) => {
  try {
    console.log("Reminder ID:", req.params.id);
    console.log("Logged User ID:", req.user.id);
    console.log("New Status:", req.body.status);

    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    console.log("Found Reminder:", reminder);

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    reminder.status = req.body.status;

    await reminder.save();

    res.status(200).json({
      success: true,
      message: "Reminder status updated successfully",
      reminder,
    });
  } catch (error) {
    console.error("Update reminder status error:", error);

    res.status(500).json({
      message: "Failed to update reminder status",
    });
  }
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  completeReminder,
  updateReminderStatus,
};
