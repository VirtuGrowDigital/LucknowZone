import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // 🔐 NEVER expose by default
    },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", AdminSchema);
