const express = require("express");
const router = express.Router();
const controller = require("../controllers/teamController");
const { authenticate, headOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public read operations
router.get("/", controller.getTeam);

// Head & Admin write operations
router.post("/", authenticate, headOnly, upload.single("image"), controller.addTeamMember);
router.put("/:id", authenticate, headOnly, upload.single("image"), controller.updateTeamMember);
router.delete("/:id", authenticate, headOnly, controller.deleteTeamMember);

module.exports = router;
