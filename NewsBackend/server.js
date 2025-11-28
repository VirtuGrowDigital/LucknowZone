import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import newsRoutes from "./src/routes/newsRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);


// Routes
app.use("/api/news", newsRoutes);

app.get("/", (req, res) => {
  res.send("News API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
