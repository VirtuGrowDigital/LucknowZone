// ============================================
// 1️⃣ Load ENV BEFORE ANYTHING ELSE
// ============================================
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// ============================================
// 2️⃣ Now import all other dependencies
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
// 3️⃣ Connect to DB AFTER loading env
// ============================================
connectDB();

// Debug check
console.log("Loaded JWT SECRET:", process.env.JWT_SECRET);
console.log("Loaded NEWS API KEY:", process.env.NEWS_API_KEY);

// ============================================
// 4️⃣ Start Express App
// ============================================
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lucknowzone.netlify.app",
      "https://lucknowzone.netlify.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "25mb" }));
app.use("/blogs", blogRoutes);

// ============================================
// 5️⃣ GLOBAL IMAGE PROXY
// ============================================
app.get("/proxy-image", async (req, res) => {
  try {
    const imageUrl = req.query.url;

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      validateStatus: () => true,
    });

    if (response.status >= 200 && response.status < 300) {
      res.set("Content-Type", response.headers["content-type"]);
      return res.send(response.data);
    }

    res.sendFile("Fallback.png", { root: "public" });
  } catch (error) {
    res.sendFile("Fallback.png", { root: "public" });
  }
});

// ============================================
// 6️⃣ ROUTES
// ============================================
app.use("/auth", authRoutes);
app.use("/news", newsRoutes);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("News API Running...");
});

// ============================================
// 7️⃣ START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
