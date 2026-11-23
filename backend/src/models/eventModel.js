
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      default: "",
      trim: true,
    },
    venue: {
      type: String,
      default: "",
      trim: true,
    },
    speakerInfo: {
      type: String,
      default: "",
      trim: true,
    },
    isUpcoming: {
      type: Boolean,
      default: false,
    },
    isFlagship: {
      type: Boolean,
      default: false,
    },
    flagshipStatus: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
    tagline: {
      type: String,
      default: "",
      trim: true,
    },
    registrationLink: {
      type: String,
      default: "",
      trim: true,
    },
    registrationStartDate: {
      type: String,
      default: "",
      trim: true,
    },
    registrationEndDate: {
      type: String,
      default: "",
      trim: true,
    },
    registrationStatusMode: {
      type: String,
      enum: ["auto", "open", "closed"],
      default: "auto",
    },
    teamEligibility: {
      type: String,
      default: "",
      trim: true,
    },
    registrationFee: {
      type: String,
      default: "",
      trim: true,
    },
    rulebookLink: {
      type: String,
      default: "",
      trim: true,
    },
    prizePool: {
      type: String,
      default: "",
      trim: true,
    },
    contactInfo: {
      type: String,
      default: "",
      trim: true,
    },
    customLinks: [
      {
        label: { type: String, default: "", trim: true },
        url: { type: String, default: "", trim: true },
      },
    ],
    tracks: [
      {
        id: { type: String, default: "" },
        title: { type: String, default: "", trim: true },
        badge: { type: String, default: "", trim: true },
        tagline: { type: String, default: "", trim: true },
        description: { type: String, default: "", trim: true },
        objectives: { type: [String], default: [] },
        image: { type: String, default: "", trim: true },
      },
    ],
    photos: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    purpose: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    outcomes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
