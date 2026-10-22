
const express = require("express");
const router = express.Router();

const controller = require("../controllers/projectController");
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");

// Public read operations
router.get("/", controller.getProjects);
router.get("/:id", controller.getProjectById);

// Admin-only write operations
router.post("/", authenticate, adminOnly, controller.createProject);
router.put("/:id", authenticate, adminOnly, controller.updateProject);
router.delete("/:id", authenticate, adminOnly, controller.deleteProject);

module.exports = router;
