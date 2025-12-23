import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import PageLayout from "../Components/PageLayout";
import DontMiss from "../Components/DontMiss"

export default function CategoryPage() {
  const { category } = useParams();
  const [news, setNews] = useState([]);

  useEffect(() => {
    if (!category) return; // prevent crash

    const formatted = category
      ? category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "";

    let region = null;

    if (category === "local-news") region = "local";
    if (category === "national-news") region = "national";
    if (category === "international-news") region = "international";

    const url = region
      ? `/news/by-region?region=${region}`
      : `/news?category=${encodeURIComponent(formatted)}`;

    API.get(url)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setNews(data || []);
      })
      .catch((err) => console.log("Category load error:", err));
  }, [category]);

  const title = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "News";

  return (
    <div className="max-w-7xl mx-auto px-4 pb-10">
      <PageLayout title={title} news={news} />
    </div>
    
    
  );
}
