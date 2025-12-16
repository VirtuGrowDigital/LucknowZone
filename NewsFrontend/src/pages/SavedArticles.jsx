import { useEffect, useState } from "react";
import API from "../utils/api";
import NewsCard from "../Components/NewsCard";

export default function SavedArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/saved")
      .then((res) => setArticles(res.data))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading saved articles...</p>;

  if (!articles.length)
    return <p className="p-6">No saved articles yet.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 grid gap-6">
      {articles.map((news) => (
        <NewsCard key={news._id} item={news} />
      ))}
    </div>
  );
}
