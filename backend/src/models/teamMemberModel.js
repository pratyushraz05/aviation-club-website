const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    section: {
      type: String,
      required: true,
      default: "coreTeam",
      trim: true,
    },
    branch: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);

