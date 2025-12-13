import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ------------------ LOGIN ADMIN ------------------
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📩 Admin login email:", email);

    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Admin login successful");
    res.json({ token });

  } catch (error) {
    console.log("🔥 Admin login error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
