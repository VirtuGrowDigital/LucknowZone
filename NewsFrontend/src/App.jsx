import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "./Components/Header";
import HeroSection from "./Components/HeroSection";
import MainNav from "./Components/MainNav";

import TopStories from "./pages/TopStories";
import CategoryPage from "./pages/CategoryPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import SavedArticles from "./pages/SavedArticles";
import { SaveProvider } from "./context/SaveContext";

import { WeatherProvider } from "./context/WeatherContext";
import Footer from "./Components/Footer";

export default function App() {
  return (
    <WeatherProvider>
      <SaveProvider>
        {/* 🔔 TOAST GLOBAL */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "14px",
              background: "#111",
              color: "#fff",
            },
          }}
        />

        <Header />
        <HeroSection />
        <MainNav />

        <Routes>
          {/* HOME */}
          <Route path="/" element={<TopStories />} />
          <Route path="/top-stories" element={<Navigate to="/" />} />

          {/* BLOG */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />

          {/* SAVED ARTICLES (LOGIN REQUIRED) */}
          <Route path="/saved" element={<SavedArticles />} />

          {/* CATEGORIES */}
          <Route path="/local" element={<CategoryPage />} />
          <Route path="/politics" element={<CategoryPage />} />
          <Route path="/sports" element={<CategoryPage />} />
          <Route path="/tech" element={<CategoryPage />} />
          <Route path="/health" element={<CategoryPage />} />
          <Route path="/business" element={<CategoryPage />} />
          <Route path="/entertainment" element={<CategoryPage />} />
        </Routes>

        <Footer />
      </SaveProvider>
    </WeatherProvider>
  );
}
