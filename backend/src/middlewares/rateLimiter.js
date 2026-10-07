const rateLimit = require("express-rate-limit");

const json = (message) => ({ success: false, message });

// Brute-force protection for the login endpoint (per IP).
// Successful logins do not count against the limit.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many login attempts. Please try again in 15 minutes."),
});

// Generous general limit for the whole API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many requests. Please slow down and try again shortly."),
});

module.exports = { loginLimiter, apiLimiter };
