import express from "express";
import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  toggleHidden,
  getPaginatedNews,
  getBreakingNews,
  addBreakingNews,
  deleteBreakingNews,
  toggleBreakingNews,
} from "../controllers/newsController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// Regular News Routes
router.get("/", getAllNews);
router.post("/", auth, createNews);
router.put("/:id", auth, updateNews);
router.delete("/:id", auth, deleteNews);
router.put("/toggle/:id", auth, toggleHidden);
router.get("/paginated", getPaginatedNews);

// 🔥 Breaking News (Ticker) Routes — Correct ones
router.get("/breaking", getBreakingNews);
router.post("/breaking", auth, addBreakingNews);
router.delete("/breaking/:id", auth, deleteBreakingNews);
router.patch("/breaking/:id/toggle", auth, toggleBreakingNews);

export default router;
