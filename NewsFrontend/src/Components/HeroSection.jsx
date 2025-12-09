import React, { useEffect, useState } from "react";
import bgImage from "../assets/Images/Lucknow-bg.jpg";
import API from "../utils/api";

export default function HeroSection() {
  const [breakingNews, setBreakingNews] = useState([]);
  const [direction, setDirection] = useState("forward");

  // =========================
  // FETCH BREAKING NEWS
  // =========================
  useEffect(() => {
    async function loadBreaking() {
      try {
        const res = await API.get("/news/breaking");
        setBreakingNews(res.data.breaking || []);
      } catch (err) {
        console.error("Failed to load breaking news:", err);
      }
    }

    loadBreaking();
    const interval = setInterval(loadBreaking, 30000);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // TICKER DIRECTION SWITCH
  // =========================
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection((d) => (d === "forward" ? "backward" : "forward"));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* INLINE ANIMATIONS */}
      <style>
        {`
          @keyframes tickerForward {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          @keyframes tickerBackward {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .ticker-forward { animation: tickerForward 15s linear infinite; }
          .ticker-backward { animation: tickerBackward 15s linear infinite; }

          /* ⭐ CLEAN GLOW EFFECT FOR BREAKING LABEL */
          @keyframes breakingGlow {
            0%, 100% {
              box-shadow: 0 0 0px rgba(255, 0, 0, 0.0);
              background-color: white;
            }
            50% {
              box-shadow: 0 0 12px rgba(255, 0, 0, 0.7);
              background-color: #ffe5e5;
            }
          }
          .breaking-glow {
            animation: breakingGlow 4s ease-in-out infinite;
          }
        `}
      </style>

      {/* HERO SECTION */}
      <section
        className="relative w-full py-16 md:py-20 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* BOTTOM GRADIENT */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent"></div>

        {/* HERO CONTENT */}
        <div className="relative z-10 text-center text-white px-4 mt-12">
          <div className="mx-auto backdrop-blur-lg bg-white/10 px-6 py-4 rounded-2xl shadow-xl max-w-2xl border border-white/20">
            <p className="text-xs uppercase tracking-wide text-gray-200 mb-2 animate-pulse">
              🔴 Updated Just Now
            </p>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-xl">
              Your City. Your News.
            </h1>

            <p className="mt-3 text-base md:text-xl font-light opacity-90">
              Real-Time Updates from Lucknow.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {["Trending", "Politics", "Weather", "Sports"].map((chip) => (
                <span
                  key={chip}
                  className="px-4 py-1 text-xs bg-white/20 rounded-full border border-white/30 backdrop-blur-md"
                >
                  {chip}
                </span>
              ))}
            </div>

            <button
              className="
    mt-6 px-7 py-3 
    text-white rounded-full font-semibold shadow-lg flex items-center gap-2 mx-auto
    transition-all duration-300
    bg-gradient-to-r from-[#EF4444] to-[#FB923C]
    hover:from-[#FB923C] hover:to-[#EF4444]
  "
            >
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              Watch Live Now
            </button>
          </div>
        </div>

        {/* BREAKING NEWS TICKER */}
        <div className="absolute bottom-0 left-0 w-full bg-red-600 overflow-hidden">
          <div className="flex items-center text-white text-sm md:text-base font-semibold h-7 mx-2 my-2 relative">
            {/* BREAKING LABEL WITH GLOW */}
            <span
              className="
              bg-white 
              text-red-600 
              px-4 
              h-full 
              flex 
              items-center 
              z-20 
              font-bold 
              breaking-glow
            "
            >
              BREAKING
            </span>

            {/* LEFT MASK */}
            <div className="absolute left-0 w-24 h-full bg-gradient-to-r from-red-600 to-transparent pointer-events-none"></div>

            {/* TICKER */}
            <div className="flex-1 overflow-hidden relative">
              <div
                className={`
                  whitespace-nowrap px-4
                  ${
                    direction === "forward"
                      ? "ticker-forward"
                      : "ticker-backward"
                  }
                `}
              >
                {breakingNews.length > 0
                  ? breakingNews
                      .filter((item) => item.active)
                      .map((item) => item.text)
                      .join(" • ")
                  : "Loading breaking news..."}
              </div>
            </div>

            {/* RIGHT MASK */}
            <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-red-600 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>
    </>
  );
}
