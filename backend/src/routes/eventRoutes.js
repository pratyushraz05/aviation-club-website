const express = require("express");
const router = express.Router();

const controller = require("../controllers/eventController");
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // Import your Cloudinary upload middleware

// Public read operations
router.get("/", controller.getEvents);
router.get("/flagship", controller.getFlagshipEvent);
router.get("/:id", controller.getEventById);

// Admin-only write operations with Cloudinary image upload middleware
router.put("/flagship/set/:id", authenticate, adminOnly, controller.setFlagshipEvent);
router.post("/", authenticate, adminOnly, upload.single("image"), controller.createEvent);
router.put("/:id", authenticate, adminOnly, upload.single("image"), controller.updateEvent);
router.delete("/:id", authenticate, adminOnly, controller.deleteEvent);

module.exports = router;
