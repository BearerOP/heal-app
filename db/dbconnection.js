const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (conn) {
      console.log("Database connected successfully");
      console.log("Database connected at", conn.connection.host);
    }
    else {
      console.log("Database connection failed!");
    }
  } catch (error) {
    console.log("Database connection failed! ", error);
  }
};