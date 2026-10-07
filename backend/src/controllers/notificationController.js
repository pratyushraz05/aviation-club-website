const notificationService = require("../services/notificationService");

const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  const status = error.statusCode || 500;
  const message = status === 500 ? "Internal server error" : error.message;
  if (status === 500) console.error(error);
  return res.status(status).json({ success: false, message });
};

const getNotifications = async (req, res) => {
  try {
    const data = await notificationService.getAllNotifications();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    handleError(res, error);
  }
};

const createNotification = async (req, res) => {
  try {
    const data = await notificationService.createNotification(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

const updateNotification = async (req, res) => {
  try {
    const data = await notificationService.updateNotification(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id);
    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getNotifications, createNotification, updateNotification, deleteNotification };
