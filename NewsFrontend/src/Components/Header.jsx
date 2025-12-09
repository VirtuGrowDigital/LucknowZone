import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdContact, IoMdPin } from "react-icons/io";
import Logo from "../assets/Images/Logo.png";
import useWeather from "../hooks/useWeather";

// ===============================
// SLIDE-UP NUMBER ANIMATION
// ===============================
function SlideNumber({ value }) {
  const [prev, setPrev] = useState(value);

  useEffect(() => {
    if (value !== prev) {
      const timeout = setTimeout(() => setPrev(value), 300);
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <div className="relative h-4 overflow-hidden text-xs min-w-[35px]">
      <div
        className={`absolute inset-0 transition-transform duration-300 ${
          value !== prev ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {prev}
      </div>

      <div
        className={`absolute inset-0 transition-transform duration-300 ${
          value !== prev ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

// ===============================
// AQI LOADER
// ===============================
function AQILoader() {
  return (
    <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full w-full bg-red-500 animate-pulse"></div>
    </div>
  );
}

// ===============================
// AQI COLOR
// ===============================
function getAqiColor(aqi) {
  if (aqi == null) return "bg-gray-400";
  if (aqi <= 50) return "bg-green-500";
  if (aqi <= 100) return "bg-yellow-400";
  if (aqi <= 150) return "bg-orange-500";
  if (aqi <= 200) return "bg-red-500";
  return "bg-red-700";
}

// ===============================
// AQI LABEL
// ===============================
function getAqiLabel(aqi) {
  if (aqi == null) return "";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Poor";
  if (aqi <= 200) return "Very Poor";
  return "Severe";
}

// ===============================
// MAIN HEADER
// ===============================
export default function Header() {
  const { temperature, isDay, aqi, refresh } = useWeather();

  return (
    <header
      className="w-full backdrop-blur-lg bg-white/60 shadow-sm sticky top-0 z-50 border-b border-white/30"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* MAIN CONTAINER */}
      <div className=" mx-2 flex flex-col md:flex-row md:items-center px-2 pb-2 gap-3">

        {/* LEFT — LOGO + LOCATION */}
        <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-[200px]">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-12 md:h-18 w-auto object-contain" />

            {/* LOCATION */}
            <div className="hidden sm:flex items-center gap-1 text-gray-700 text-sm font-medium">
              <IoMdPin className="text-red-500 text-lg" />
              Lucknow
            </div>
          </div>

          {/* PROFILE ICON—VISIBLE ON MOBILE */}
          <button className="md:hidden">
            <IoMdContact className="h-8 w-8 text-2xl text-[#D4A017]" />
          </button>
        </div>

        {/* CENTER — SEARCH INPUT */}
        <div className="w-full flex justify-center md:px-4">
          <div className="w-full max-w-lg relative">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full rounded-full border border-gray-300 bg-white/60 backdrop-blur-md 
              py-2.5 pl-4 pr-10 text-sm shadow-sm focus:outline-none 
              focus:ring-[3px] focus:ring-red-400/50"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500" />
          </div>
        </div>

        {/* RIGHT — WEATHER | AQI | LIVE | PROFILE */}
        <div className="hidden md:flex items-center justify-end gap-7 text-xs w-[260px]">

          {/* 🌤 WEATHER */}
          <div className="flex items-center gap-1 text-gray-700 font-medium">
            <span>{isDay ? "☀️" : "🌙"}</span>
            <SlideNumber value={temperature ? `${temperature}°C` : "--"} />
          </div>

          {/* 🌫 AQI */}
          <div className="flex items-center gap-1 relative group cursor-pointer">

            {aqi == null ? (
              <AQILoader />
            ) : (
              <>
                <span className={`w-3 h-3 rounded-full ${getAqiColor(aqi)}`} />

                <SlideNumber value={`AQI ${aqi}`} />

                {/* TOOLTIP */}
                <div
                  className="
                    absolute top-7 left-1/2 -translate-x-1/2 
                    opacity-0 group-hover:opacity-100 
                    transition-all duration-200 
                    bg-white shadow-xl border border-gray-200 
                    rounded-lg px-3 py-2 text-[11px] text-gray-800 w-44 z-50
                  "
                >
                  <p><strong>AQI:</strong> {aqi}</p>
                  <p><strong>Severity:</strong> {getAqiLabel(aqi)}</p>
                </div>
              </>
            )}
          </div>

          {/* LIVE BUTTON */}
          <button
            onClick={refresh}
            className="flex items-center gap-1 bg-red-500/10 text-red-600 px-3 py-1 rounded-full h-8 shadow-sm hover:bg-red-500/20 transition"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </button>

          {/* PROFILE ICON */}
          <button>
            <IoMdContact className="h-8 w-8 text-2xl text-[#D4A017]" />
          </button>
        </div>
      </div>
    </header>
  );
}
