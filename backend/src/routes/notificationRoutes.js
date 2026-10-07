const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

// No auth here. Raghava will add admin middleware on POST/PUT/DELETE later.
router.get("/", controller.getNotifications);
router.post("/", controller.createNotification);
router.put("/:id", controller.updateNotification);
router.delete("/:id", controller.deleteNotification);

module.exports = router;
