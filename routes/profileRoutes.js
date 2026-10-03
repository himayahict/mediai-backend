const express = require("express");
const router = express.Router();

const User = require("../models/User");

// ================= GET PROFILE =================

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Failed to get profile",
    });
  }
});

// ================= UPDATE PROFILE =================

router.put("/:userId", async (req, res) => {
  console.log("PROFILE UPDATE ROUTE HIT");
  try {
    const { userId } = req.params;
    const { fullName, phone } = req.body;

    console.log("Updating profile...");
    console.log("User ID:", userId);
    console.log("Full Name:", fullName);
    console.log("Phone:", phone);

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        message: "Full name is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: fullName.trim(),
        phone: phone ? phone.trim() : "",
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("Updated user from DB:");
    console.log("Full Name:", updatedUser.fullName);
    console.log("Phone:", updatedUser.phone);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: error.message || "Failed to update profile",
    });
  }
});

module.exports = router;
