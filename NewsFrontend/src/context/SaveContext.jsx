import { createContext, useContext, useEffect, useState } from "react";
import API from "../utils/api";

const SaveContext = createContext();
export const useSaved = () => useContext(SaveContext);

export function SaveProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved articles on login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSavedIds([]);
      setLoading(false);
      return;
    }

    API.get("/saved")
      .then((res) => {
        const ids = res.data.map((a) => a.articleId);
        setSavedIds(ids);
      })
      .catch(() => setSavedIds([]))
      .finally(() => setLoading(false));
  }, []);

  // Optimistic Update Save
  const saveArticle = async (id, article) => {
    if (!id) return;

    // Immediate UI update
    setSavedIds((prev) => [...new Set([...prev, id])]);

    try {
      await API.post(`/saved/${id}`, { article });
    } catch (e) {
      // rollback if fails
      setSavedIds((prev) => prev.filter((x) => x !== id));
    }
  };

  // Optimistic Update Remove
  const removeSaved = async (id) => {
    setSavedIds((prev) => prev.filter((x) => x !== id));

    try {
      await API.delete(`/saved/${id}`);
    } catch {
      // rollback if fails
      setSavedIds((prev) => [...prev, id]);
    }
  };

  return (
    <SaveContext.Provider value={{ savedIds, saveArticle, removeSaved, loading }}>
      {children}
    </SaveContext.Provider>
  );
}
