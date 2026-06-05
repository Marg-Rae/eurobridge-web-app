import mongoose from "mongoose";
import dotenv from "dotenv";
import courseSeeds from "./courseSeeds.js";
import Course from "./src/models/Course.js";

dotenv.config();

async function seedCourses() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "eurobridge"
    });
    console.log("✅ Connected to MongoDB");

    console.log("🗑️  Clearing existing courses...");
    await Course.deleteMany({});

    console.log("📚 Seeding courses...");
    const result = await Course.insertMany(courseSeeds);
    console.log(`✅ Successfully created ${result.length} courses!`);

    console.log("\n📊 Courses created:");
    result.forEach((course, index) => {
      console.log(`   ${index + 1}. "${course.title}" (${course.level})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding courses:", error.message);
    process.exit(1);
  }
}

seedCourses();
