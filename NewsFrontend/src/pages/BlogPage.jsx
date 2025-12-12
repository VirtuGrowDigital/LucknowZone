import React, { useEffect, useState } from "react";
import API from "../utils/api";
import BlogCard from "../Components/BlogCard";
import FeaturedBlog from "../Components/FeaturedBlog";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    API.get("/blogs")
      .then((res) => {
        const arr = res.data.blogs || [];
        setBlogs(arr);
        setFiltered(arr);
      })
      .catch((err) => console.log("Blog fetch error:", err));
  }, []);

  const handleSearch = (value) => {
    setSearch(value);

    const f = blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(value.toLowerCase()) ||
        b.tags.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(f);
    setSearchResults(value.length > 0 ? f : []);
  };

  const featured = blogs[0];
  const rest = filtered.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-14">
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 my-8 relative">
        {/* SEARCH BAR */}
        <div className="w-full md:w-1/3 relative">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-full border bg-gray-50 shadow-sm backdrop-blur-md focus:ring-2 focus:ring-red-400 outline-none"
          />

          {/* ✨ GLASS EFFECT SEARCH LIST */}
          {searchResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-white/40 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 max-h-64 overflow-y-auto p-3 z-20">
              {searchResults.map((b) => (
                <div
                  key={b._id}
                  className="p-3 rounded-lg cursor-pointer hover:bg-white/40 transition"
                >
                  <p className="font-semibold">{b.title}</p>
                  <span className="text-sm opacity-60">{b.tags}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CATEGORY FILTER (Fixed Alignment) */}
        <select
          className="px-1 py-3 rounded-full border bg-gray-50 shadow-sm cursor-pointer md:w-auto w-full "
          onChange={(e) => {
            const c = e.target.value;
            if (c === "all") return setFiltered(blogs);
            setFiltered(blogs.filter((b) => b.tags.includes(c)));
          }}
        >
          <option value="all">Categories</option>
          <option value="tech">Tech</option>
          <option value="health">Health</option>
          <option value="business">Business</option>
          <option value="news">News</option>
          <option value="travel">Travel</option>
          <option value="lifestyle">Lifestyle</option>
        </select>
      </div>
      {/* Featured Blog */}
      {featured && <FeaturedBlog blog={featured} />}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {rest.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
