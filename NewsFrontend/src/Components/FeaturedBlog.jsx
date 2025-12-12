import React from "react";
import { Link } from "react-router-dom";

export default function FeaturedBlog({ blog }) {
  if (!blog) return null;

  return (
    <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-2xl mb-10">

      {/* Background Image */}
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-full object-cover brightness-[0.65]"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
        <span className="bg-white/20 backdrop-blur-xl px-4 py-1 rounded-full text-xs font-semibold mb-4 w-fit border border-white/30">
          FEATURED
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-xl mb-4">
          {blog.title}
        </h1>

        <p className="max-w-2xl text-lg opacity-90 mb-6 line-clamp-2">
          {blog.content.replace(/<[^>]+>/g, "").slice(0, 200)}...
        </p>

        <Link
          to={`/blog/${blog.slug}`}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold w-fit transition"
        >
          Read Full Article →
        </Link>
      </div>
    </div>
  );
}
