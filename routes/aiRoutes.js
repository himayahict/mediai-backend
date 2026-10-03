const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const Journal = require("../models/Journal");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateAIResponse(message, history = []) {
  const models = [
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.1-flash-lite",
  ];

  const prompt = `
You are MediAI, an AI-powered healthcare information assistant.

Your purpose is to provide general, educational health information.

Follow these rules strictly:

1. Do not diagnose diseases or medical conditions.
2. Do not tell users that they definitely have a particular disease.
3. Do not prescribe medications or provide personalized medication dosages.
4. Do not replace a doctor or qualified healthcare professional.
5. Explain medical topics in simple, clear language.
6. For symptom-related questions, provide general educational information without diagnosing the user.
7. Encourage users to consult an appropriate healthcare professional when medical evaluation is needed.
8. If the user describes possible emergency symptoms, advise them to seek urgent medical attention or contact local emergency services.
9. Do not provide instructions that could cause harm.
10. Clearly state uncertainty when information is not sufficient.

Conversation history:
${history
  .map(
    (item) =>
      `${item.role === "user" ? "User" : "MediAI"}: ${item.text}`
  )
  .join("\n")}

Current user question:
User: ${message}

Please answer the current question while considering the conversation history.
`;

  for (const model of models) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      console.log(`Gemini response received from: ${model}`);

      return response.text;

    } catch (error) {
      console.error(
        `${model} failed:`,
        error.status || error.message
      );
    }
  }

  throw new Error("All Gemini models are temporarily unavailable.");
}

router.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question.",
      });
    }

    console.log("AI Question:", message);

    const aiResponse = await generateAIResponse(message, history);
    
    res.json({
      success: true,
      userMessage: message,
      aiResponse: aiResponse,
    });

  } catch (error) {
   console.error("Gemini API Error:", error);

  return res.status(503).json({
    success: false,
    message:
      "MediAI is temporarily unable to connect to the AI service. Please try again in a moment.",
  });
  }
});

module.exports = router;