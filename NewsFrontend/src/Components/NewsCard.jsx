import React, { useState } from "react";
import { FaRegBookmark, FaBookmark, FaShareAlt } from "react-icons/fa";
import API from "../utils/api";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

export default function NewsCard({ item = {} }) {
  if (!item || typeof item !== "object") return null;

  const navigate = useNavigate();

  const {
    _id,
    image = "",
    title = "No title",
    description = "",
    category = "News",
    createdAt = new Date(),
    isAPI = false,
    region = null,
    slug,
    isSaved = false,
    type = "news",
  } = item;

  const saveId =
    _id ||
    slug ||
    title.replace(/\s+/g, "-").toLowerCase() +
      "-" +
      Math.floor(Math.random() * 9999);

  const [saved, setSaved] = useState(isSaved);
  const [animating, setAnimating] = useState(false);

  /* ---------------- TIME AGO ---------------- */
  const timeAgo = (() => {
    const diff = (Date.now() - new Date(createdAt)) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return new Date(createdAt).toLocaleDateString();
  })();

  /* ---------------- CATEGORY PILL ---------------- */
  let pillLabel = category;
  let pillColor = "bg-red-500";

  if (isAPI) {
    pillLabel =
      region === "local"
        ? "Local"
        : region === "national"
        ? "National"
        : region === "international"
        ? "World"
        : "News";
    pillColor = "bg-blue-600";
  } else {
    pillLabel = category === "Blog" ? "Blog" : "Admin";
    pillColor = category === "Blog" ? "bg-purple-600" : "bg-green-600";
  }

  /* ---------------- OPEN CARD ---------------- */
  const handleOpen = () => {
    if (type === "blog" || category === "Blog") {
      navigate(`/blog/${slug || _id}`);
    } else {
      navigate(`/news/${_id}`);
    }
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to save articles");
      window.dispatchEvent(new Event("open-login"));
      return;
    }

    try {
      setAnimating(true);

      if (!saved) {
        await API.post(`/saved/${saveId}`, { article: item });

        confetti({
          particleCount: 40,
          spread: 40,
          origin: { y: 0.85 },
        });

        toast.success("Saved to your profile");
        setSaved(true);
      } else {
        await API.delete(`/saved/${saveId}`);
        toast("Removed from saved", { icon: "❌" });
        setSaved(false);
      }
    } catch {
      toast.error("Could not save article");
    } finally {
      setTimeout(() => setAnimating(false), 300);
    }
  };

  /* ---------------- SHARE ---------------- */
  const handleShare = async () => {
    const url =
      type === "blog" || category === "Blog"
        ? `${window.location.origin}/blog/${slug || _id}`
        : `${window.location.origin}/news/${_id}`;

    if (navigator.share) {
      navigator.share({ title, text: description, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border relative overflow-hidden">
      {saved && (
        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow">
          Saved
        </span>
      )}

      <span
        className={`absolute top-3 -left-3 z-20 text-white text-xs px-3 py-1 rounded-full shadow ${pillColor}`}
      >
        {pillLabel}
      </span>

      <div
        onClick={handleOpen}
        className="relative h-48 w-full overflow-hidden rounded-t-2xl cursor-pointer"
      >
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gray-200 animate-pulse" />
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {description}
        </p>
        <p className="text-xs text-gray-400 mt-4">{timeAgo}</p>

        <div className="flex justify-end gap-4 mt-3 text-gray-500">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className={`transition ${animating ? "scale-125" : ""}`}
          >
            {saved ? <FaBookmark className="text-red-600" /> : <FaRegBookmark />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
          >
            <FaShareAlt />
          </button>
        </div>
      </div>
    </div>
  );
}
