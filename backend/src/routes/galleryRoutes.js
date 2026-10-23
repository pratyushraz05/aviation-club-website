const express = require("express");
const router = express.Router();
const {
  createGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");
const { authenticate, headOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public read operations
router.get("/", getAllGalleries);
router.get("/:id", getGalleryById);

// Head-only write operations
router.post("/", authenticate, headOnly, upload.array("images", 10), createGallery);
router.put("/:id", authenticate, headOnly, upload.array("images", 10), updateGallery);
router.delete("/:id", authenticate, headOnly, deleteGallery);

module.exports = router;
