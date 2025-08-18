import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbConnection = async () => {
  const DB = process.env.DB;

  try {
    await mongoose.connect(DB);
    console.log("Database is connected successfully");
  } catch (error) {
    console.log(" Database connection failed:", error.message);
    setTimeout(dbConnection, 5000); // Retry after 5 seconds
  }
};

export default dbConnection;
