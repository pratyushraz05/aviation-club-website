const express = require("express");
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");
const {
  createFeedback,
  getFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

// Public feedback submission
router.post("/", createFeedback);

// Head / Admin only management
router.get("/", authenticate, adminOnly, getFeedback);
router.delete("/:id", authenticate, adminOnly, deleteFeedback);

module.exports = router;
