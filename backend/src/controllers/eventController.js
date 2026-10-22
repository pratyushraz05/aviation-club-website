
const mongoose = require("mongoose");
const Event = require("../models/eventModel");

const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((e) => e.message);

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "An event with this eventId already exists",
    });
  }

  const status = error.statusCode || 500;
  const message =
    status === 500 ? "Internal server error" : error.message;

  if (status === 500) console.error(error);

  return res.status(status).json({
    success: false,
    message,
  });
};

const getEvents = async (req, res) => {
  try {
    const data = await Event.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getEventById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const data = await Event.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
};

const createEvent = async (req, res) => {
  try {
    const data = await Event.create(req.body);

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const updateEvent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const data = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const data = await Event.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
