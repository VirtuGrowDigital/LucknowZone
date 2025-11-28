import { useEffect, useState } from "react";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import { FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, news, blog, api, admin

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await API.get("/news");
      setNews(res.data);
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (item) => {
    if (item.isAPI) return;
    try {
      await API.put(`/news/toggle/${item._id}`);
      fetchNews();
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  };

  const handleDelete = async (item) => {
    if (item.isAPI) return;
    if (!confirm("Are you sure you want to delete this news item?")) return;

    try {
      await API.delete(`/news/${item._id}`);
      fetchNews();
    } catch (err) {
      console.error("Failed to delete news:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // 🔎 Search + Filter Logic
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "news" && item.type === "news") ||
      (filterType === "blog" && item.type === "blog") ||
      (filterType === "admin" && !item.isAPI) ||
      (filterType === "api" && item.isAPI);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-[#f1f1f1]">
      <Sidebar />

      <div className="flex-1 p-8 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">News & Blogs Overview</h1>
        </div>

        {/* 🔎 Search + Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search news or blogs..."
            className="border p-3 rounded-lg w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-3 rounded-lg w-full md:w-1/4"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="news">News Only</option>
            <option value="blog">Blogs Only</option>
            <option value="admin">Admin Only</option>
            <option value="api">API Only</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          {loading ? (
            <p className="text-gray-500">Loading news...</p>
          ) : filteredNews.length === 0 ? (
            <p className="text-gray-500">No matching results.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b text-gray-700 font-semibold">
                    <th className="py-3 text-left">TITLE</th>
                    <th className="py-3 text-left">TYPE</th>
                    <th className="py-3 text-left">CATEGORY</th>
                    <th className="py-3 text-left">SOURCE</th>
                    <th className="py-3 text-left">STATUS</th>
                    <th className="py-3 text-left">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNews.map((item, index) => (
                    <tr
                      key={item._id || item.title + index}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="py-3 pr-3 max-w-xs">
                        <div className="line-clamp-2">{item.title}</div>
                      </td>

                      <td className="py-3 capitalize">
                        {item.type || "news"}
                      </td>

                      <td className="py-3">{item.category || "-"}</td>

                      <td className="py-3">
                        {item.isAPI ? (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            API
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Admin
                          </span>
                        )}
                      </td>

                      <td className="py-3">
                        {item.isAPI ? (
                          <span className="text-blue-600 font-medium">From API</span>
                        ) : item.hidden ? (
                          <span className="text-red-600 font-medium">Hidden</span>
                        ) : (
                          <span className="text-green-600 font-medium">Visible</span>
                        )}
                      </td>

                      <td className="py-3">
                        <div className="flex gap-4 items-center">
                          {!item.isAPI && (
                            <button
                              onClick={() => handleToggle(item)}
                              className="p-1 rounded-full hover:bg-gray-200 transition"
                            >
                              {item.hidden ? (
                                <FaEye className="text-blue-600" />
                              ) : (
                                <FaEyeSlash className="text-blue-600" />
                              )}
                            </button>
                          )}

                          {!item.isAPI && (
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1 rounded-full hover:bg-gray-200 transition"
                            >
                              <FaTrash className="text-red-600" />
                            </button>
                          )}

                          {item.isAPI && (
                            <span className="text-gray-400 text-xs">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
