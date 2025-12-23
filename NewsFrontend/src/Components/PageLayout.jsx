import React from "react";
import NewsList from "./NewsList";
import LiveAQICard from "./LiveAQICard";
import WeatherForecastCard from "./WeatherForecastCard";
import TrendingNews from "./TrendingNews";
import DontMiss from "./DontMiss";

export default function PageLayout({ title, news }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">

      {/* LEFT SIDE CONTENT */}
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-semibold mb-6">{title}</h2>

        {news && news.length ? (
          <NewsList news={news} />
        ) : (
          <p className="text-gray-500">No news available.</p>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="space-y-8">
        <LiveAQICard />
        <WeatherForecastCard />
        <TrendingNews />
        <DontMiss />
      </div>
    </div>
  );
}
