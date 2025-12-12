import express from "express";
import {
  register,
  login,
  getMe
} from "../controllers/authController.js";

import { loginAdmin } from "../controllers/adminController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ===============================
// USER AUTH ROUTES
// ===============================

// User Register
router.post("/register", register);

// User Login
router.post("/login", login);

// Get logged-in user
router.get("/me", auth, getMe);


// ===============================
// ADMIN AUTH ROUTES
// ===============================

// Admin Login -> separate endpoint
router.post("/admin/login", loginAdmin);


export default router;
