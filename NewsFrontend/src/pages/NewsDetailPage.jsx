import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { FaBookmark, FaRegBookmark, FaShareAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export default function NewsDetailPage() {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    API.get(`/news/${id}`)
      .then((res) => {
        setNews(res.data);
        setSaved(res.data?.isSaved || false);
      })
      .catch(() => setNews(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!news) return <p className="p-6">News not found</p>;

  /* ---------- SAVE ---------- */
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

  /* ---------- SHARE ---------- */
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

  return (
    <>
      {/* ================= HERO IMAGE ================= */}
      <div className="w-full">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-[260px] sm:h-[360px] object-cover"
        />
      </div>

      {/* ================= CONTENT ================= */}
      <article className="max-w-3xl mx-auto px-4 pt-5 pb-24">
        {/* CATEGORY */}
        <span className="inline-block text-xs font-semibold text-red-600 mb-2 uppercase">
          {news.category}
        </span>

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-gray-900">
          {news.title}
        </h1>

        {/* META */}
        <p className="text-xs text-gray-500 mt-2 mb-4">
          {new Date(news.createdAt).toLocaleString()}
        </p>

        {/* DESCRIPTION / BODY */}
        <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
          {news.description}
        </p>
      </article>

      {/* ================= STICKY ACTION BAR ================= */}
      <div className="
        fixed bottom-0 left-0 right-0
        bg-white border-t shadow-lg
        flex items-center justify-between
        px-6 py-3 z-50
      ">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 text-sm font-semibold"
        >
          {saved ? (
            <>
              <FaBookmark className="text-red-600" />
              Saved
            </>
          ) : (
            <>
              <FaRegBookmark />
              Save
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <FaShareAlt />
          Share
        </button>
      </div>
    </>
  );
}
