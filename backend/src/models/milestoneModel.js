const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    icon: {
      type: String,
      default: "✈",
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Content / description is required"],
      trim: true,
    },
    link: {
      type: String,
      default: "/events",
      trim: true,
    },
    linkLabel: {
      type: String,
      default: "Full Event Report →",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Milestone", milestoneSchema);
