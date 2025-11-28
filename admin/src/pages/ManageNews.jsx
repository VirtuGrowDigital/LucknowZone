import { useEffect, useState } from "react";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";

export default function ManageNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    API.get("/news").then((res) => setNews(res.data));
  }, []);

  const deleteItem = async (id) => {
    await API.delete(`/news/${id}`);
    setNews(news.filter((n) => n._id !== id));
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-10 flex-1">
        <h1 className="text-2xl font-bold mb-6">Manage News</h1>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">API/Data</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {news.map((item) => (
              <tr key={item._id || item.title} className="border">
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.isAPI ? "API" : "Manual"}</td>
                <td className="p-2">
                  {!item.isAPI && (
                    <button
                      className="bg-red-600 text-white py-1 px-2 rounded"
                      onClick={() => deleteItem(item._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
