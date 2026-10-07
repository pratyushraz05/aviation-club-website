const authService = require("../services/authService");
const { ACCESS_COOKIE, TOKEN_HOURS, cookieOptions } = require("../config/authConfig");

const validateLogin = (body = {}) => {
  const errors = [];
  const { email, password } = body;
  // typeof checks also block NoSQL-injection payloads such as {"email": {"$gt": ""}}
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim()) || email.length > 254) {
    errors.push("A valid email is required");
  }
  if (typeof password !== "string" || password.length === 0 || password.length > 200) {
    errors.push("Password is required");
  }
  return errors;
};

const login = async (req, res, next) => {
  try {
    const errors = validateLogin(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const { user, token } = await authService.login(req.body.email, req.body.password);

    res.cookie(ACCESS_COOKIE, token, {
      ...cookieOptions(),
      maxAge: TOKEN_HOURS * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, message: "Login successful", user });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie(ACCESS_COOKIE, cookieOptions());
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Runs after the `authenticate` middleware.
const me = (req, res) => {
  res.status(200).json({
    success: true,
    authenticated: true,
    user: authService.toPublicUser(req.user),
  });
};

module.exports = { login, logout, me };
