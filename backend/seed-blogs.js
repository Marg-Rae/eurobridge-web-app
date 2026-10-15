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

    console.log("📝 Adding any missing seed blog posts...");
    const result = await Blog.bulkWrite(
      blogSeeds.map((blog) => ({
        updateOne: {
          filter: { slug: blog.slug },
          update: { $setOnInsert: blog },
          upsert: true
        }
      }))
    );
    console.log(`✅ Added ${result.upsertedCount} blog posts; existing posts were preserved.`);

    console.log("\n📊 Seed blog posts already present or added:");
    blogSeeds.forEach((blog, index) => {
      console.log(`   ${index + 1}. "${blog.title}"`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding blogs:", error.message);
    process.exit(1);
  }
}

seedBlogs();
