const express = require("express");
const router = express.Router();
const controller = require("../controllers/teamController");
const { authenticate, headOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public read operations
router.get("/", controller.getTeam);
router.get("/section-order", controller.getSectionOrder);
router.get("/section-columns", controller.getSectionColumns);

// Head & Admin write operations
router.put("/section-order", authenticate, headOnly, controller.updateSectionOrder);
router.put("/section-columns", authenticate, headOnly, controller.updateSectionColumns);
router.post("/", authenticate, headOnly, upload.single("image"), controller.addTeamMember);
router.put("/:id", authenticate, headOnly, upload.single("image"), controller.updateTeamMember);
router.delete("/:id", authenticate, headOnly, controller.deleteTeamMember);

module.exports = router;
