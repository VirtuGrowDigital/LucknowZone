// ============================================
// 1️⃣ Load ENV BEFORE ANYTHING ELSE
// ============================================
import dotenv from "dotenv";
dotenv.config();

// ============================================
// 2️⃣ Import dependencies
// ============================================
import express from "express";
import cors from "cors";
import https from "https";
import axios from "axios";

import connectDB from "./src/config/db.js";

import newsRoutes from "./src/routes/newsRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import blogRoutes from "./src/routes/blogRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

// ============================================
// 3️⃣ Connect DB
// ============================================
connectDB();

// Debug (safe on Render)
console.log("JWT Loaded:", !!process.env.JWT_SECRET);
console.log("News API Loaded:", !!process.env.NEWS_API_KEY);

// ============================================
// 4️⃣ Create Express App
// ============================================
const app = express();

// ============================================
// 5️⃣ CORS CONFIG (FIXED)
// ============================================
const allowedOrigins = [
  "http://localhost:5173",
  "https://lucknowzone.netlify.app",
  "https://lucknowzoneadmin.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🚨 REQUIRED for preflight requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return cors()(req, res, next);
  }
  next();
});

// ============================================
// 6️⃣ Middlewares
// ============================================
app.use(express.json({ limit: "25mb" }));

// ============================================
// 7️⃣ ROUTES
// ============================================
app.use("/auth", authRoutes);
app.use("/news", newsRoutes);
app.use("/blogs", blogRoutes);
app.use("/ai", aiRoutes);

// ============================================
// 8️⃣ GLOBAL IMAGE PROXY
// ============================================
app.get("/proxy-image", async (req, res) => {
  try {
    const imageUrl = req.query.url;

    // If no URL, return fallback image (200 OK)
    if (!imageUrl) {
      return res.status(200).sendFile("Fallback.png", { root: "public" });
    }

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "image/*",
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      validateStatus: () => true,
    });

    // If image fetched successfully
    if (response.status >= 200 && response.status < 300) {
      res.set("Content-Type", response.headers["content-type"] || "image/jpeg");
      return res.status(200).send(response.data);
    }

    // If fetch failed → fallback image (still 200)
    return res.status(200).sendFile("Fallback.png", { root: "public" });
  } catch (err) {
    // Any error → fallback image (still 200)
    return res.status(200).sendFile("Fallback.png", { root: "public" });
  }
});

// ============================================
// 9️⃣ Health Check
// ============================================
app.get("/", (req, res) => {
  res.send("News API Running...");
});

// ============================================
// 🔟 Start Server
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
