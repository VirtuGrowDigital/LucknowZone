import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    category: {
      type: String,
      required: true,
      enum: [
        "Top Stories",
        "Local",
        "Politics",
        "Sports",
        "Tech",
        "Health",
        "Business",
        "Entertainment",
        "Blog",
        "New" // for imported API news
      ]
    },

    image: { type: String, required: true }, // URL or Base64

    type: { type: String, default: "news" },

    isAPI: { type: Boolean, default: false }, // API news cannot be edited/deleted

    hidden: { type: Boolean, default: false }, // used for toggle hide
    
    isDontMiss: { type: Boolean, default: false },
 

    // 🔹 NEW: Region (for API news classification)
    region: {
      type: String,
      enum: ["local", "national", "international"],
      default: null,
    },

    // 🔹 NEW: Status (used by your controllers already)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true } // auto adds createdAt + updatedAt
);

/* 🔥 IMPORTANT: Unique index to block duplicate API news
   - same title + same region + isAPI:true → only one document allowed
   - manual news (isAPI:false) are NOT affected
*/
NewsSchema.index(
  { title: 1, region: 1, isAPI: 1 },
  { unique: true }
);

export default mongoose.model("News", NewsSchema);
