import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017",
      {
        dbName: process.env.DB_NAME,
        maxPoolSize: 10,
        minPoolSize: 1,
      }
    );
    console.log("MongoDB connected", process.env.MONGO_URI);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
