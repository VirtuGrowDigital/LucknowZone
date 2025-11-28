import express from "express";
import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  toggleHidden
} from "../controllers/newsController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// PUBLIC ROUTE → Get all news (API + manual combined)
router.get("/", getAllNews);

// ADMIN ROUTES → Protected with JWT
router.post("/", auth, createNews);
router.put("/:id", auth, updateNews);
router.delete("/:id", auth, deleteNews);

// ⭐ NEW ROUTE → TOGGLE HIDE / UNHIDE
router.put("/toggle/:id", auth, toggleHidden);

export default router;
