const express = require("express");
const router = express.Router();
const controller = require("../controllers/memberController");
const { authenticate, memberOnly, headOnly } = require("../middlewares/authMiddleware");

// All member routes require login
router.use(authenticate);

// Announcements
router.get("/announcements", memberOnly, controller.getAnnouncements);
router.post("/announcements", headOnly, controller.createAnnouncement);
router.delete("/announcements/:id", headOnly, controller.deleteAnnouncement);

// Resources
router.get("/resources", memberOnly, controller.getResources);
router.post("/resources", headOnly, controller.createResource);
router.delete("/resources/:id", headOnly, controller.deleteResource);

module.exports = router;

