import express from "express";
import auth from "../middleware/auth.js";

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
