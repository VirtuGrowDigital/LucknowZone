import mongoose from "mongoose";

const SavedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  articleId: { type: String, required: true },  // store article _id
  article: { type: Object, required: true },    // store article snapshot
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Saved", SavedSchema);
