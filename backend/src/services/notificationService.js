const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");

const defaultNotifications = [
  {
    date: "04 Apr 2026",
    title: "Blitz Competition results announced",
    summary: "21 participants completed a three-hour CAD-FEA-CFD design sprint, earning a 100% 4-star-or-above feedback score.",
    extraText: " The judges were highly impressed by the rapid prototyping skills and simulated aerodynamics demonstrated under pressure.",
  },
  {
    date: "08 Feb 2026",
    title: "UAV Racing Competition: Team Garud wins",
    summary: "Team Garud topped the leaderboard on technical documentation and flight performance; Lakshmi Sahithi named Best Mentor.",
    extraText: " The final race came down to a nail-biting finish, with Team Garud securing the win by mere milliseconds.",
  },
  {
    date: "07 Feb 2026",
    title: "Deliver the Pizza (DTP): Team MACHX6 wins",
    summary: "MACHX6 built and flew the strongest quadcopter across four competing teams in this two-phase UAV challenge.",
    extraText: " Their custom payload dropping mechanism was incredibly precise, hitting the target perfectly during the final phase.",
  },
  {
    date: "31 Jan – 01 Feb 2026",
    title: "Two-day Aerodynamics Workshop concludes",
    summary: "95 participants covered flight principles, drone systems and a live air show with industry expert Dr. Aruna Rana.",
    extraText: " Students also got hands-on experience calibrating flight controllers and troubleshooting basic motor synchronization.",
  },
  {
    date: "08 Nov 2025",
    title: "DIMENSIONS CAD Workshop & Competition held",
    summary: "75 participants trained in Creo Parametric before competing across beginner and expert design categories.",
    extraText: " The winning designs have been sent to the 3D printing lab to be featured in the upcoming club showcase.",
  },
  {
    date: "08 Oct 2025",
    title: "Air Force Day celebrated at Hira Hall",
    summary: "50 participants joined an aviation quiz, RC plane landing and parachute landing challenge with Dr. N. V. Swamy Naidu.",
    extraText: " The event concluded with an inspiring speech about the future of aerospace engineering in India.",
  },
];

const FIELDS = ["date", "title", "summary", "extraText"];

const pickFields = (body = {}) =>
  FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid notification id");
    err.statusCode = 400;
    throw err;
  }
};

const notFound = () => {
  const err = new Error("Notification not found");
  err.statusCode = 404;
  return err;
};

const getAllNotifications = async () => {
  const count = await Notification.countDocuments();
  if (count === 0) {
    await Notification.insertMany(defaultNotifications);
  }
  return Notification.find().sort({ createdAt: -1 });
};

const createNotification = async (body) => Notification.create(pickFields(body));

const updateNotification = async (id, body) => {
  assertValidId(id);
  const updated = await Notification.findByIdAndUpdate(id, pickFields(body), {
    new: true,
    runValidators: true,
  });
  if (!updated) throw notFound();
  return updated;
};

const deleteNotification = async (id) => {
  assertValidId(id);
  const deleted = await Notification.findByIdAndDelete(id);
  if (!deleted) throw notFound();
  return deleted;
};

module.exports = {
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
};
