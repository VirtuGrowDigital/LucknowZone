import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { loginAdmin } from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import Admin from "../models/Admin.js";

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

// Admin Login
router.post("/admin/login", loginAdmin);


// TEMP CHECK ROUTE (remove later)
router.get("/check-admin", async (req, res) => {
  const admin = await Admin.findOne({ email: "Animeshyadav70@gmail.com" });
  console.log("ADMIN FOUND IN DB:", admin);
  res.json(admin || { message: "No admin found" });
});

export default router;
