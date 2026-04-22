import mongoose from "mongoose";
import config from "../config.js";

/**
 * Connect to MongoDB Atlas
 * @throws {Error} If connection fails
 */
export const connectDB = async () => {
  const uri = config.MONGODB_URI;
  const dbName = config.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    console.log("\n🔗 Connecting to MongoDB...");
    
    // Log connection attempt (masked password)
    const maskedUri = uri.replace(/:([^@]+)@/, ":****@");
    console.log(`   URI: ${maskedUri}`);
    console.log(`   Database: ${dbName}`);
    
    // Attempt connection with production-optimized settings
    await mongoose.connect(uri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 30000, // 30 second timeout for Render
      socketTimeoutMS: 75000, // 75 second socket timeout
      connectTimeoutMS: 30000, // 30 second connection timeout
      maxPoolSize: 5, // Limit connection pool size for free tier
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });

    console.log("✅ MongoDB Atlas connected successfully!");
    console.log(`   Status: ${mongoose.connection.readyState === 1 ? "Connected" : "Connecting"}`);
    
  } catch (error) {
    console.error("\n❌ MongoDB Connection Failed");
    console.error("   Error:", error.message);
    
    // Provide helpful troubleshooting information
    if (error.message.includes("Could not connect to any servers") || 
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("getaddrinfo")) {
      
      console.error("\n⚠️  Possible causes:");
      console.error("   1. IP address not whitelisted in MongoDB Atlas");
      console.error("   2. MongoDB Atlas cluster is paused");
      console.error("   3. Network connectivity issues");
      console.error("\n💡 Solutions:");
      console.error("   1. Go to https://cloud.mongodb.com");
      console.error("   2. Select your cluster → Security → Network Access");
      console.error("   3. Add 0.0.0.0/0 (allows all IP addresses)");
      console.error("   4. Wait 2-3 minutes for changes to take effect");
      
      if (process.env.NODE_ENV === "production") {
        console.error("\n📌 For Render deployments:");
        console.error("   - Render uses dynamic IPs, so use 0.0.0.0/0");
        console.error("   - Update MongoDB whitelist and wait 2-3 minutes");
        console.error("   - Then trigger a redeploy on Render");
      }
    }
    
    if (error.message.includes("authentication failed")) {
      console.error("\n⚠️  Authentication Error:");
      console.error("   Your MongoDB credentials are incorrect");
      console.error("   Check MONGODB_URI environment variable");
    }
    
    // Re-throw error to prevent server startup with broken database connection
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  } catch (error) {
    console.error("❌ Error disconnecting from MongoDB:", error.message);
  }
};

