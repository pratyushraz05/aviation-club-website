// Usage (from the backend/ folder):  npm run create-admin
// Reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from backend/.env.
// Safe to run twice: it never creates a duplicate and never overwrites an existing account.

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/userModel");


const run = async () => {
  const name = (process.env.ADMIN_NAME || "").trim();
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!name || !email || !password) {
    console.error("ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must all be set in backend/.env");
    process.exit(1);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    console.error("ADMIN_EMAIL is not a valid email address");
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("ADMIN_PASSWORD must be at least 12 characters");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`An account for ${email} already exists. Nothing was changed.`);
  } else {
    const hash = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hash, role: "admin", isActive: true });
    console.log(`Admin created: ${email}`);
    console.log("You can now remove ADMIN_PASSWORD from backend/.env.");
  }

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Failed to create admin:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
