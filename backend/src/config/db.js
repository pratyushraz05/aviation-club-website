const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("Checking URI:", process.env.MONGO_URI ? "URI is loaded" : "URI is MISSING");
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;