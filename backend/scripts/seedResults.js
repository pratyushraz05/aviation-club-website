require("dotenv").config({ path: __dirname + "/../.env" });
const connectDB = require("../src/config/db");
const Result = require("../src/models/resultModel");

(async () => {
  try {
    await connectDB();
    const docs = await Result.find().sort({ createdAt: 1 });
    const seen = new Set();
    for (const d of docs) {
      const key = d.event.trim().toLowerCase();
      if (seen.has(key)) {
        await Result.findByIdAndDelete(d._id);
        console.log("Deleted duplicate:", d.event, d._id);
      } else {
        seen.add(key);
      }
    }
    const finalDocs = await Result.find().sort({ year: -1, createdAt: -1 });
    console.log("Database clean. Total results count:", finalDocs.length);
    finalDocs.forEach((d) => console.log(`✓ [${d.year}] ${d.event} - ID: ${d._id}`));
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
