import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function DontMiss() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/news")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : res.data.data;

        // ✅ FILTER: ONLY DONT MISS NEWS
        const dontMiss = all
          .filter(
            (n) =>
              n &&
              n.image &&
              n.category === "DontMiss" && // 🔥 KEY LINE
              n.isApproved !== false // safe for admin + API
          )
          .sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
          .slice(0, 3); // show only 3

        setItems(dontMiss);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !items.length) return null;

  return (
    <div className="bg-[#111] rounded-xl p-3 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Don&apos;t Miss</h3>
        <span className="text-blue-400 text-sm cursor-pointer">▶</span>
      </div>

      {/* NEWS ITEMS */}
      {items.map((item, index) => (
        <div
          key={item._id}
          onClick={() => navigate(`/blog/${item.slug || item._id}`)}
          className={`cursor-pointer ${
            index !== items.length - 1 ? "mb-4" : ""
          }`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-40 object-cover rounded-lg"
          />

          <p className="text-sm font-medium mt-2 leading-snug line-clamp-2">
            {item.title}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {item.source || "Admin"}
          </p>
        </div>
      ))}
    </div>
  );
}
