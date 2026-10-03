const express = require("express");
const router = express.Router();

const Journal = require("../models/Journal");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const models = [
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.1-flash-lite",
];

// ===============================
// AI JOURNAL SUMMARY
// ===============================
router.post("/ai-summary", async (req, res) => {
  try {
    const { userId, period } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    if (!period || ![7, 30].includes(Number(period))) {
      return res.status(400).json({
        message: "period must be 7 or 30 days",
      });
    }

    // Calculate date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (Number(period) - 1));
    startDate.setHours(0, 0, 0, 0);

    // Get user's journal entries for selected period
    const journals = await Journal.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });

    if (journals.length === 0) {
      return res.status(200).json({
        success: true,
        summary: `No journal entries were found for the last ${period} days.`,
        entryCount: 0,
      });
    }

    // Prepare journal information for Gemini
    const journalText = journals
      .map((journal, index) => {
        return `
Entry ${index + 1}
Date: ${new Date(journal.date).toLocaleDateString("en-US")}
Category: ${journal.category}
Title: ${journal.title}
Note: ${journal.note}
`;
      })
      .join("\n");

    const prompt = `
You are MediAI's Personal Health Journal Summarizer.

Your task is ONLY to summarize the user's own journal entries.

Important safety rules:
- Do NOT diagnose any disease or medical condition.
- Do NOT prescribe medicines.
- Do NOT recommend medication dosages.
- Do NOT make medical decisions.
- Do NOT introduce medical information that is not present in the journal.
- Do NOT assume that a symptom means a specific disease.
- Do NOT invent facts.
- Clearly distinguish between what the user recorded and any general observations.
- Keep the summary neutral and supportive.
- If the journal contains concerning information, simply mention that the user may want to discuss the recorded information with a qualified healthcare professional.
- This is a journal summary, NOT medical advice.

The user selected a ${period}-day summary.

Journal entries:
${journalText}

Create a concise summary with these sections:

### Overview
Briefly summarize what the user recorded during this period.

### Key Themes
Mention recurring topics, symptoms, activities, sleep, nutrition, mood, medication notes, or other themes that actually appear in the journal.

### Notable Patterns
Describe repeated or changing information that can be directly observed from the journal entries.
Do not interpret these as diagnoses.

### Journal Highlights
Mention a few important entries or changes recorded by the user.

### Reminder
End with a short statement that this summary is based only on the user's journal entries and is not medical advice.
`;

    let response = null;
    let lastError = null;

    for (const model of models) {
      try {
        console.log(`Trying journal summary with Gemini model: ${model}`);

        response = await ai.models.generateContent({
          model: model,
          contents: prompt,
        });

        console.log(`Journal summary response received from: ${model}`);

        break;
      } catch (error) {
        lastError = error;

        console.error(`${model} failed:`, error.status || error.message);
      }
    }

    if (!response) {
      throw (
        lastError || new Error("All Gemini models are temporarily unavailable.")
      );
    }
    const summary = response.text;

    res.status(200).json({
      success: true,
      summary,
      entryCount: journals.length,
      period: Number(period),
    });
  } catch (error) {
    console.error("AI journal summary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI journal summary",
      error: error.message,
    });
  }
});

// ===============================
// GET ALL JOURNAL ENTRIES
// ===============================
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const journals = await Journal.find({ userId }).sort({ date: -1 });

    res.status(200).json(journals);
  } catch (error) {
    console.error("Get journal entries error:", error);

    res.status(500).json({
      message: "Failed to fetch journal entries",
      error: error.message,
    });
  }
});

// ===============================
// GET SINGLE JOURNAL ENTRY
// ===============================
router.get("/entry/:id", async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({
        message: "Journal entry not found",
      });
    }

    res.status(200).json(journal);
  } catch (error) {
    console.error("Get single journal error:", error);

    res.status(500).json({
      message: "Failed to fetch journal entry",
      error: error.message,
    });
  }
});

// ===============================
// CREATE JOURNAL ENTRY
// ===============================
router.post("/", async (req, res) => {
  try {
    const { userId, title, note, category, date } = req.body;

    if (!userId || !title || !note) {
      return res.status(400).json({
        message: "userId, title and note are required",
      });
    }

    const journal = new Journal({
      userId,
      title,
      note,
      category,
      date,
    });

    const savedJournal = await journal.save();

    res.status(201).json({
      message: "Journal entry created successfully",
      journal: savedJournal,
    });
  } catch (error) {
    console.error("Create journal error:", error);

    res.status(500).json({
      message: "Failed to create journal entry",
      error: error.message,
    });
  }
});

// ===============================
// UPDATE JOURNAL ENTRY
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { title, note, category, date } = req.body;

    const updatedJournal = await Journal.findByIdAndUpdate(
      req.params.id,
      {
        title,
        note,
        category,
        date,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedJournal) {
      return res.status(404).json({
        message: "Journal entry not found",
      });
    }

    res.status(200).json({
      message: "Journal entry updated successfully",
      journal: updatedJournal,
    });
  } catch (error) {
    console.error("Update journal error:", error);

    res.status(500).json({
      message: "Failed to update journal entry",
      error: error.message,
    });
  }
});

// ===============================
// DELETE JOURNAL ENTRY
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const deletedJournal = await Journal.findByIdAndDelete(req.params.id);

    if (!deletedJournal) {
      return res.status(404).json({
        message: "Journal entry not found",
      });
    }

    res.status(200).json({
      message: "Journal entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete journal error:", error);

    res.status(500).json({
      message: "Failed to delete journal entry",
      error: error.message,
    });
  }
});

module.exports = router;
