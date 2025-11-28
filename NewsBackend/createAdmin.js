import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./src/models/Admin.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashed = await bcrypt.hash("Admin@123", 10);

  await Admin.create({
    email: "animeshyadav70@gmail.com",
    password: hashed,
  });

  console.log("Admin created successfully!");
  process.exit();
});
