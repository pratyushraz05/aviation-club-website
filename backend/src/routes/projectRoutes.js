const express = require("express");
const router = express.Router();

const controller = require("../controllers/projectController");
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // Import Cloudinary upload middleware

// Public read operations
router.get("/", controller.getProjects);
router.get("/:id", controller.getProjectById);

// Admin-only write operations with Cloudinary image upload middleware
router.post("/", authenticate, adminOnly, upload.single("image"), controller.createProject);
router.put("/:id", authenticate, adminOnly, upload.single("image"), controller.updateProject);
router.delete("/:id", authenticate, adminOnly, controller.deleteProject);

module.exports = router;