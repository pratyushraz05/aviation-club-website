const authService = require("../services/authService");
const { ACCESS_COOKIE, TOKEN_HOURS, cookieOptions } = require("../config/authConfig");

const validateLogin = (body = {}) => {
  const errors = [];
  const { email, password } = body;
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim()) || email.length > 254) {
    errors.push("A valid email is required");
  }
  if (typeof password !== "string" || password.length === 0 || password.length > 200) {
    errors.push("Password is required");
  }
  return errors;
};

const validateRegister = (body = {}) => {
  const errors = [];
  const { name, email, password } = body;
  if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
    errors.push("Name must be at least 2 characters");
  }
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim()) || email.length > 254) {
    errors.push("A valid email address is required");
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 200) {
    errors.push("Password must be at least 6 characters long");
  }
  return errors;
};

const register = async (req, res, next) => {
  try {
    const errors = validateRegister(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const { user, token } = await authService.register(req.body);

    res.cookie(ACCESS_COOKIE, token, {
      ...cookieOptions(),
      maxAge: TOKEN_HOURS * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
      token,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
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
    res.status(200).json({ success: true, message: "Login successful", user, token });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
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

// Head / Admin role: Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// Head / Admin role: Update a user's role
const updateRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }

    const updatedUser = await authService.updateUserRole(req.params.id, role);
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: updatedUser,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Logged-in User: Request Member status
const requestMembership = async (req, res, next) => {
  try {
    const updatedUser = await authService.requestMembership(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: "Membership request submitted for Head review",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  getUsers,
  updateRole,
  requestMembership,
};
