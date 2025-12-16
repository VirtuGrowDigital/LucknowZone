import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./Components/Header";
import HeroSection from "./Components/HeroSection";
import MainNav from "./Components/MainNav";

import TopStories from "./pages/TopStories";
import CategoryPage from "./pages/CategoryPage";

import { WeatherProvider } from "./context/WeatherContext";
import Footer from "./Components/Footer";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";




export default function App() {
  return (
    <WeatherProvider>
      <Header />
      <HeroSection />
      <MainNav />

      <Routes>
        {/* REAL HOME */}
        <Route path="/" element={<TopStories />} />

        {/* Top Stories tab maps to homepage */}
        <Route path="/top-stories" element={<Navigate to="/" />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />

        {/* Category routes */}
        <Route path="/local" element={<CategoryPage />} />
        <Route path="/politics" element={<CategoryPage />} />
        <Route path="/sports" element={<CategoryPage />} />
        <Route path="/tech" element={<CategoryPage />} />
        <Route path="/health" element={<CategoryPage />} />
        <Route path="/business" element={<CategoryPage />} />
        <Route path="/entertainment" element={<CategoryPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
      <Footer />
    </WeatherProvider>
    
  );
}
