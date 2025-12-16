import React, { useState } from "react";
import { FaRegBookmark, FaBookmark, FaShareAlt } from "react-icons/fa";
import API from "../utils/api";
import toast from "react-hot-toast";
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
  } = item;

  const [saved, setSaved] = useState(isSaved);
  const [animating, setAnimating] = useState(false);

  // -------- TIME AGO --------
  const timeAgo = (() => {
    const diff = (Date.now() - new Date(createdAt)) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return new Date(createdAt).toLocaleDateString();
  })();

  // -------- CATEGORY PILL --------
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
        : "New";
    pillColor = "bg-blue-600";
  } else {
    pillLabel = category === "Blog" ? "Blog" : "Admin";
    pillColor = category === "Blog" ? "bg-purple-600" : "bg-green-600";
  }

  // -------- SAVE / UNSAVE --------
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to save articles");
      window.dispatchEvent(new Event("open-login"));
      return;
    }

    try {
      setAnimating(true);
      await API.post(`/saved/${_id}`);

      setSaved((prev) => {
        toast.success(
          prev ? "Removed from saved" : "Saved to your profile"
        );
        return !prev;
      });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setTimeout(() => setAnimating(false), 300);
    }
  };

  // -------- SHARE --------
  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${slug || _id}`;

    if (navigator.share) {
      navigator.share({ title, text: description, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 relative">

      {/* CATEGORY PILL */}
      <span
        className={`absolute top-3 -left-3 z-20 text-white text-xs px-3 py-1 rounded-full shadow ${pillColor}`}
      >
        {pillLabel}
      </span>

      {/* IMAGE */}
      <div
        onClick={() => navigate(`/blog/${slug || _id}`)}
        className="relative h-48 w-full overflow-hidden rounded-t-2xl cursor-pointer"
      >
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gray-200 animate-pulse" />
        )}

        <h2 className="absolute bottom-3 left-3 text-white text-xl font-semibold drop-shadow-md">
          {category}
        </h2>
      </div>

      {/* BODY */}
      <div className="p-5">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {description}
        </p>

        <p className="text-xs text-gray-400 mt-4">{timeAgo}</p>

        {/* ACTIONS */}
        <div className="flex justify-end items-center gap-4 mt-3 text-gray-500">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className={`transition-transform ${
              animating ? "scale-125" : "scale-100"
            }`}
            title="Save"
          >
            {saved ? (
              <FaBookmark className="text-red-500 animate-pulse" />
            ) : (
              <FaRegBookmark className="hover:text-black" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            title="Share"
          >
            <FaShareAlt className="hover:text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
