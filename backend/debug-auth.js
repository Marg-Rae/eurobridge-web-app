import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

dotenv.config();

console.log("🚀 Starting auth debug...");

const debugAuth = async () => {
  try {
    console.log("📊 Connecting to MongoDB...");
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "eurobridge"
    });
    console.log("✓ MongoDB connected");

    // Check existing users
    const users = await User.find();
    console.log(`\n✓ Found ${users.length} users in database:`);
    users.forEach(u => console.log(`  - ${u.email} (role: ${u.role})`));

    // Try to login with test user
    const email = "test@example.com";
    const password = "password123";
    
    console.log(`\n📝 Attempting login with: ${email}`);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ User not found in database");
      console.log(`\n📝 Creating test user...`);
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({
        name: "Test User",
        email,
        password: hashedPassword,
        role: "student"
      });
      console.log(`✓ Test user created: ${newUser.email}`);
    } else {
      console.log(`✓ User found: ${user.email} (role: ${user.role})`);
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log(`✓ Password match: ${passwordMatch}`);
    }

    // Test JWT
    console.log(`\n🔑 JWT_SECRET: ${process.env.JWT_SECRET || "NOT SET"}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

debugAuth();
