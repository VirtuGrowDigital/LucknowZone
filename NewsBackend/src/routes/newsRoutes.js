import express from "express";
import auth from "../middleware/auth.js";

import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  toggleHidden,
  getPaginatedNews,

  // API news
  importExternalNews,
  getPendingNews,
  approveNews,
  rejectNews,

  // Breaking news
  getBreakingNews,
  addBreakingNews,
  deleteBreakingNews,
  toggleBreakingNews,
  getNewsByRegion,
} from "../controllers/newsController.js";

const router = express.Router();

/* ===========================
   📰 NEWS
=========================== */

router.get("/", getAllNews);
router.post("/", auth, createNews);
router.put("/:id", auth, updateNews);
router.delete("/:id", auth, deleteNews);
router.put("/toggle/:id", auth, toggleHidden);
router.get("/paginated", getPaginatedNews);

/* ===========================
   📥 API NEWS (newsdata.io)
=========================== */

// ✅ ONE importer (region handled via query)
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

export default router;
