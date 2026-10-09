const { authenticate, adminOnly } = require("../middlewares/authMiddleware");
const express = require("express");
const {
  createFeedback,
  getFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", createFeedback);
router.get("/", authenticate, adminOnly, getFeedback);

module.exports = router;