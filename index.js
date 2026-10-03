const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const chatRoutes = require("./routes/chatRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const documentRoutes = require("./routes/documentRoutes");
const journalRoutes = require("./routes/journalRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/documents", documentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/health-journal", journalRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediAI Backend Server is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MediAI server running on port ${PORT}`);
});