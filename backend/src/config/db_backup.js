import mongoose from "mongoose";
import config from "../config.js";

/**
 * Connect to MongoDB Atlas with retry logic
 * @throws {Error} If connection fails after all retries
 */
export const connectDB = async (maxRetries = 3) => {
  const uri = config.MONGODB_URI;
  const dbName = config.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\n🔗 Connecting to MongoDB (Attempt ${attempt}/${maxRetries})...`);
      
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
        authSource: 'admin' // Ensure proper authentication database
      });

      console.log("✅ MongoDB Atlas connected successfully!");
      console.log(`   Status: ${mongoose.connection.readyState === 1 ? "Connected" : "Connecting"}`);
      return; // Success, exit retry loop
      
    } catch (error) {
      lastError = error;
      console.error(`\n❌ MongoDB Connection Failed (Attempt ${attempt}/${maxRetries})`);
      console.error("   Error:", error.message);
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
        console.log(`   Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All attempts failed
  console.error(`\n❌ MongoDB Connection Failed After ${maxRetries} Attempts`);
  console.error("   Final Error:", lastError.message);
  
  // Provide helpful troubleshooting information
  if (lastError.message.includes("Could not connect to any servers") || 
      lastError.message.includes("ECONNREFUSED") ||
      lastError.message.includes("getaddrinfo") ||
      lastError.message.includes("IP that isn't whitelisted")) {
    
    console.error("\n⚠️  Possible causes:");
    console.error("   1. MongoDB Atlas cluster is PAUSED (most common)");
    console.error("   2. IP address not whitelisted in MongoDB Atlas");
    console.error("   3. Network connectivity issues");
    console.error("   4. Database user lacks proper permissions");
    console.error("\n💡 Solutions:");
    console.error("   1. Go to https://cloud.mongodb.com");
    console.error("   2. Check if cluster shows 'Resume' button - click it!");
    console.error("   3. Security → Network Access → Add 0.0.0.0/0");
    console.error("   4. Security → Database Access → Verify user permissions");
    console.error("   5. Wait 2-5 minutes and redeploy");
    
    if (process.env.NODE_ENV === "production") {
      console.error("\n📌 For Render deployments:");
      console.error("   - Render uses dynamic IPs, so use 0.0.0.0/0");
      console.error("   - Update MongoDB whitelist and wait 2-3 minutes");
      console.error("   - Then trigger a redeploy on Render");
    }
  }
  
  throw lastError;
};

/**
 * Test MongoDB connection with detailed diagnostics
 */
export const testConnection = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    console.log(`MongoDB State: ${states[state]} (${state})`);
    
    if (state === 1) {
      // Test a simple query
      await mongoose.connection.db.admin().ping();
      console.log("✅ MongoDB ping successful");
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ MongoDB test failed:", error.message);
    return false;
  }
};
    
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

