require("dotenv").config({ path: __dirname + "/../.env" });
const connectDB = require("../src/config/db");
const resultService = require("../src/services/resultService");

(async () => {
  try {
    await connectDB();
    const docs = await resultService.getAllResults();
    console.log("Successfully retrieved/seeded results. Total count:", docs.length);
    docs.forEach((d) => console.log(`✓ [${d.year}] ${d.event} - ID: ${d._id}`));
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
