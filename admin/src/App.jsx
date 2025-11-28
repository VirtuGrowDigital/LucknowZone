import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddBlog from "./pages/AddBlogs";
import AddNews from "./pages/AddNews";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
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

    </Routes>
  );
}
