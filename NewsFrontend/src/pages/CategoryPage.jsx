import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import PageLayout from "../Components/PageLayout";

export default function CategoryPage() {
  const { category } = useParams();
  const [news, setNews] = useState([]);

  useEffect(() => {
    if (!category) return;

    // 🌍 REGION HANDLING
    let region = null;
    if (category === "local") region = "local";
    else if (category === "national") region = "national";
    else if (category === "international") region = "international";

    // 🧹 CLEAN CATEGORY
    const cleanCategory = category.replace("-news", "");

    const formatted = cleanCategory
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const url = region
      ? `/news/by-region?region=${region}`
      : `/news?category=${encodeURIComponent(formatted)}`;

    console.log("Fetching:", url);

    API.get(url)
      .then((res) => {
        setNews(res.data?.data || []);
      })
      .catch((err) => console.error("Category load error:", err));
  }, [category]);

  const title = category
    ? category
        .replace("-news", "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : "News";

  return (
    <div className="max-w-7xl mx-auto px-4 pb-10">
      <PageLayout title={title} news={news} />
    </div>
  );
}
