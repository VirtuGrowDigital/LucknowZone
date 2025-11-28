import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    category: { type: String, required: true },
    image: { type: String }, // URL
    author: { type: String, default: "Admin" },
    type: { type: String, enum: ["news", "blog"], default: "news" },

  isAPI: { type: Boolean, default: false },

  hidden: { type: Boolean, default: false }
}, {
  timestamps: true
  },
);

export default mongoose.model("News", newsSchema);
