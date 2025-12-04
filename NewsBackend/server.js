import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import newsRoutes from "./src/routes/newsRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";

dotenv.config({ path: "./.env" });
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // IMPORTANT for Base64

app.use("/auth", authRoutes);
app.use("/news", newsRoutes);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("News API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
