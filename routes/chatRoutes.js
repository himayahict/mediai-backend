const express = require("express");
const Chat = require("../models/chatModel");

const router = express.Router();


// Save a new chat
router.post("/", async (req, res) => {
  try {
    const { userId, title, messages } = req.body;

    if (!userId || !title || !messages) {
      return res.status(400).json({
        success: false,
        message: "Missing required chat information.",
      });
    }

    const chat = await Chat.create({
      userId,
      title,
      messages,
    });

    res.status(201).json({
      success: true,
      message: "Chat saved successfully.",
      chat,
    });

  } catch (error) {
    console.error("Save chat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save chat.",
    });
  }
});

// Delete a chat
router.delete("/:chatId", async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    res.json({
      success: true,
      message: "Chat deleted successfully.",
    });

  } catch (error) {
    console.error("Delete chat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete chat.",
    });
  }
});

// Update an existing chat
router.put("/:chatId", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({
        success: false,
        message: "Messages are required.",
      });
    }

    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      {
        messages: messages,
      },
      {
        new: true,
      }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    res.json({
      success: true,
      message: "Chat updated successfully.",
      chat,
    });

  } catch (error) {
    console.error("Update chat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update chat.",
    });
  }
});


// Get user's chats
router.get("/:userId", async (req, res) => {
  try {
    const chats = await Chat.find({
      userId: req.params.userId,
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      chats,
    });

  } catch (error) {
    console.error("Get chats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get chat history.",
    });
  }
});


module.exports = router;