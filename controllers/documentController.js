const path = require("path");
const fs = require("fs");

const Document = require("../models/Document");

// UPLOAD DOCUMENT
const uploadDocument = async (req, res) => {
  try {
    const { title, type } = req.body;

    // Check required fields
    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and document type are required",
      });
    }

    // Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file",
      });
    }

    const document = await Document.create({
      userId: req.user.id,
      title: title.trim(),
      type,
      fileName: req.file.originalname,
      fileUrl: `/uploads/documents/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload document error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while uploading document",
    });
  }
};

// GET USER DOCUMENTS
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Get documents error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching documents",
    });
  }
};

// DELETE DOCUMENT

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Find document belonging to logged-in user
    const document = await Document.findOne({
      _id: id,
      userId: req.user.id,
    });

    // Document not found
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete actual uploaded file
    const relativeFilePath = document.fileUrl.replace(
      /^\/uploads\//,
      "uploads/"
    );

    const filePath = path.join(
      __dirname,
      "..",
      relativeFilePath
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await Document.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting document",
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
};
