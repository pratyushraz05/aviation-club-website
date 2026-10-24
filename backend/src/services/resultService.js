const mongoose = require("mongoose");
const Result = require("../models/resultModel");

const defaultResults = [
  {
    event: "Inter-College Drone Challenge",
    year: "2026",
    position: "🥇 1st Place",
    team: "Team Aero",
    description: "Secured first place in the inter-college drone challenge with an outstanding performance.",
  },
  {
    event: "Aero Design Competition",
    year: "2025",
    position: "🥈 2nd Place",
    team: "Aviation Club Team",
    description: "Achieved second place for an innovative aircraft design and engineering approach.",
  },
  {
    event: "National Aviation Quiz",
    year: "2025",
    position: "🏆 Finalist",
    team: "Aviation Club",
    description: "Reached the national-level finals after competing against teams from several institutions.",
  },
];

const FIELDS = ["event", "year", "position", "team", "description"];

const pickFields = (body = {}) =>
  FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid result id");
    err.statusCode = 400;
    throw err;
  }
};

const notFound = () => {
  const err = new Error("Result not found");
  err.statusCode = 404;
  return err;
};

const getAllResults = async () => {
  const count = await Result.countDocuments();
  if (count === 0) {
    await Result.insertMany(defaultResults);
  }
  return Result.find().sort({ year: -1, createdAt: -1 });
};

const createResult = async (body) => Result.create(pickFields(body));

const updateResult = async (id, body) => {
  assertValidId(id);
  const updated = await Result.findByIdAndUpdate(id, pickFields(body), {
    new: true,
    runValidators: true,
  });
  if (!updated) throw notFound();
  return updated;
};

const deleteResult = async (id) => {
  assertValidId(id);
  const deleted = await Result.findByIdAndDelete(id);
  if (!deleted) throw notFound();
  return deleted;
};

module.exports = {
  getAllResults,
  createResult,
  updateResult,
  deleteResult,
};
