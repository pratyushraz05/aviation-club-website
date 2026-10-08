const Gallery = require("../models/galleryModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Upload one image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "aviation-club/gallery",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};


// CREATE GALLERY
const createGallery = async (req, res) => {
  try {
    const { title, category, description, eventId } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
    }

    const gallery = await Gallery.create({
      title,
      category,
      description,
      eventId: eventId || null,
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "Gallery created successfully",
      data: gallery,
    });
  } catch (error) {
    console.error("Create Gallery Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create gallery",
      error: error.message,
    });
  }
};


// GET ALL GALLERIES
const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find()
      .populate("eventId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error) {
    console.error("Get Galleries Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch galleries",
      error: error.message,
    });
  }
};


// GET GALLERY BY ID
const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id).populate("eventId");

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error("Get Gallery Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery",
      error: error.message,
    });
  }
};


// UPDATE GALLERY
const updateGallery = async (req, res) => {
  try {
    const { title, category, description, eventId } = req.body;

    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    if (title !== undefined) gallery.title = title;
    if (category !== undefined) gallery.category = category;
    if (description !== undefined) gallery.description = description;
    if (eventId !== undefined) gallery.eventId = eventId || null;

    // If new images are uploaded, add them to existing images
    if (req.files && req.files.length > 0) {
      const newImageUrls = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );

      gallery.images.push(...newImageUrls);
    }

    await gallery.save();

    res.status(200).json({
      success: true,
      message: "Gallery updated successfully",
      data: gallery,
    });
  } catch (error) {
    console.error("Update Gallery Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update gallery",
      error: error.message,
    });
  }
};


// DELETE GALLERY
const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery deleted successfully",
    });
  } catch (error) {
    console.error("Delete Gallery Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete gallery",
      error: error.message,
    });
  }
};


module.exports = {
  createGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
};