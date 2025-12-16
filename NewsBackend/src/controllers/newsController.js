import News from "../models/News.js";
import BreakingNews from "../models/BreakingNews.js";
import axios from "axios";

/* =========================================================
   🕒 GET PENDING API NEWS
   ========================================================= */
export const getPendingNews = async (req, res) => {
  try {
    const pending = await News.find({
      isAPI: true,
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json({ success: true, pending });
  } catch {
    res.status(500).json({ error: "Failed to fetch pending news" });
  }
};

/* =========================================================
   ✅ APPROVE → SET CATEGORY
   ========================================================= */
export const approveNews = async (req, res) => {
  const { category } = req.body;

  const updated = await News.findByIdAndUpdate(
    req.params.id,
    {
      status: "approved",
      category,
    },
    { new: true }
  );

  res.json({ success: true, updated });
};

/* =========================================================
   ↩ UNDO APPROVAL
   ========================================================= */
export const undoApproveNews = async (req, res) => {
  const updated = await News.findByIdAndUpdate(
    req.params.id,
    { status: "pending" },
    { new: true }
  );

  res.json({ success: true, updated });
};

/* =========================================================
   ❌ REJECT
   ========================================================= */
export const rejectNews = async (req, res) => {
  await News.findByIdAndUpdate(req.params.id, {
    status: "rejected",
  });

  res.json({ success: true });
};

/* =========================================================
   ✅ GET NEWS BY CATEGORY (USED BY Business.jsx etc.)
   ========================================================= */
export const getNewsByCategory = async (req, res) => {
  const { category } = req.query;

  const data = await News.find({
    category,
    status: "approved",
    hidden: false,
  }).sort({ createdAt: -1 });

  res.json({ success: true, data });
};
