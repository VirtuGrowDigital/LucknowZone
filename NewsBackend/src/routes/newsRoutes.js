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
   📥 API NEWS
=========================== */

router.get("/import", importExternalNews);
router.get("/by-region", getNewsByRegion);

/* ===========================
   🕒 PENDING API NEWS
=========================== */

router.get("/pending", getPendingNews);
router.patch("/:id/approve", approveNews);
router.patch("/:id/reject", rejectNews);
router.patch("/:id/undo", undoApproveNews);

/* ===========================
   🔥 BREAKING NEWS (MUST COME FIRST)
=========================== */

router.get("/breaking", getBreakingNews);
router.post("/breaking", auth, addBreakingNews);
router.delete("/breaking/:id", auth, deleteBreakingNews);
router.patch("/breaking/:id/toggle", auth, toggleBreakingNews);

/* ===========================
   🔍 SINGLE NEWS (AMP PAGE)
=========================== */

router.get("/:id", async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });

    res.json(news);
  } catch (err) {
    console.error("Get news error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===========================
   📰 NEWS LIST & CRUD
=========================== */

router.get("/", getAllNews);
router.get("/paginated", getPaginatedNews);
router.post("/", auth, createNews);
router.get("/dont-miss", getDontMissNews);
router.put("/:id", auth, updateNews);
router.delete("/:id", auth, deleteNews);
router.put("/toggle/:id", auth, toggleHidden);

export default router;
