// Usage: node backend/scripts/promoteUser.js [email] [role]
// Examples:
//   node backend/scripts/promoteUser.js                     (lists all users in DB)
//   node backend/scripts/promoteUser.js myemail@nitrr.ac.in head
//   node backend/scripts/promoteUser.js myemail@nitrr.ac.in member

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/userModel");

const run = async () => {
  const args = process.argv.slice(2);
  const targetEmail = args[0] ? args[0].trim().toLowerCase() : "";
  const targetRole = args[1] ? args[1].trim().toLowerCase() : "head";

  await connectDB();

  if (!targetEmail) {
    console.log("\n📋 Registered Users in Database:");
    const users = await User.find({}).sort({ createdAt: -1 });
    if (users.length === 0) {
      console.log("No users found in database.");
    } else {
      users.forEach((u, i) => {
        console.log(
          `[${i + 1}] ${u.name} <${u.email}> - Role: ${u.role} (Branch: ${u.branch || 'N/A'}, Year: ${u.year || 'N/A'})`
        );
      });
      console.log("\nTo change any user's role, run:");
      console.log("  node backend/scripts/promoteUser.js <email> [head|member|user]\n");
    }
    await mongoose.disconnect();
    return;
  }

  const validRoles = ["user", "member", "head", "admin"];
  if (!validRoles.includes(targetRole)) {
    console.error(`Invalid role '${targetRole}'. Must be one of: ${validRoles.join(", ")}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const user = await User.findOne({ email: targetEmail });
  if (!user) {
    console.error(`User with email '${targetEmail}' not found.`);
    console.log("Registered users are:");
    const all = await User.find({});
    all.forEach((u) => console.log(` - ${u.email} (${u.name})`));
    await mongoose.disconnect();
    process.exit(1);
  }

  const prevRole = user.role;
  user.role = targetRole;
  user.membershipRequested = false;
  await user.save();

  console.log(`\n🎉 Success! Updated ${user.name} (${user.email})`);
  console.log(`   Previous Role: ${prevRole}`);
  console.log(`   New Role:      ${targetRole.toUpperCase()}`);
  console.log("\nYou can now refresh or re-login on the website to see your updated clearance!\n");

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Error updating role:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});

