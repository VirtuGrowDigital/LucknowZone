import React from "react";
import { FaRegBookmark, FaShareAlt } from "react-icons/fa";

export default function NewsCard({ item = {} }) {
  if (!item || typeof item !== "object") return null;

  const {
    image = "",
    title = "No title",
    description = "",
    category = "News",
    createdAt = new Date(),
    isAPI = false,
    region = null,
  } = item;

  // -------- TIME AGO CALCULATION --------
  const timeAgo = (() => {
    const diff = (Date.now() - new Date(createdAt)) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return new Date(createdAt).toLocaleDateString();
  })();

  // -------- DYNAMIC CATEGORY PILL LOGIC --------
  let pillLabel = category;
  let pillColor = "bg-red-500"; // default

  if (isAPI) {
    if (region === "local") pillLabel = "Local";
    else if (region === "national") pillLabel = "National";
    else if (region === "international") pillLabel = "World";
    else pillLabel = "New";

    pillColor = "bg-blue-600";
  } else {
    if (category === "Blog") {
      pillLabel = "Blog";
      pillColor = "bg-purple-600";
    } else {
      pillLabel = "Admin";
      pillColor = "bg-green-600";
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 relative">

      {/* ---------- PILL NOW OUTSIDE THE CLIPPED AREA ---------- */}
      <span
        className={`absolute top-3 -left-3 z-20 text-white text-xs px-3 py-1 rounded-full shadow ${pillColor}`}
      >
        {pillLabel}
      </span>

      {/* ---------- IMAGE (CLIPPED) ---------- */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gray-200 animate-pulse" />
        )}

        {/* Image Overlay Text */}
        <h2 className="absolute bottom-3 left-3 text-white text-xl font-semibold drop-shadow-md">
          {category}
        </h2>
      </div>

      {/* ---------- CARD BODY ---------- */}
      <div className="p-5">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>

        <p className="text-xs text-gray-400 mt-4">{timeAgo}</p>

        <div className="flex justify-end items-center gap-4 mt-3 text-gray-500">
          <FaRegBookmark className="cursor-pointer hover:text-black" />
          <FaShareAlt className="cursor-pointer hover:text-black" />
        </div>
      </div>
    </div>
  );
}
