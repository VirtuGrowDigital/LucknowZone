import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import DashboardLayout from "../components/DashboardLayout";
import { FaCheck, FaTimes } from "react-icons/fa";
import Fallback from "../assets/Images/Fallback.png";
import toast from "react-hot-toast";
import { format, formatDistanceToNow } from "date-fns";

const CATEGORIES = [
  "Top Stories",
  "Business",
  "Entertainment",
  "Health",
  "Politics",
  "Sports",
  "Tech",
  "DontMiss",
];

const REGIONS = [
  { label: "All", value: "all" },
  { label: "Lucknow", value: "local" },
  { label: "National", value: "national" },
  { label: "International", value: "international" },
];

export default function PendingAPINews() {
  const navigate = useNavigate();

  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveMenu, setApproveMenu] = useState(null);
  const [recentlyApproved, setRecentlyApproved] = useState(null);

  const [sortOrder, setSortOrder] = useState("latest");
  const [region, setRegion] = useState("all");

  // =============================
  // Load pending API news
  // =============================
  const loadPending = async (selectedRegion = region) => {
    setLoading(true);
    try {
      const url =
        selectedRegion === "all"
          ? "/news/pending"
          : `/news/pending?region=${selectedRegion}`;

      const res = await API.get(url);
      setPending(res.data.pending || []);
    } catch (err) {
      console.log("Fetch pending error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending(region);
  }, [region]);

  // =============================
  // Refresh API News (NEW)
  // =============================
  const refreshApiNews = async () => {
    try {
      toast.loading("Refreshing API news…", { id: "refresh" });

      await API.post("/news/refresh-api");

      toast.success("API news refreshed", { id: "refresh" });

      loadPending(region);
    } catch (err) {
      toast.error("Failed to refresh news", { id: "refresh" });
      console.log(err);
    }
  };

  // =============================
  // Format time info
  // =============================
  const formatTimeInfo = (date) => {
    const d = new Date(date);
    return {
      relative: formatDistanceToNow(d, { addSuffix: true }),
      date: format(d, "dd MMM yyyy"),
      time: format(d, "hh:mm a"),
    };
  };

  // =============================
  // SORTED DATA
  // =============================
  const sortedPending = useMemo(() => {
    return [...pending].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "latest" ? db - da : da - db;
    });
  }, [pending, sortOrder]);

  // =============================
  // Approve with category
  // =============================
  const approveWithCategory = async (id, category) => {
    try {
      await API.patch(`/news/${id}/approve`, { category });

      toast.success(`Approved & published to ${category}`);
      setApproveMenu(null);
      setRecentlyApproved(id);

      loadPending(region);

      setTimeout(() => setRecentlyApproved(null), 8000);
    } catch (err) {
      toast.error("Approval failed");
      console.log(err);
    }
  };

  // =============================
  // Undo approval
  // =============================
  const undoApprove = async (id) => {
    try {
      await API.patch(`/news/${id}/undo`);
      toast("Approval undone", { icon: "↩️" });
      setRecentlyApproved(null);
      loadPending(region);
    } catch {
      toast.error("Undo failed");
    }
  };

  // =============================
  // Reject
  // =============================
  const reject = async (id) => {
    try {
      await API.patch(`/news/${id}/reject`);
      toast.error("News rejected");
      loadPending(region);
    } catch (err) {
      console.log("Reject error:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white px-4 py-2 rounded-xl shadow border text-sm"
          >
            ⬅ Back
          </button>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() =>
                setSortOrder(sortOrder === "latest" ? "oldest" : "latest")
              }
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Sort: {sortOrder === "latest" ? "Latest ↓" : "Oldest ↑"}
            </button>

            {/* 🔄 REFRESH BUTTON */}
            <button
              onClick={refreshApiNews}
              className="bg-blue-600 hover:bg-blue-700 text-white
              px-4 py-2 rounded-lg text-sm font-medium"
            >
              🔄 Refresh API News
            </button>
          </div>
        </div>

        {/* REGION FILTER */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {REGIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setRegion(r.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border
                ${
                  region === r.value
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* HEADER */}
        <h2 className="text-xl md:text-2xl font-semibold mb-6">
          Pending API News
        </h2>

        {/* CONTENT */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : sortedPending.length === 0 ? (
          <p className="text-gray-500">No pending API news.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedPending.map((item) => {
              const t = item.createdAt
                ? formatTimeInfo(item.createdAt)
                : null;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow border p-4 flex gap-4"
                >
                  <img
                    src={`https://lucknowzone.onrender.com/proxy-image?url=${encodeURIComponent(
                      item.image
                    )}`}
                    alt={item.title}
                    className="w-28 h-24 object-cover rounded-lg"
                    onError={(e) => (e.target.src = Fallback)}
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>

                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {item.description}
                    </p>

                    {t && (
                      <p className="text-xs text-gray-500 mt-1">
                        🕒 {t.relative} • {t.date} • {t.time}
                      </p>
                    )}

                    <div className="flex gap-2 mt-4 relative">
                      {/* APPROVE */}
                      <button
                        onClick={() =>
                          setApproveMenu(
                            approveMenu === item._id ? null : item._id
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white
                        px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                      >
                        <FaCheck /> Approve ▾
                      </button>

                      {approveMenu === item._id && (
                        <div className="absolute top-10 left-0 w-48 bg-white border rounded-lg shadow z-50">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              onClick={() =>
                                approveWithCategory(item._id, cat)
                              }
                              className="w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}

                      {recentlyApproved === item._id && (
                        <button
                          onClick={() => undoApprove(item._id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white
                          px-3 py-2 rounded-lg text-xs"
                        >
                          ↩ Undo
                        </button>
                      )}

                      {/* REJECT */}
                      <button
                        onClick={() => reject(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white
                        px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
