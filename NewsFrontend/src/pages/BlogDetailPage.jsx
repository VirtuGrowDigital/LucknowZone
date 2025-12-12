import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    API.get(`/blogs`)
      .then((res) => {
        const all = res.data.blogs || [];
        const found = all.find((b) => b.slug === slug);
        setBlog(found || null);
      })
      .catch((err) => console.log("Fetch blog error:", err));
  }, [slug]);

  // Scroll progress bar logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!blog)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading article...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 pb-20">
      {/* SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-[4px] bg-gray-200 z-[9999]">
        <div
          className="h-full bg-red-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* FLOATING GLASSMORPHISM SHARE BUTTONS */}
      <div
        className="
        hidden lg:flex flex-col gap-4 
        fixed top-1/3 right-6 z-[99999]
      "
      >
        {/* SHARE BUTTON TEMPLATE */}
        {[
          {
            href: `https://wa.me/?text=${encodeURIComponent(
              window.location.href
            )}`,
            icon: "fab fa-whatsapp",
            color: "text-green-500",
          },
          {
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              window.location.href
            )}&text=${encodeURIComponent(blog.title)}`,
            icon: "fab fa-x-twitter",
            color: "text-black",
          },
          {
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              window.location.href
            )}`,
            icon: "fab fa-linkedin-in",
            color: "text-blue-600",
          },
          {
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              window.location.href
            )}`,
            icon: "fab fa-facebook-f",
            color: "text-blue-700",
          },
        ].map((btn, index) => (
          <a
            key={index}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className="
              p-4 rounded-full shadow-xl
              backdrop-blur-xl bg-white/20 
              border border-white/40 
              hover:scale-110 transition-transform
            "
          >
            <i className={`${btn.icon} text-2xl ${btn.color}`}></i>
          </a>
        ))}

        {/* COPY LINK BUTTON */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
          }}
          className="
            p-4 rounded-full shadow-xl 
            backdrop-blur-xl bg-white/20 
            border border-white/40
            hover:scale-110 transition-transform
          "
        >
          <i className="fas fa-link text-xl text-gray-700"></i>
        </button>
      </div>

      {/* Back Button */}
      <Link
        to="/blog"
        className="text-gray-600 hover:text-red-600 transition mt-16 mb-8 inline-flex items-center gap-2 font-medium"
      >
        <span className="text-xl">←</span> Back to Blogs
      </Link>

      {/* PARALLAX HERO SECTION */}
      {/* HERO SECTION - SMOOTH ZOOM PARALLAX */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl mb-12 border border-gray-200">
        <div className="relative w-full h-[260px] md:h-[380px] lg:h-[460px] overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            loading="lazy"
            className="
        w-full h-full object-cover 
        scale-110 
        transition-transform duration-[2000ms] 
        ease-out
      "
            style={{
              transform: `scale(${1 + scrollProgress / 400})`, // smooth zoom
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>

          {/* HERO TEXT */}
          <div className="absolute bottom-10 left-8 md:left-12 text-white max-w-2xl drop-shadow-xl">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              {blog.title}
            </h1>

            <div className="mt-4 flex items-center gap-4 text-gray-200 text-sm">
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="capitalize bg-white/20 px-3 py-1 rounded-full border border-white/30">
                {blog.tags}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <article
        className="
          prose 
          prose-lg 
          max-w-none 
          text-gray-800 
          leading-relaxed 
          tracking-wide 
          prose-headings:font-extrabold 
          prose-headings:text-gray-900
          prose-img:rounded-xl
          prose-a:text-red-600
          prose-a:no-underline
          hover:prose-a:underline
        "
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* TAGS */}
      {blog.tags && (
        <div className="flex flex-wrap gap-3 mt-14">
          {blog.tags.split(",").map((tag, i) => (
            <span
              key={i}
              className="text-sm bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-full text-red-600 cursor-default transition border border-red-200"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="h-[2px] bg-gray-200 mt-14"></div>
    </div>
  );
}
