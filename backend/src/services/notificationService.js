const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");

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

const getAllNotifications = async () => Notification.find().sort({ createdAt: -1 });

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
