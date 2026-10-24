const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { TOKEN_HOURS, MAX_FAILED_ATTEMPTS, LOCK_MINUTES } = require("../config/authConfig");

class AuthError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Compared against when the email is unknown, so response time does not reveal
// whether an account exists.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

const lockedMessage = () =>
  `Too many failed attempts. This account is locked for ${LOCK_MINUTES} minutes.`;

const toPublicUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  branch: user.branch || "",
  year: user.year || "",
  subteam: user.subteam || "",
  membershipRequested: !!user.membershipRequested,
  isActive: user.isActive !== false,
  createdAt: user.createdAt,
});

const signToken = (user) =>
  jwt.sign(
    { sub: String(user._id), role: user.role, name: user.name },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: `${TOKEN_HOURS}h`,
    }
  );

const register = async ({ name, email, password, branch = "", year = "", subteam = "", requestMembership = false }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new AuthError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "user", // Starts as normal user until promoted by Head/Admin
    branch: branch.trim(),
    year: year.trim(),
    subteam: subteam.trim(),
    membershipRequested: !!requestMembership,
    isActive: true,
  });

  return { user: toPublicUser(newUser), token: signToken(newUser) };
};

const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

  if (!user || !user.isActive) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw new AuthError(401, "Invalid email or password");
  }

  if (user.isLocked) throw new AuthError(423, lockedMessage());

  const matches = await bcrypt.compare(password, user.password);

  if (!matches) {
    const updated = await User.findByIdAndUpdate(
      user._id,
      { $inc: { failedLoginAttempts: 1 } },
      { new: true }
    );
    if (updated.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      await User.updateOne(
        { _id: user._id },
        { $set: { lockUntil: new Date(Date.now() + LOCK_MINUTES * 60 * 1000), failedLoginAttempts: 0 } }
      );
      throw new AuthError(423, lockedMessage());
    }
    throw new AuthError(401, "Invalid email or password");
  }

  await User.updateOne(
    { _id: user._id },
    { $set: { failedLoginAttempts: 0, lockUntil: null, lastLogin: new Date() } }
  );

  return { user: toPublicUser(user), token: signToken(user) };
};

const getAllUsers = async () => {
  const users = await User.find({}).sort({ createdAt: -1 });
  return users.map(toPublicUser);
};

const updateUserRole = async (userId, newRole) => {
  const validRoles = ["user", "member", "head", "admin"];
  if (!validRoles.includes(newRole)) {
    throw new AuthError(400, `Invalid role. Must be one of: ${validRoles.join(", ")}`);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { role: newRole } },
    { new: true }
  );

  if (!user) {
    throw new AuthError(404, "User not found");
  }

  return toPublicUser(user);
};

const requestMembership = async (userId, details = {}) => {
  const updateData = { membershipRequested: true };
  if (details.branch) updateData.branch = details.branch.trim();
  if (details.year) updateData.year = details.year.trim();
  if (details.subteam) updateData.subteam = details.subteam.trim();

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  );

  if (!user) {
    throw new AuthError(404, "User not found");
  }

  return toPublicUser(user);
};

const updateProfile = async (userId, data = {}) => {
  const allowed = ["name", "branch", "year", "subteam"];
  const updateData = {};
  allowed.forEach((field) => {
    if (data[field] !== undefined) updateData[field] = String(data[field]).trim();
  });

  if (data.email) {
    const normEmail = String(data.email).toLowerCase().trim();
    const existing = await User.findOne({ email: normEmail, _id: { $ne: userId } });
    if (existing) throw new AuthError(409, "Email is already taken by another account");
    updateData.email = normEmail;
  }

  const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });
  if (!user) throw new AuthError(404, "User not found");
  return toPublicUser(user);
};

const updateUserByAdmin = async (userId, data = {}) => {
  const allowed = ["name", "branch", "year", "subteam", "role", "membershipRequested", "isActive"];
  const updateData = {};
  allowed.forEach((field) => {
    if (data[field] !== undefined) {
      if (typeof data[field] === "string") updateData[field] = data[field].trim();
      else updateData[field] = data[field];
    }
  });

  if (data.role) {
    const validRoles = ["user", "member", "head", "admin"];
    if (!validRoles.includes(data.role)) {
      throw new AuthError(400, `Invalid role. Must be one of: ${validRoles.join(", ")}`);
    }
  }

  if (data.email) {
    const normEmail = String(data.email).toLowerCase().trim();
    const existing = await User.findOne({ email: normEmail, _id: { $ne: userId } });
    if (existing) throw new AuthError(409, "Email is already taken by another account");
    updateData.email = normEmail;
  }

  const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });
  if (!user) throw new AuthError(404, "User not found");
  return toPublicUser(user);
};

const deleteUserByAdmin = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new AuthError(404, "User not found");
  return true;
};

module.exports = {
  login,
  register,
  getAllUsers,
  updateUserRole,
  requestMembership,
  updateProfile,
  updateUserByAdmin,
  deleteUserByAdmin,
  toPublicUser,
  AuthError,
};
