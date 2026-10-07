const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    event: { type: String, required: [true, "event is required"], trim: true },
    year: { type: String, required: [true, "year is required"], trim: true },
    position: { type: String, required: [true, "position is required"], trim: true },
    team: { type: String, required: [true, "team is required"], trim: true },
    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
