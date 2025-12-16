import Saved from "../models/Saved.js";

export const saveArticle = async (req, res) => {
  try {
    const userId = req.user.id;
    const articleId = req.params.id;

    const exists = await Saved.findOne({ userId, articleId });
    if (exists) return res.json({ message: "Already saved" });

    const saved = await Saved.create({
      userId,
      articleId,
      article: req.body.article, // entire article object
    });

    res.json({ success: true, saved });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: "Failed to save" });
  }
};

export const getSavedArticles = async (req, res) => {
  try {
    const saved = await Saved.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(saved.map(s => s.article));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch saved articles" });
  }
};
export const deleteSavedArticle = async (req, res) => {
  try {
    const removed = await Saved.findOneAndDelete({
      userId: req.user.id,
      articleId: req.params.id,
    });

    res.json({ success: true, removed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove saved article" });
  }
};
