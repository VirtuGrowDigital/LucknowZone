import { useEffect, useState } from "react";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import { FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Track confirmation popup
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/news/paginated?page=${page}&limit=10`);
      setNews(res.data.data);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Failed:", err);
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ INSTANT Toggle (no refetch)
  const handleToggle = async (item) => {
    try {
      await API.put(`/news/toggle/${item._id}`);

      setNews((prev) =>
        prev.map((n) =>
          n._id === item._id ? { ...n, hidden: !n.hidden } : n
        )
      );

      toast.success(item.hidden ? "Now visible" : "Hidden");
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  // ⭐ INSTANT Delete
  const handleDelete = async (item) => {
    setConfirmDeleteId(null);

    try {
      await API.delete(`/news/${item._id}`);

      setNews((prev) => prev.filter((n) => n._id !== item._id));
      setTotal((t) => t - 1);

      toast.success("News deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page]);

  // Search + Filters
  const filteredNews = news.filter((item) => {
    const q = search.toLowerCase();

    return (
      (item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)) &&
      (filterType === "all" ||
        (filterType === "news" && item.type === "news") ||
        (filterType === "blog" && item.type === "blog") ||
        (filterType === "admin" && !item.isAPI) ||
        (filterType === "api" && item.isAPI))
    );
  });

  return (
    <div className="flex min-h-screen bg-[#f1f1f1]">
      <Sidebar />

      <div className="flex-1 p-8 md:p-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            News & Blogs Overview
          </h1>
          <p className="text-sm text-gray-600">
            Total items: <span className="font-semibold">{total}</span>
          </p>
        </div>

        {/* SEARCH + FILTER */}
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

        {/* PAGINATION */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{pages}</span>
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 py-1 rounded-lg border ${
                page <= 1
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            <button
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
              className={`px-3 py-1 rounded-lg border ${
                page >= pages
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : filteredNews.length === 0 ? (
            <p className="text-gray-500">No matching results.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b text-gray-700 font-semibold">
                    <th className="py-3">IMAGE</th>
                    <th className="py-3">TITLE</th>
                    <th className="py-3">TYPE</th>
                    <th className="py-3">CATEGORY</th>
                    <th className="py-3">SOURCE</th>
                    <th className="py-3">STATUS</th>
                    <th className="py-3">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNews.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <img
                          src={item.image}
                          className="w-20 h-16 object-cover rounded"
                          alt=""
                        />
                      </td>

                      <td className="py-3 max-w-xs line-clamp-2">
                        {item.title}
                      </td>

                      <td className="py-3 capitalize">{item.type}</td>

                      <td className="py-3">{item.category}</td>

                      <td className="py-3">
                        {item.isAPI ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            API
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Admin
                          </span>
                        )}
                      </td>

                      <td className="py-3">
                        {item.hidden ? (
                          <span className="text-red-600">Hidden</span>
                        ) : (
                          <span className="text-green-600">Visible</span>
                        )}
                      </td>

                      {/* ⭐ UPDATED ACTIONS (API + ADMIN BOTH ENABLED) */}
                      <td className="py-3">
                        <div className="flex gap-4 items-center relative">
                          {/* 👁 Toggle */}
                          <button
                            onClick={() => handleToggle(item)}
                            className="p-1 rounded-full hover:bg-gray-200"
                          >
                            {item.hidden ? (
                              <FaEye className="text-blue-600" />
                            ) : (
                              <FaEyeSlash className="text-blue-600" />
                            )}
                          </button>

                          {/* Delete + confirmation popup */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setConfirmDeleteId(
                                  confirmDeleteId === item._id ? null : item._id
                                )
                              }
                              className="p-1 rounded-full hover:bg-gray-200"
                            >
                              <FaTrash className="text-red-600" />
                            </button>

                            {confirmDeleteId === item._id && (
                              <div
                                className="
                                  absolute top-8 right-0 
                                  bg-white shadow-xl border 
                                  border-gray-200 rounded-lg 
                                  p-3 w-44 z-[9999]
                                "
                                style={{ transform: "translateX(10px)" }}
                              >
                                <p className="text-sm mb-2">
                                  Delete this item?
                                </p>

                                <div className="flex justify-between">
                                  <button
                                    onClick={() => handleDelete(item)}
                                    className="text-red-600 font-semibold"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="text-gray-600"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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
