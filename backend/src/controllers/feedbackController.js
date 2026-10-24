const mongoose = require("mongoose");
const Feedback = require("../models/feedbackModel");

const defaultFeedback = [
  {
    name: "Aman Verma",
    email: "aman.v@nitrr.ac.in",
    department: "Mechanical Engineering",
    rating: 5,
    message:
      "The Blitz CAD/CFD competition was incredibly practical. Loved working on real problem statements under tight time constraints!",
  },
  {
    name: "Sneha Patel",
    email: "sneha.p@nitrr.ac.in",
    department: "Computer Science",
    rating: 5,
    message:
      "The drone flying demonstrations and glider-building workshop were top-notch. Can't wait for the upcoming VTOL prototype flight trials!",
  },
  {
    name: "Rahul Sharma",
    email: "rahul.s@nitrr.ac.in",
    department: "Electrical Engineering",
    rating: 4,
    message:
      "Great mentorship during the Deliver the Pizza challenge. Would love to see more hands-on flight controller calibration sessions.",
  },
];

const createFeedback = async (req, res) => {
  try {
    const { name, email, department, rating, message } = req.body || {};

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
      data: feedback,
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
    const count = await Feedback.countDocuments();
    if (count === 0) {
      await Feedback.insertMany(defaultFeedback);
    }

    const feedback = await Feedback.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedback.length,
      feedback,
      data: feedback,
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
