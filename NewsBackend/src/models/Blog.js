import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  image: String, 
  tags: String,
  type: blog,
  createdAt: Date,
});

export default mongoose.model("Blog", BlogSchema);
