import express from "express";
import { generateTags } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-tags", generateTags);

export default router;
