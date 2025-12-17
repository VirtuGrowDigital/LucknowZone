import express from "express";
import auth from "../middleware/auth.js";
import News from "../models/News.js";

import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  toggleHidden,
  getPaginatedNews,

  importExternalNews,
  getPendingNews,
  approveNews,
  rejectNews,

  getBreakingNews,
  addBreakingNews,
  deleteBreakingNews,
  toggleBreakingNews,
  getNewsByRegion,
  undoApproveNews,
} from "../controllers/newsController.js";

const router = express.Router();

/* ===========================
   📥 API NEWS (newsdata.io)
=========================== */

// specific routes FIRST 🚨
router.get("/import", importExternalNews);
router.get("/by-region", getNewsByRegion);

/* ===========================
   🕒 PENDING API NEWS
=========================== */

router.get("/pending", getPendingNews);
router.patch("/:id/approve", approveNews);
router.patch("/:id/reject", rejectNews);
router.patch("/:id/undo", undoApproveNews);
// GET single news by ID
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


/* ===========================
   🔥 BREAKING NEWS
=========================== */

router.get("/breaking", getBreakingNews);
router.post("/breaking", auth, addBreakingNews);
router.delete("/breaking/:id", auth, deleteBreakingNews);
router.patch("/breaking/:id/toggle", auth, toggleBreakingNews);

/* ===========================
   📰 NEWS
=========================== */

router.get("/", getAllNews);
router.get("/paginated", getPaginatedNews);
router.post("/", auth, createNews);

// 👇 dynamic routes MUST COME LAST
router.put("/:id", auth, updateNews);
router.delete("/:id", auth, deleteNews);
router.put("/toggle/:id", auth, toggleHidden);

export default router;
