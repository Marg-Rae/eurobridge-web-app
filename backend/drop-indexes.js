import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function dropIndexes() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "eurobridge"
    });
    console.log("✅ Connected to MongoDB");

    console.log("🗑️  Dropping old indexes on courses collection...");
    await mongoose.connection.db.collection('courses').dropIndexes();
    console.log("✅ Dropped all indexes");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

dropIndexes();
