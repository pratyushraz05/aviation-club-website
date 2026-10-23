const connectDB = require("../backend/src/config/db");
const app = require("../backend/src/app");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Vercel DB connection error:", err.message);
  }
  return app(req, res);
};
