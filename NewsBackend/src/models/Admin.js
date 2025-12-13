import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

export default mongoose.model("Admin", adminSchema,"admins");
