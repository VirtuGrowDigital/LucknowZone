import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <div
      className="
        group 
        rounded-3xl 
        overflow-hidden 
        bg-white/40 
        backdrop-blur-xl 
        border border-white/30
        shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        transition-all duration-500
      "
    >

      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="h-full w-full object-cover rounded-t-3xl transition-transform duration-700 group-hover:scale-[1.08]"
        />

        {/* GLASS BADGE */}
        <span
          className="
            absolute top-5 left-5 
            bg-white/30 
            backdrop-blur-md 
            px-4 py-1 
            text-xs 
            font-semibold 
            rounded-full 
            border border-white/20
          "
        >
          Blog
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
          {blog.title}
        </h2>

        <p className="text-gray-700 mt-3 line-clamp-3">
          {blog.content.replace(/<[^>]+>/g, "").slice(0, 180)}...
        </p>

        {/* TAGS */}
        {blog.tags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.split(",").map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-gray-700 border border-white/30"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* DATE + READ MORE */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-xs text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>

          <Link
            to={`/blog/${blog.slug}`}
            className="text-red-600 hover:text-red-700 font-semibold transition"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
}
