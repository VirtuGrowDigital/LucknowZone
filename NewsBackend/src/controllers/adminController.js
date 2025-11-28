import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ------------------ LOGIN ADMIN ------------------
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📩 Email received from frontend:", email);
    console.log("🔑 Password received from frontend:", password);

    const admin = await Admin.findOne({ email });

    console.log("📘 Admin found in database:", admin);

    if (!admin) {
      console.log("❌ No admin found with this email");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🟦 Password match status:", isMatch);

    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful, sending token...");
    res.json({ token });

  } catch (error) {
    console.log("🔥 Server error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

