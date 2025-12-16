export default function App() {
  return (
    <WeatherProvider>
      {/* PAGE LAYOUT */}
      <div className="min-h-screen flex flex-col">
        {/* TOP */}
        <Header />
        <MainNav />

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <HeroSection />

          <Routes>
            {/* HOME */}
            <Route path="/" element={<TopStories />} />

            {/* Top Stories alias */}
            <Route path="/top-stories" element={<Navigate to="/" />} />

            {/* BLOG */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />

            {/* CATEGORY PAGES */}
            <Route path="/local" element={<CategoryPage />} />
            <Route path="/politics" element={<CategoryPage />} />
            <Route path="/sports" element={<CategoryPage />} />
            <Route path="/tech" element={<CategoryPage />} />
            <Route path="/health" element={<CategoryPage />} />
            <Route path="/business" element={<CategoryPage />} />
            <Route path="/entertainment" element={<CategoryPage />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </WeatherProvider>
  );
}
