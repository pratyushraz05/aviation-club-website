const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");
const { authenticate, headOnly } = require("../middlewares/authMiddleware");

// Public view notifications
router.get("/", controller.getNotifications);

// Head / Admin only write operations
router.post("/", authenticate, headOnly, controller.createNotification);
router.put("/:id", authenticate, headOnly, controller.updateNotification);
router.delete("/:id", authenticate, headOnly, controller.deleteNotification);

module.exports = router;
