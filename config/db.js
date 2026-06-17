const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("Connecting with MONGO_URI:", process.env.MONGO_URI ? "Defined" : "Undefined");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    // Do not call process.exit(1) in serverless to prevent total lambda crash
  }
};

module.exports = connectDB;