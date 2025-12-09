import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../utils/api";
import { toast } from "react-toastify";

export default function AddTicker() {
  const [tickerInput, setTickerInput] = useState("");
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =============================
  // LOAD CURRENT TICKERS
  // =============================
  async function loadTickers() {
    try {
      const res = await API.get("/news/breaking");
      setTickers(res.data.breaking || []);
    } catch (err) {
      console.error("Failed to load tickers:", err);
      toast.error("Failed to load tickers");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTickers();
  }, []);

  // =============================
  // ADD NEW TICKER
  // =============================
  async function handleAddTicker(e) {
    e.preventDefault();

    if (!tickerInput.trim()) return toast.warn("Enter ticker text");

    try {
      await API.post("/news/breaking", { text: tickerInput });
      setTickerInput("");
      loadTickers();
      toast.success("Ticker added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add ticker");
    }
  }

  // =============================
  // DELETE TICKER
  // =============================
  async function handleDelete(id) {
    if (!confirm("Delete this ticker?")) return;

    try {
      await API.delete(`/news/breaking/${id}`);
      loadTickers();
      toast.info("Ticker deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete ticker");
    }
  }

  // =============================
  // TOGGLE ACTIVE / INACTIVE
  // =============================
  async function handleToggle(id) {
    try {
      await API.patch(`/news/breaking/${id}/toggle`);
      loadTickers();
      toast.success("Ticker updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ticker");
    }
  }

  return (
    <DashboardLayout>
      <div className="px-4 md:px-10 mt-10 flex justify-center">
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-xl shadow-xl p-8 rounded-2xl border border-gray-200">

          <h1 className="text-3xl font-bold text-center mb-6">
            📰 Manage Breaking News Ticker
          </h1>

          {/* ADD TICKER FORM */}
          <form onSubmit={handleAddTicker} className="flex gap-3 mb-6">
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              placeholder="Enter breaking news..."
              className="flex-1 border p-3 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="bg-red-600 hover:bg-red-700 px-6 text-white rounded-xl shadow">
              Add
            </button>
          </form>

          {/* CURRENT TICKERS */}
          <h2 className="text-xl font-semibold mb-3">Current Tickering News</h2>

          {loading ? (
            <p>Loading tickers...</p>
          ) : tickers.length === 0 ? (
            <p className="text-gray-600">No active tickers right now.</p>
          ) : (
            <div className="space-y-4">
              {tickers.map((t) => (
                <div
                  key={t._id}
                  className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-gray-200"
                >
                  <div>
                    <p className="text-lg font-medium">{t.text}</p>
                    <p className="text-xs text-gray-500">
                      Status:{" "}
                      <span className={t.active ? "text-green-600" : "text-red-600"}>
                        {t.active ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleToggle(t._id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold 
                                 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {t.active ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => handleDelete(t._id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold 
                                 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
