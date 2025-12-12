import { useEffect, useState } from "react";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";

export default function ManageNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/news")
      .then((res) => setNews(res.data.data || []))
      .catch((err) => console.log("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const deleteItem = async (id) => {
    await API.delete(`/news/${id}`);
    setNews((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-10 flex-1">
        <h1 className="text-2xl font-bold mb-6">Manage Approved News</h1>

        {/* ---------- LOADING SKELETON ---------- */}
        {loading ? (
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-full bg-gray-200 animate-pulse rounded"
                />
              ))}
          </div>
        ) : (
          <table className="w-full border rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Source</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {news.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{item.title}</td>
                  <td className="p-3">{item.category}</td>

                  {/* API / Manual Badge */}
                  <td className="p-3">
                    {item.isAPI ? (
                      <span className="px-2 py-1 text-xs bg-yellow-300 rounded">
                        API
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-200 rounded">
                        Manual
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {!item.isAPI && (
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                        onClick={() => deleteItem(item._id)}
                      >
                        Delete
                      </button>
                    )}

                    {item.isAPI && (
                      <span className="text-gray-400 text-xs">
                        Cannot delete API news
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
