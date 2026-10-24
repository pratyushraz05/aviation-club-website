const mongoose = require("mongoose");
const Feedback = require("../models/feedbackModel");

const createFeedback = async (req, res) => {
  try {
    const { name, email, department, rating, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please provide your name" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Please provide your email" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your message" });
    }

    const numericRating = rating ? Math.max(1, Math.min(5, Number(rating) || 5)) : 5;

    const feedback = await Feedback.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: (department || "").trim(),
      rating: numericRating,
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid feedback ID" });
    }

    const deleted = await Feedback.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getFeedback,
  deleteFeedback,
};
