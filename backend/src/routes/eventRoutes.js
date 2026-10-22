
const express = require("express");
const router = express.Router();

const controller = require("../controllers/eventController");
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");

// Public read operations
router.get("/", controller.getEvents);
router.get("/:id", controller.getEventById);

// Admin-only write operations
router.post("/", authenticate, adminOnly, controller.createEvent);
router.put("/:id", authenticate, adminOnly, controller.updateEvent);
router.delete("/:id", authenticate, adminOnly, controller.deleteEvent);

module.exports = router;
