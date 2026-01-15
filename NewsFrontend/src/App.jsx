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
import NewsDetailPage from "./pages/NewsDetailPage";
import { WeatherProvider } from "./context/WeatherContext";
import Footer from "./Components/Footer";
import DontMiss from "./Components/DontMiss";
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
          <Route path="/" element={<TopStories />} />
          <Route path="/top-stories" element={<Navigate to="/" />} />

          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />

          <Route path="/saved" element={<SavedArticles />} />

          {/* ONE dynamic category route */}
          <Route path="/:category" element={<CategoryPage />} />

          <Route path="/news/:id" element={<NewsDetailPage />} />
        </Routes>

        <Footer />
      </SaveProvider>
    </WeatherProvider>
  );
}
