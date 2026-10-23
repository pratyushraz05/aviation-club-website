const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["CAD", "Aerodynamics", "Avionics", "Software", "Guidelines", "Flight Log"],
      default: "Guidelines",
    },
    url: { type: String, required: true },
    fileType: { type: String, default: "link" }, // pdf, drive, cad, zip, link
    uploadedBy: { type: String, default: "Club Lead" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);

