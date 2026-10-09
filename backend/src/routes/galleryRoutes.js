const express = require("express");

const router = express.Router();

const {
  createGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");

const upload = require("../middlewares/uploadMiddleware");


// CREATE GALLERY
router.post("/", upload.array("images", 10), createGallery);


// GET ALL GALLERIES
router.get("/", getAllGalleries);


// GET GALLERY BY ID
router.get("/:id", getGalleryById);


// UPDATE GALLERY
router.put("/:id", upload.array("images", 10), updateGallery);


// DELETE GALLERY
router.delete("/:id", deleteGallery);


module.exports = router;