import express from "express";
import auth from "../middleware/auth.js";
import { saveArticle, getSavedArticles, deleteSavedArticle } from "../controllers/savedController.js";

const router = express.Router();

router.post("/:id", auth, saveArticle);
router.get("/", auth, getSavedArticles);
router.delete("/:id", auth, deleteSavedArticle);

export default router;
