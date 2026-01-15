import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../src/models/Admin.js";

dotenv.config();

async function setupAdmin() {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
    }

    if (process.env.ADMIN_PASSWORD.length < 10) {
      throw new Error("Admin password must be at least 10 characters");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

    if (admin) {
      admin.password = hashed;
      await admin.save();
      console.log("✅ Admin password updated");
    } else {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: hashed,
        role: "admin",
      });
      console.log("✅ Admin created successfully");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Admin setup failed:", err.message);
    process.exit(1);
  }
}

setupAdmin();
