const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    event: { type: String, required: [true, "event is required"], trim: true },
    year: { type: String, required: [true, "year is required"], trim: true },
    date: { type: String, trim: true, default: "" },
    venue: { type: String, trim: true, default: "" },
    duration: { type: String, trim: true, default: "" },
    position: { type: String, required: [true, "position is required"], trim: true },
    team: { type: String, required: [true, "team is required"], trim: true },
    category: { type: String, trim: true, default: "Club Achievement" },
    description: { type: String, trim: true, default: "" },
    purpose: { type: String, trim: true, default: "" },
    speakers: { type: [String], default: [] },
    activities: { type: [String], default: [] },
    outcomes: { type: [String], default: [] },
    feedback: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
