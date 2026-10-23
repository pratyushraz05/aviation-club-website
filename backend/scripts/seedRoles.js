// Usage (from root or backend/):  node backend/scripts/seedRoles.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/userModel");

const seed = async () => {
  await connectDB();

  console.log("Checking and seeding default multi-tier role accounts...");

  // 1. Head Account
  const headEmail = (process.env.ADMIN_EMAIL || "head@aviation.nitrr.ac.in").toLowerCase().trim();
  const headName = process.env.ADMIN_NAME || "Club Head";
  const headPassword = process.env.ADMIN_PASSWORD || "head123456789";

  const existingHead = await User.findOne({ email: headEmail });
  if (existingHead) {
    if (existingHead.role !== "head" && existingHead.role !== "admin") {
      await User.updateOne({ _id: existingHead._id }, { $set: { role: "head" } });
      console.log(`✓ Promoted existing account ${headEmail} to Head role.`);
    } else {
      console.log(`✓ Head account ${headEmail} is active (Role: ${existingHead.role}).`);
    }
  } else {
    const hash = await bcrypt.hash(headPassword, 12);
    await User.create({
      name: headName,
      email: headEmail,
      password: hash,
      role: "head",
      branch: "Mechanical",
      year: "4th Year",
      subteam: "Core Leadership",
      isActive: true,
    });
    console.log(`✓ Created Head account: ${headEmail} (Password: ${headPassword})`);
  }

  // 2. Sample Member Account
  const memberEmail = "member@aviation.nitrr.ac.in";
  const existingMember = await User.findOne({ email: memberEmail });
  if (!existingMember) {
    const hash = await bcrypt.hash("member123456", 12);
    await User.create({
      name: "Sahil (Aerodynamics)",
      email: memberEmail,
      password: hash,
      role: "member",
      branch: "Mechanical",
      year: "3rd Year",
      subteam: "Aerodynamics & Airframe",
      isActive: true,
    });
    console.log(`✓ Created Member account: ${memberEmail} (Password: member123456)`);
  } else {
    console.log(`✓ Member account ${memberEmail} already exists.`);
  }

  // 3. Sample User Account
  const userEmail = "student@nitrr.ac.in";
  const existingUser = await User.findOne({ email: userEmail });
  if (!existingUser) {
    const hash = await bcrypt.hash("student123456", 12);
    await User.create({
      name: "Pooja Student",
      email: userEmail,
      password: hash,
      role: "user",
      branch: "CSE",
      year: "1st Year",
      subteam: "Software & Web Development",
      membershipRequested: true,
      isActive: true,
    });
    console.log(`✓ Created Common User account: ${userEmail} (Password: student123456)`);
  } else {
    console.log(`✓ Common user account ${userEmail} already exists.`);
  }

  console.log("\nRole accounts setup complete!");
  console.log("-----------------------------------------");
  console.log("HEAD:   " + headEmail + " (Has full admin/head console access)");
  console.log("MEMBER: " + memberEmail + " (Has Member Portal CAD & Announcements access)");
  console.log("USER:   " + userEmail + " (Normal student/visitor account)");
  console.log("-----------------------------------------");

  await mongoose.disconnect();
};

seed().catch(async (err) => {
  console.error("Seeding error:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});

