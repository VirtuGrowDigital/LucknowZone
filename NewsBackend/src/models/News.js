import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    image: String,       // BASE64 OR URL
    type: String,        // always "news"
    isAPI: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("News", NewsSchema);
