import mongoose from "mongoose";
import dotenv from "dotenv";
import { MONGODB_URI } from "./configs.js";
dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_URI!);
    console.log("MongoDB connected at : ", connection.connection.host);
    process.exit(1);
  } catch (error) {
    console.log("mongodb connection failed");
  }
};

export default connectDB;
