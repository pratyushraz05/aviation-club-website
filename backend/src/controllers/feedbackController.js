const Feedback = require("../models/feedbackModel");

const createFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const feedback = await Feedback.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getFeedback,
};