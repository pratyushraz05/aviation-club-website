const express = require("express");
const router = express.Router();
const controller = require("../controllers/milestoneController");
const { authenticate, headOnly } = require("../middlewares/authMiddleware");

// Public read operations
router.get("/", controller.getMilestones);

// Head / Admin write operations
router.post("/", authenticate, headOnly, controller.createMilestone);
router.put("/:id", authenticate, headOnly, controller.updateMilestone);
router.delete("/:id", authenticate, headOnly, controller.deleteMilestone);
router.post("/reset", authenticate, headOnly, controller.resetMilestones);

module.exports = router;
