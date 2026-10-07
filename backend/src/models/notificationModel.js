const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    date: { type: String, required: [true, "date is required"], trim: true },
    title: { type: String, required: [true, "title is required"], trim: true },
    summary: { type: String, required: [true, "summary is required"], trim: true },
    extraText: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
