import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddBlog from "./pages/AddBlogs";
import AddNews from "./pages/AddNews";
import AddTicker from "./pages/AddTicker";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import PendingAPINews from "./pages/PendingAPINews";



export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-news"
          element={
            <ProtectedRoute>
              <AddNews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-blog"
          element={
            <ProtectedRoute>
              <AddBlog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-ticker"
          element={
            <ProtectedRoute>
              <AddTicker />
            </ProtectedRoute>
          }
        />
        <Route path="/pending-api-news" element={<PendingAPINews />} />
      </Routes>

      {/* Mount BOTH if you want both libraries */}
      <Toaster position="top-right" />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
