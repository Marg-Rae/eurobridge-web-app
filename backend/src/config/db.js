import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // Provide MONGODB_URI and optional MONGODB_DB_NAME via env vars.
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    // Log connection string (masked password)
    const maskedUri = uri.replace(/:([^@]+)@/, ":****@");
    console.log("Connection string:", maskedUri);
    
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || "eurobridge"
    });

    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error message:", error.message);
    
    // Check if it's a network error
    if (error.message.includes("Could not connect to any servers")) {
      console.error("\n⚠️  This usually means:");
      console.error("  1. Your IP is not whitelisted in MongoDB Atlas");
      console.error("  2. Your network/firewall is blocking the connection");
      console.error("  3. The database credentials are incorrect");
      console.error("\nTo fix:");
      console.error("  - Go to: https://cloud.mongodb.com");
      console.error("  - Click Cluster0 → Security → Network Access");
      console.error("  - Add 0.0.0.0/0 and wait 2-3 minutes");
    }
    
    throw error;
  }
};

