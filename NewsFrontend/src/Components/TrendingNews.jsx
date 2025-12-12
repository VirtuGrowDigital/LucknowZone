import React, { useEffect, useState } from "react";
import API from "../utils/api";

export default function TrendingNews() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    API.get("/news")
      .then((res) => {
        const all = res.data.data || res.data;

        // take first 3
        setTrending(all.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white shadow-md rounded-2xl p-5">
      <h3 className="text-lg font-semibold mb-4">Trending News</h3>

      {trending.map((n, i) => (
        <div key={i} className="flex gap-3 mb-4">
          <img
            src={n.image}
            className="w-20 h-16 object-cover rounded"
            alt={n.title}
          />
          <div>
            <p className="text-sm font-medium">{n.title}</p>
            <p className="text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
