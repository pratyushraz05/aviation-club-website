require("dns").setServers(["1.1.1.1"]);
require("dotenv").config();

const mongoose = require("mongoose");
const Feedback = require("./src/models/feedbackModel");

async function checkFeedback() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .lean();

    console.log("Total feedback records:", feedback.length);
    console.log(feedback);

  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkFeedback();