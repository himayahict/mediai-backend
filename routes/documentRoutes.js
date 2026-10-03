const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { uploadDocument, getDocuments, deleteDocument } = require("../controllers/documentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Upload folder path
const uploadDir = path.join(__dirname, "..", "uploads", "documents");

// Create folder automatically if it does not exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// Allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF, JPG, and PNG files are allowed"),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Get user documents
router.get(
  "/",
  protect,
  getDocuments
);

// Upload document
router.post(
  "/",
  protect,
  upload.single("file"),
  uploadDocument
);

// Delete document
router.delete(
  "/:id",
  protect,
  deleteDocument
);

module.exports = router;