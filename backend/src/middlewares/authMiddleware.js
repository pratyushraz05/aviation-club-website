const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { ACCESS_COOKIE } = require("../config/authConfig");

const notAuthenticated = (res) =>
  res.status(401).json({
    success: false,
    authenticated: false,
    message: "Not authenticated",
  });

// Reads the JWT from the HttpOnly cookie or Authorization Bearer header,
// verifies it and loads the user from the database.
const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies && req.cookies[ACCESS_COOKIE];

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return notAuthenticated(res);

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    } catch (err) {
      return notAuthenticated(res); // expired or tampered token
    }

    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) return notAuthenticated(res);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Generic Role-based Access Control middleware
const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Requires one of: ${allowedRoles.join(", ")}`,
      currentRole: req.user.role,
    });
  }

  next();
};

// Convenience role guards
const headOnly = requireRole("head", "admin");
const memberOnly = requireRole("member", "head", "admin");
const adminOnly = headOnly; // Heads and Admins have administrative privileges

const protect = authenticate;
const admin = adminOnly;

module.exports = {
  authenticate,
  requireRole,
  headOnly,
  memberOnly,
  adminOnly,
  protect,
  admin,
};
