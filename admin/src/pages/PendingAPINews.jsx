import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { FaCheck, FaTimes } from "react-icons/fa";
import Fallback from "../assets/Images/Fallback.png"

export default function PendingAPINews() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRegions, setShowRegions] = useState(false);
  const [activeRegion, setActiveRegion] = useState("all");

  // -------------------------
  // LOAD PENDING NEWS
  // -------------------------
  const loadPending = async (region = activeRegion) => {
    setLoading(true);
    try {
      const res = await API.get(`/news/pending?region=${region}`);
      setPending(res.data.pending || []);
    } catch (err) {
      console.log("Fetch pending error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending("all");
  }, []);

  // -------------------------
  // IMPORT REGION
  // -------------------------
  const importRegion = async (region) => {
    try {
      await API.get(`/news/import?region=${region}`);
      setActiveRegion(region);
      loadPending(region);
    } catch (err) {
      console.log("Import region error:", err);
    }
  };

  // -------------------------
  // APPROVE
  // -------------------------
  const approve = async (id) => {
    try {
      await API.patch(`/news/${id}/approve`);
      loadPending();
    } catch (err) {
      console.log("Approve error:", err);
    }
  };

  // -------------------------
  // REJECT
  // -------------------------
  const reject = async (id) => {
    try {
      await API.patch(`/news/${id}/reject`);
      loadPending();
    } catch (err) {
      console.log("Reject error:", err);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 relative">
        <h2 className="text-2xl font-semibold">Pending API News</h2>

        <div className="relative">
          <button
            onClick={() => setShowRegions(!showRegions)}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white 
            bg-red-500/80 backdrop-blur-md border border-red-400/40 shadow-lg 
            hover:bg-red-600/80 transition-all"
          >
            Region ▾
          </button>

          {showRegions && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-xl bg-white/80 
              backdrop-blur-md shadow-xl border z-50"
            >
              <button
                onClick={() => importRegion("lucknow")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                🏙 Lucknow
              </button>

              <button
                onClick={() => importRegion("national")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                🇮🇳 National
              </button>

              <button
                onClick={() => importRegion("international")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                🌍 International
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : pending.length === 0 ? (
        <p className="text-gray-500">No pending API news.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pending.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow border p-4 flex gap-4"
            >
              {/* FIXED IMAGE WITH FALLBACK */}
              <img
                src={`http://localhost:5000/proxy-image?url=${encodeURIComponent(item.image)}`}
                alt={item.title}
                className="w-32 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Fallback;
                }}
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {item.description}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => approve(item._id)}
                    className="bg-green-500 hover:bg-green-600 text-white
                    px-4 py-2 rounded-lg text-xs flex items-center gap-2"
                  >
                    <FaCheck /> Approve
                  </button>

                  <button
                    onClick={() => reject(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white
                    px-4 py-2 rounded-lg text-xs flex items-center gap-2"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
