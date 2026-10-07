const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.gftc80co,
  api_key: process.env.412285662351765,
  api_secret: process.env.eg4f3PIwD4MJY-3F-UY0PpR4bJk,
});

module.exports = cloudinary;