import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // Provide MONGODB_URI and optional MONGODB_DB_NAME via env vars.
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME || "eurobridge"
  });

  console.log("MongoDB connected");
};
