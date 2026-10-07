const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { ACCESS_COOKIE } = require("../config/authConfig");

const notAuthenticated = (res) =>
  res.status(401).json({
    success: false,
    authenticated: false,
    message: "Not authenticated",
  });

// Reads the JWT from the HttpOnly cookie, verifies it and loads the user.
// The user is re-read from the database on every request, so deactivating an
// account or changing its role takes effect immediately.
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies[ACCESS_COOKIE];
    if (!token) return notAuthenticated(res);

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    } catch (err) {
      return notAuthenticated(res); // expired / tampered token
    }

    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) return notAuthenticated(res);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Use AFTER authenticate.
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

// Backward-compatible names from the original project. They now use the secure
// cookie + role implementation, so any older code that still imports
// { protect, admin } keeps working and is just as safe as the new routes.
const protect = authenticate;
const admin = adminOnly;

module.exports = { authenticate, adminOnly, protect, admin };
