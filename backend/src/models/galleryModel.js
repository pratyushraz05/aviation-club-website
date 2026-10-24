const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    note: { type: String, default: "", trim: true },
    highlights: [{ type: String, trim: true }],
    folder: { type: String, default: "", trim: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
