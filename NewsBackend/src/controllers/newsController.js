import News from "../models/News.js";
import axios from "axios";

// ========== GET ALL NEWS (Manual + API) ==========
export const getAllNews = async (req, res) => {
  try {
    const manualNews = await News.find().sort({ createdAt: -1 });

    // Fetch API News
    let apiNews = [];
    try {
      const apiRes = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`
      );

      apiNews = apiRes.data.articles.map((item) => ({
        title: item.title,
        description: item.description,
        content: item.content,
        category: "ApiNews",
        image: item.urlToImage,
        author: item.source.name || "Unknown",
        createdAt: item.publishedAt,
        isAPI: true,     // Important flag
        hidden: false,   // API news should always be visible
        type: "news"
      }));
    } catch (e) {
      console.log("API fetch failed", e.message);
    }

    // Combine both
    const allNews = [...manualNews, ...apiNews];

    // Sort by time
    allNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allNews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

// ========== CREATE NEWS ==========
export const createNews = async (req, res) => {
  try {
    const newPost = new News({
      ...req.body,
      isAPI: false,
      createdAt: new Date()
    });

    await newPost.save();

    res.json({ message: "News added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create news" });
  }
};

// ========== UPDATE MANUAL NEWS ==========
export const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    if (news.isAPI) {
      return res.status(403).json({ error: "API news cannot be updated" });
    }

    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ message: "News updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update news" });
  }
};

// ========== DELETE MANUAL NEWS ==========
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    if (news.isAPI) {
      return res.status(403).json({ error: "API news cannot be deleted" });
    }

    await News.findByIdAndDelete(req.params.id);

    res.json({ message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete news" });
  }
};

// ========== TOGGLE HIDDEN ==========
export const toggleHidden = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    if (news.isAPI) {
      return res.status(403).json({ error: "API news cannot be hidden" });
    }

    news.hidden = !news.hidden;
    await news.save();

    res.json({ message: "Visibility updated", hidden: news.hidden });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle hidden state" });
  }
};
