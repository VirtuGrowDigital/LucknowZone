import News from "../models/News.js";
import axios from "axios";

// GET ALL NEWS (API + Manual)
export const getAllNews = async (req, res) => {
  try {
    const manualNews = await News.find().sort({ createdAt: -1 });

    let apiNews = [];
    try {
      const newsRes = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`
      );

      apiNews = newsRes.data.articles.map((item) => ({
        title: item.title,
        description: item.description,
        category: "API-News",
        image: item.urlToImage,
        isAPI: true,
        hidden: false,
        type: "news",
        createdAt: item.publishedAt
      }));
    } catch (err) {
      console.log("News API failed:", err.message);
    }

    const all = [...manualNews, ...apiNews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "Failed to load news" });
  }
};

// CREATE NEWS
export const createNews = async (req, res) => {
  try {
    await News.create({
      ...req.body,
      isAPI: false,
      createdAt: new Date()
    });

    res.json({ message: "News added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create news" });
  }
};

// UPDATE NEWS
export const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ error: "Not found" });
    if (news.isAPI) return res.status(403).json({ error: "API news can't be edited" });

    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ message: "Updated", updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

// DELETE NEWS
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ error: "Not found" });
    if (news.isAPI) return res.status(403).json({ error: "API news can't be deleted" });

    await News.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// TOGGLE HIDE
export const toggleHidden = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ error: "Not found" });
    if (news.isAPI) return res.status(403).json({ error: "API news can't be hidden" });

    news.hidden = !news.hidden;
    await news.save();

    res.json({ message: "Updated", hidden: news.hidden });
  } catch (err) {
    res.status(500).json({ error: "Toggle failed" });
  }
};

export const getPaginatedNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await News.countDocuments();
    const data = await News.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      total,
      pages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    res.status(500).json({ error: "Pagination failed" });
  }
};
