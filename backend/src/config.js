import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Load environment variables from .env file only in development
 * In production (Render), variables are provided by the platform
 */
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "..", ".env") });
}

/**
 * Centralized environment configuration
 * Validates required variables and provides sensible defaults
 */
export const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "eurobridge",
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};

/**
 * Validate that all required environment variables are set
 * @throws {Error} If required variables are missing
 */
export const validateConfig = () => {
  const errors = [];

  // Check JWT_SECRET
  if (!config.JWT_SECRET) {
    errors.push(
      "❌ JWT_SECRET is missing",
      "   → Set JWT_SECRET in environment variables",
      "   → On Render: Go to Environment tab and add JWT_SECRET"
    );
  }

  // Check MONGODB_URI
  if (!config.MONGODB_URI) {
    errors.push(
      "❌ MONGODB_URI is missing",
      "   → Set MONGODB_URI in environment variables",
      "   → On Render: Go to Environment tab and add MONGODB_URI",
      "   → Format: mongodb+srv://user:password@cluster.mongodb.net/dbname"
    );
  }

  if (errors.length > 0) {
    console.error("\n🔴 CONFIGURATION ERROR - Missing Required Environment Variables\n");
    console.error(errors.join("\n"));
    console.error("\n💡 SOLUTIONS:");
    console.error("   1. Local Development:");
    console.error("      → Copy backend/.env.example to backend/.env");
    console.error("      → Fill in your actual values\n");
    console.error("   2. Production (Render):");
    console.error("      → Go to Render Dashboard → Service → Environment");
    console.error("      → Add JWT_SECRET and MONGODB_URI");
    console.error("      → Click Save and redeploy\n");
    
    throw new Error(`Missing required environment variables: ${errors.length} error(s)`);
  }
};

/**
 * Log configuration status (without exposing secrets)
 */
export const logConfigStatus = () => {
  console.log("\n✅ Environment Configuration Loaded\n");
  console.log(`  NODE_ENV:      ${config.NODE_ENV}`);
  console.log(`  PORT:          ${config.PORT}`);
  console.log(`  JWT_SECRET:    Set (${config.JWT_SECRET?.length || 0} characters)`);
  console.log(`  MONGODB_URI:   ${config.MONGODB_URI?.replace(/:([^@]+)@/, ":****@") || "NOT SET"}`);
  console.log(`  DATABASE:      ${config.MONGODB_DB_NAME}`);
  console.log(`  CORS_ORIGIN:   ${config.CORS_ORIGIN}`);
  console.log();
};

export default config;
