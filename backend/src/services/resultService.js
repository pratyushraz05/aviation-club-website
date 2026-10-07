const mongoose = require("mongoose");
const Result = require("../models/resultModel");

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

const getAllResults = async () => Result.find().sort({ year: -1, createdAt: -1 });

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
