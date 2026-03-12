import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./src/models/User.js";

dotenv.config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "eurobridge"
    });
    
    const users = await User.find({}, { name: 1, email: 1, role: 1, createdAt: 1 });
    
    console.log(`\n📊 Found ${users.length} users in database:\n`);
    users.forEach((u, i) => {
      console.log(`${i + 1}. ${u.name} (${u.email}) - Role: ${u.role}`);
    });
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

listUsers();
