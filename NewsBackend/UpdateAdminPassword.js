import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./src/models/Admin.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

mongoose.connect(process.env.MONGO_URI).then(async () => {

  const hashed = await bcrypt.hash("Admin@123", 10);

  const result = await Admin.updateOne(
    { email: "Animeshyadav70@gmail.com" },
    { $set: { password: hashed } }
  );

  console.log("Updated:", result);
  console.log("✅ Admin password updated to Admin@123");
  process.exit();
});
