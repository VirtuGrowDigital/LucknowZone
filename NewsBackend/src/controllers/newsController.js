import News from "../models/News.js";
import BreakingNews from "../models/BreakingNews.js";
import axios from "axios";

/* =========================================================
   ✅ GET ALL APPROVED NEWS
   ========================================================= */
export const getAllNews = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { hidden: false, status: "approved" };

    if (category && category !== "All") query.category = category;

    const news = await News.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: news });
  } catch {
    res.status(500).json({ error: "Failed to load news" });
  }
};

/* =========================================================
   📥 IMPORT API NEWS (NEWSData.io ✅)
   ========================================================= */
export const importExternalNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key missing" });

    let region = req.query.region || "international";

    // Convert UI region → stored DB region
    if (region === "lucknow") region = "local";
    if (region === "national") region = "national";
    if (region === "international") region = "international";

    // 🔥 FIXED: Generate correct API query based on region
    let query = "world";
    if (region === "local") query = "local";
    if (region === "national") query = "india";
    if (region === "international") query = "world";

    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${query}&language=en`;

    console.log("🌐 Fetching:", url);

    const response = await axios.get(url);
    const results = response.data?.results || [];

    if (!results.length) return res.json({ success: true, imported: 0 });

    // Remove DB duplicates
    const titles = results.map((r) => r.title);
    const existing = await News.find({ title: { $in: titles } }, { title: 1 });

    const existingSet = new Set(existing.map((e) => e.title));

    const toInsert = results
      .filter((r) => r.title && r.image_url && !existingSet.has(r.title))
      .map((r) => ({
        title: r.title,
        description: r.description || "",
        image: r.image_url,
        category: "LZN",
        region, // 🔥 CORRECT FIX — region saved as local/national/international
        isAPI: true,
        status: "pending",
        hidden: false,
        createdAt: r.pubDate ? new Date(r.pubDate) : new Date(),
      }));

    if (toInsert.length) {
      await News.insertMany(toInsert, { ordered: false });
    }

    res.json({
      success: true,
      imported: toInsert.length,
      region,
    });
  } catch (err) {
    console.error("❌ API IMPORT ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "API import failed" });
  }
};


/* =========================================================
   🕒 GET PENDING API NEWS (ADMIN)
   ========================================================= */
export const getPendingNews = async (req, res) => {
  try {
    const { region = "all" } = req.query;

    let query = { isAPI: true, status: "pending" };
    if (region !== "all") query.region = region;

    const pending = await News.find(query).sort({ createdAt: -1 });
    res.json({ success: true, pending });
  } catch {
    res.status(500).json({ error: "Failed to fetch pending news" });
  }
};

export const getNewsByRegion = async (req, res) => {
  try {
    const { region } = req.query;

    const data = await News.find({
      region,
      status: "approved",
      hidden: false,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ error: "Failed to load region news" });
  }
};


/* =========================================================
   ✅ APPROVE / ❌ REJECT
   ========================================================= */
export const approveNews = async (req, res) => {
  const updated = await News.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  res.json({ success: true, updated });
};

export const rejectNews = async (req, res) => {
  await News.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ success: true });
};

/* =========================================================
   ✅ MANUAL NEWS
   ========================================================= */
export const createNews = async (req, res) => {
  await News.create({
    ...req.body,
    isAPI: false,
    status: "approved",
    hidden: false,
    createdAt: new Date(),
  });
  res.json({ success: true });
};

/* =========================================================
   🔄 UPDATE / ❌ DELETE / 👁 TOGGLE
   ========================================================= */
export const updateNews = async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return res.status(404).json({ error: "Not found" });

  // ❗ Still block API edits because you said you don't want to modify API content
  if (news.isAPI) return res.status(403).json({ error: "API news cannot be edited" });

  const updated = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({ success: true, updated });
};

export const deleteNews = async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return res.status(404).json({ error: "Not found" });

  // ❗ Now API news CAN be deleted (removed restriction)
  await news.deleteOne();

  res.json({ success: true });
};

export const toggleHidden = async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return res.status(404).json({ error: "Not found" });

  // ❗ Now API news CAN be hidden/unhidden
  news.hidden = !news.hidden;
  await news.save();

  res.json({ success: true });
};


/* =========================================================
   📄 PAGINATION
   ========================================================= */
export const getPaginatedNews = async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  let query = { hidden: false, status: "approved" };
  if (category && category !== "All") query.category = category;

  const data = await News.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await News.countDocuments(query);

  res.json({
    success: true,
    data,
    total,
    pages: Math.ceil(total / limit),
  });
};

/* =========================================================
   🔥 BREAKING NEWS
   ========================================================= */
export const getBreakingNews = async (req, res) => {
  const breaking = await BreakingNews.find().sort({ createdAt: -1 });
  res.json({ success: true, breaking });
};

export const addBreakingNews = async (req, res) => {
  const item = await BreakingNews.create({
    text: req.body.text,
    active: true,
    createdAt: new Date(),
  });
  res.json({ success: true, item });
};

export const deleteBreakingNews = async (req, res) => {
  await BreakingNews.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

export const toggleBreakingNews = async (req, res) => {
  const item = await BreakingNews.findById(req.params.id);
  item.active = !item.active;
  await item.save();
  res.json({ success: true });
};
