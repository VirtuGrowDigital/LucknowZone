import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import {
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaMoon,
  FaSun,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import toast from "react-hot-toast";

import WeatherForecastCard from "../Components/WeatherForecastCard";
import DontMiss from "../Components/DontMiss";

export default function NewsDetailPage() {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // UI STATES
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

  /* ================= FETCH NEWS ================= */
  useEffect(() => {
    API.get(`/news/${id}`)
      .then((res) => {
        setNews(res.data);
        setSaved(res.data?.isSaved || false);
      })
      .catch(() => setNews(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= READING PROGRESS ================= */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress((scrollTop / height) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!news) return <p className="p-6">News not found</p>;

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login required to save");
      window.dispatchEvent(new Event("open-login"));
      return;
    }

    try {
      if (!saved) {
        await API.post(`/saved/${news._id}`, { article: news });
        toast.success("Saved");
        setSaved(true);
      } else {
        await API.delete(`/saved/${news._id}`);
        toast("Removed from saved", { icon: "❌" });
        setSaved(false);
      }
    } catch {
      toast.error("Action failed");
    }
  };

  /* ================= SHARE ================= */
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.description,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  /* ================= DROP CAP ================= */
  const baseFont = fontSize;
  const dropCapSize = Math.round(baseFont * 3.2);
  const dropCapLineHeight = Math.round(baseFont * 2.8);

  return (
    <div className={darkMode ? "bg-[#0f172a] text-gray-100" : "bg-white"}>
      {/* ================= PROGRESS BAR ================= */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[999]">
        <div
          className="h-full bg-red-600 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ================= HERO IMAGE ================= */}
      <div className="w-full">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-[260px] sm:h-[420px] object-cover"
        />
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="max-w-7xl mx-auto px-4 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFontSize((s) => Math.max(15, s - 1))}
            className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <FaMinus />
          </button>

          <span className="text-sm font-semibold">{fontSize}px</span>

          <button
            onClick={() => setFontSize((s) => Math.min(22, s + 1))}
            className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <FaPlus />
          </button>
        </div>

        <button
          onClick={() => setDarkMode((d) => !d)}
          className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          
          {/* ================= ARTICLE ================= */}
          <article>
            <span className="inline-block text-xs font-semibold text-red-600 uppercase mb-3">
              {news.category}
            </span>

            <h1 className="text-2xl sm:text-4xl font-bold leading-tight mb-4">
              {news.title}
            </h1>

            <p className="text-xs text-gray-500 mb-6">
              {new Date(news.createdAt).toLocaleString()}
            </p>

            <div
              style={{ fontSize: `${baseFont}px`, lineHeight: "1.85" }}
              className="transition-all duration-200"
            >
              <div className="flex gap-3 items-start">
                <span
                  className="font-extrabold text-red-600 shrink-0"
                  style={{
                    fontSize: `${dropCapSize}px`,
                    lineHeight: `${dropCapLineHeight}px`,
                    marginTop: "4px",
                  }}
                >
                  {news.description.charAt(0)}
                </span>

                <p className="tracking-[0.01em]">
                  {news.description.slice(1)}
                </p>
              </div>
            </div>
          </article>

          {/* ================= DESKTOP SIDEBAR ================= */}
          <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-fit">
            <WeatherForecastCard />
            <DontMiss />
          </aside>
        </div>
      </div>

      {/* ================= STICKY ACTION BAR ================= */}
      <div
        className={`fixed bottom-0 left-0 right-0 border-t shadow-lg flex items-center justify-between px-6 py-3 z-50 ${
          darkMode ? "bg-[#020617]" : "bg-white"
        }`}
      >
        <button onClick={handleSave} className="flex items-center gap-2 text-sm font-semibold">
          {saved ? <><FaBookmark className="text-red-600" /> Saved</> : <><FaRegBookmark /> Save</>}
        </button>

        <button onClick={handleShare} className="flex items-center gap-2 text-sm font-semibold">
          <FaShareAlt /> Share
        </button>
      </div>
    </div>
  );
}
