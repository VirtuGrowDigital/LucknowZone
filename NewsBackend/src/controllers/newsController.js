import News from "../models/News.js";
import BreakingNews from "../models/BreakingNews.js";
import axios from "axios";

/* =========================================================
   📍 LUCKNOW KEYWORD TARGETING
   ========================================================= */

const LUCKNOW_KEYWORDS = [
  "lucknow",
  "lko",
  "hazratganj",
  "aminabad",
  "chowk",
  "charbagh",
  "alambagh",
  "gomti nagar",
  "gomti nagar extension",
  "patrakarpuram",
  "indira nagar",
  "munshi pulia",
  "jankipuram",
  "aliganj",
  "ashiyana",
  "krishna nagar",
  "sarojini nagar",
  "mohanlalganj",
  "bakshi ka talab",
  "bkt",
  "kakori",
  "lucknow police",
  "lmc",
  "lda",
  "kgmu",
  "lucknow university",
  "iim lucknow",
  "ekana stadium",
  "lulu mall",
  "phoenix palassio",
];

const BLOCK_KEYWORDS = [
  "kanpur",
  "varanasi",
  "prayagraj",
  "agra",
  "meerut",
  "noida",
  "ghaziabad",
];

const lucknowScore = (article) => {
  const text = `
    ${article.title || ""}
    ${article.description || ""}
    ${article.content || ""}
  `.toLowerCase();

  if (BLOCK_KEYWORDS.some((b) => text.includes(b))) return 0;

  return LUCKNOW_KEYWORDS.filter((k) => text.includes(k)).length;
};

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
   📥 IMPORT API NEWS (NewsData.io)
   ========================================================= */
export const importExternalNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key missing" });

    let region = req.query.region || "international";

    if (region === "lucknow") region = "local";
    if (region === "national") region = "national";
    if (region === "international") region = "international";

    let query = "world";
    if (region === "local") query = "uttar pradesh OR lucknow OR lko";
    if (region === "national") query = "india";

    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${query}&language=en`;
    const response = await axios.get(url);
    let results = response.data?.results || [];

    if (region === "local") {
      results = results
        .map((r) => ({ ...r, score: lucknowScore(r) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score);
    }

    const titles = results.map((r) => r.title);
    const existing = await News.find({ title: { $in: titles }, region });
    const existingSet = new Set(existing.map((e) => e.title));

    const toInsert = results
      .filter((r) => r.title && r.image_url && !existingSet.has(r.title))
      .map((r) => ({
        title: r.title,
        description: r.description || "",
        image: r.image_url,
        category: "New",
        region,
        isAPI: true,
        status: "pending",
        hidden: false,
        createdAt: r.pubDate ? new Date(r.pubDate) : new Date(),
      }));

    if (toInsert.length) {
      await News.insertMany(toInsert, { ordered: false });
    }

    res.json({ success: true, imported: toInsert.length, region });
  } catch (err) {
    console.error("❌ API IMPORT ERROR:", err.message);
    res.status(500).json({ error: "API import failed" });
  }
};

/* =========================================================
   🕒 GET PENDING API NEWS
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

/* =========================================================
   📂 GET NEWS BY REGION
   ========================================================= */
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
   ✅ APPROVE (WITH REGION)
   ========================================================= */
export const approveNews = async (req, res) => {
  const { region } = req.body;

  const updated = await News.findByIdAndUpdate(
    req.params.id,
    {
      status: "approved",
      ...(region && { region }),
    },
    { new: true }
  );

  res.json({ success: true, updated });
};

/* =========================================================
   ↩ UNDO APPROVAL
   ========================================================= */
export const undoApproveNews = async (req, res) => {
  const updated = await News.findByIdAndUpdate(
    req.params.id,
    { status: "pending" },
    { new: true }
  );

  res.json({ success: true, updated });
};

/* =========================================================
   ❌ REJECT
   ========================================================= */
export const rejectNews = async (req, res) => {
  await News.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ success: true });
};

/* =========================================================
   ✍ MANUAL NEWS
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

  if (news.isAPI)
    return res.status(403).json({ error: "API news cannot be edited" });

  const updated = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json({ success: true, updated });
};

export const deleteNews = async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return res.status(404).json({ error: "Not found" });

  await news.deleteOne();
  res.json({ success: true });
};

export const toggleHidden = async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return res.status(404).json({ error: "Not found" });

  news.hidden = !news.hidden;
  await news.save();

  res.json({ success: true });
};

/* =========================================================
   📄 PAGINATION
   ========================================================= */
export const getPaginatedNews = async (req, res) => {
  try {
    let { page = 1, limit = 10, category } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      return res.status(400).json({ error: "Invalid pagination params" });
    }

    let query = { hidden: false, status: "approved" };

    if (category && category !== "All") {
      query.category = category;
    }

    const data = await News.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await News.countDocuments(query);

    res.json({
      success: true,
      data,
      total,
      pages: Math.ceil(total / limit),
      page,
    });
  } catch (err) {
    console.error("Pagination error:", err);
    res.status(500).json({ error: "Failed to load paginated news" });
  }
};

/* =========================================================
   🔥 BREAKING NEWS (FIXED & SAFE)
   ========================================================= */

export const getBreakingNews = async (req, res) => {
  try {
    const breaking = await BreakingNews.find({ active: true }).sort({
      createdAt: -1,
    });

    res.json({ success: true, breaking });
  } catch (err) {
    console.error("❌ Breaking news fetch error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to load breaking news",
    });
  }
};

export const addBreakingNews = async (req, res) => {
  try {
    const item = await BreakingNews.create({
      text: req.body.text,
      active: true,
      createdAt: new Date(),
    });

    res.json({ success: true, item });
  } catch (err) {
    console.error("❌ Add breaking news error:", err);
    res.status(500).json({ success: false });
  }
};

export const deleteBreakingNews = async (req, res) => {
  try {
    await BreakingNews.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete breaking news error:", err);
    res.status(500).json({ success: false });
  }
};

export const toggleBreakingNews = async (req, res) => {
  try {
    const item = await BreakingNews.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });

    item.active = !item.active;
    await item.save();

    res.json({ success: true, item });
  } catch (err) {
    console.error("❌ Toggle breaking news error:", err);
    res.status(500).json({ success: false });
  }
};

export const getDontMissNews = async (req, res) => {
  try {
    const news = await News.find({
      isDontMiss: true,
      status: "approved",
      hidden: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ success: true, data: news });
  } catch (err) {
    console.error("DontMiss error:", err);
    res.status(500).json({ error: "Failed to load Dont Miss news" });
  }
};
// =========================================================
// ⭐ TOGGLE DONT MISS (ADMIN ONLY)
// =========================================================
export const toggleDontMiss = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    news.isDontMiss = !news.isDontMiss;
    await news.save();

    res.json({
      success: true,
      isDontMiss: news.isDontMiss,
    });
  } catch (err) {
    console.error("Toggle DontMiss error:", err);
    res.status(500).json({ error: "Failed to toggle Dont Miss" });
  }
};

