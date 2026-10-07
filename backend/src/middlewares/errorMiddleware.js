// Always answer API errors with JSON (never HTML, never stack traces).

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body too large" });
  }

  const status = err.statusCode || err.status || 500;
  if (status >= 500) console.error(err); // logged on the server only
  res.status(status).json({
    success: false,
    message: status >= 500 ? "Internal server error" : err.message,
  });
};

module.exports = { notFound, errorHandler };
