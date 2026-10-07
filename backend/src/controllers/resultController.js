const resultService = require("../services/resultService");

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

const getResults = async (req, res) => {
  try {
    const data = await resultService.getAllResults();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    handleError(res, error);
  }
};

const createResult = async (req, res) => {
  try {
    const data = await resultService.createResult(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

const updateResult = async (req, res) => {
  try {
    const data = await resultService.updateResult(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteResult = async (req, res) => {
  try {
    await resultService.deleteResult(req.params.id);
    res.status(200).json({ success: true, message: "Result deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getResults, createResult, updateResult, deleteResult };
