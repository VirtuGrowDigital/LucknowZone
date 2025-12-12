import React, { useEffect, useState } from "react";
import API from "../utils/api";

import NewsList from "../Components/NewsList";
import LiveAQICard from "../Components/LiveAQICard";
import WeatherForecastCard from "../Components/WeatherForecastCard";
import TrendingNews from "../Components/TrendingNews";

export default function TopStories() {
  const [topStories, setTopStories] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/news")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : res.data.data;
        const filtered = all.filter((n) => n && n.image);
        const sorted = filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        if (sorted.length <= 3) {
          setTopStories(sorted);
          setLatestNews(sorted);
        } else {
          setTopStories(sorted.slice(0, 3));
          setLatestNews(sorted.slice(3));
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full px-1 lg:px-4 xl:px-10 py-4">

      {/* ⭐ MASTER GRID — MATCHES YOUR SCREENSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* 🎯 LEFT: Top Stories + Latest (all cards fill the 3 columns) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">

          <h2 className="text-2xl font-semibold mb-4">Top Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <NewsList news={topStories} loading={loading} />
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <NewsList news={latestNews} loading={loading} />
          </div>

        </div>

        {/* ⭐ RIGHT SIDEBAR → 4th column */}
        <div className="flex flex-col gap-6">
          <LiveAQICard />
          <WeatherForecastCard />
          <TrendingNews />
        </div>

      </div>
    </div>
  );
}
