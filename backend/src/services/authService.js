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
});

const signToken = (user) =>
  jwt.sign({ sub: String(user._id), role: user.role }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: `${TOKEN_HOURS}h`,
  });

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

module.exports = { login, toPublicUser, AuthError };
