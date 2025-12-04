import express from "express";
import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  toggleHidden,
  getPaginatedNews,
} from "../controllers/newsController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllNews);
router.post("/", auth, createNews);
router.put("/:id", auth, updateNews);
router.delete("/:id", auth, deleteNews);
router.put("/toggle/:id", auth, toggleHidden);
router.get("/paginated", getPaginatedNews);


export default router;
