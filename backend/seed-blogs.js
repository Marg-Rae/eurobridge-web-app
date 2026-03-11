import mongoose from "mongoose";
import dotenv from "dotenv";
import blogSeeds from "./blogSeeds.js";
import Blog from "./src/models/Blog.js";

dotenv.config();

async function seedBlogs() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "eurobridge"
    });
    console.log("✅ Connected to MongoDB");

    console.log("🗑️  Clearing existing blogs...");
    await Blog.deleteMany({});

    console.log("📝 Seeding example blog posts...");
    const result = await Blog.insertMany(blogSeeds);
    console.log(`✅ Successfully created ${result.length} blog posts!`);

    console.log("\n📊 Blog posts created:");
    result.forEach((blog, index) => {
      console.log(`   ${index + 1}. "${blog.title}"`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding blogs:", error.message);
    process.exit(1);
  }
}

seedBlogs();
