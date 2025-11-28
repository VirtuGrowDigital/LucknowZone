import React from "react";
import { FaSearch } from "react-icons/fa";
import Logo from "../assets/Images/Logo.png";
import { IoMdContact } from "react-icons/io";


export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* LEFT — LOGO */}
        <div className="logo-container flex items-center justify-center h-full w-16">
          <img src={Logo} alt="Logo" className="h-full w-auto object-contain" />
        </div>

        {/* CENTER — SEARCH BAR */}
        <div className="flex-1 flex justify-center mx-4">
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full rounded-full border border-gray-200 py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
          </div>
        </div>

        {/* RIGHT SIDE — WEATHER | AQI | LIVE | PROFILE */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-1">
            <span>☀️</span>
            <span>28°C</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <span>🌫</span>
            <span>AQI 85</span>
          </div>

          <button className="flex items-center gap-1 bg-red-500/10 text-red-500 text-xs px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </button>

          <button className="flex items-center justify-center">
            <IoMdContact className="text-xl text-[#D4A017]" />{" "}
            {/* Mustard color */}
          </button>
        </div>
      </div>
    </header>
  );
}
