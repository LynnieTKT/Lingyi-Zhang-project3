const express = require("express");
const multer = require("multer");
const path = require("path");
const Status = require("../models/Status");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Get all statuses
router.get("/", async (req, res) => {
  try {
    const statuses = await Status.find()
      .sort({ timestamp: -1 })
      .populate("userId", "username");
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({ message: "Failed to fetch statuses" });
  }
});

// Create a status with optional image
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const status = new Status({
      userId: req.user._id,
      content,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await status.save();
    const populatedStatus = await status.populate("userId", "username");
    res.status(201).json(populatedStatus);
  } catch (error) {
    console.error("Error creating status:", error);
    res.status(400).json({ message: "Failed to create status", error: error.message });
  }
});

// Edit status
router.put("/:id", protect, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const status = await Status.findOne({ _id: id, userId: req.user._id });
    if (!status) {
      return res.status(404).json({ message: "Status not found or not authorized" });
    }

    status.content = content;
    await status.save();
    res.json(status);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
});

// Delete status
router.delete("/:id", protect, async (req, res) => {
  const { id } = req.params;

  try {
    const status = await Status.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!status) {
      return res.status(404).json({ message: "Status not found or not authorized" });
    }
    res.json({ message: "Status deleted successfully" });
  } catch (error) {
    console.error("Error deleting status:", error);
    res.status(500).json({ message: "Failed to delete status", error: error.message });
  }
});

module.exports = router;
