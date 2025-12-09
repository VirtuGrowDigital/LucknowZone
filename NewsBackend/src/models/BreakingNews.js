import mongoose from "mongoose";

const breakingNewsSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("BreakingNews", breakingNewsSchema);
