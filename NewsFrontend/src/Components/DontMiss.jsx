import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function DontMiss() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading || !items.length) return null;

  useEffect(() => {
    API.get("/news/dont-miss")
      .then((res) => {
        console.log("DONT MISS API:", res.data);
        setItems(res.data?.data || []);
      })
      .catch((err) => {
        console.error("DontMiss error:", err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#111] rounded-xl p-3 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Don&apos;t Miss</h3>
      </div>

      {/* NEWS ITEMS */}
      {items.map((item, index) => (
        <div
          key={item._id}
          onClick={() => navigate(`/news/${item._id}`)}
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
            {item.isAPI ? "Source" : "Admin"}
          </p>
        </div>
      ))}
    </div>
  );
}
