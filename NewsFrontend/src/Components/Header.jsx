import React, { useEffect, useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdContact, IoMdPin } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Images/Logo.png";
import useWeather from "../hooks/useWeather";
import API from "../utils/api";

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
// AQI COLOR + LABEL
// ===============================
function getAqiColor(aqi) {
  if (aqi == null) return "bg-gray-400";
  if (aqi <= 50) return "bg-green-500";
  if (aqi <= 100) return "bg-yellow-400";
  if (aqi <= 150) return "bg-orange-500";
  if (aqi <= 200) return "bg-red-500";
  return "bg-red-700";
}

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
  const { temperature, isDay, aqi } = useWeather();
  const navigate = useNavigate();

  // User state
  const [user, setUser] = useState(null);

  // Profile popup
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Search
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [noResultPopup, setNoResultPopup] = useState(false);

  // Auth popups
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  // Auth form
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // --------------------------
  // HELPER: attach token to API requests (optional if API util already does this)
  // --------------------------
  const attachAuthHeader = (token) => {
    // If your API util sets headers centrally, ensure it reads from localStorage; otherwise:
    if (token) {
      API.defaults = API.defaults || {};
      API.defaults.headers = API.defaults.headers || {};
      API.defaults.headers["Authorization"] = `Bearer ${token}`;
    } else if (API.defaults?.headers) {
      delete API.defaults.headers["Authorization"];
    }
  };

  // --------------------------
  // AUTO-LOAD USER (on mount)
  // --------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    attachAuthHeader(token);

    API.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        attachAuthHeader(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------
  // FETCH SUGGESTIONS DYNAMICALLY
  // --------------------------
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    API.get(`/search/suggestions?query=${encodeURIComponent(search)}`)
      .then((res) => {
        setSuggestions(res.data.suggestions || []);
        setShowSuggestions(true);
      })
      .catch(() => {
        setSuggestions([]);
        setShowSuggestions(false);
      });
  }, [search]);

  // --------------------------
  // SEARCH HANDLER
  // --------------------------
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      API.get(`/search?query=${encodeURIComponent(search)}`)
        .then((res) => {
          const results = res.data.results || [];
          if (!results.length) {
            setNoResultPopup(true);
          } else {
            navigate(`/search?query=${encodeURIComponent(search)}`);
          }
          setShowSuggestions(false);
        })
        .catch(() => setNoResultPopup(true));
    }
  };

  const handleSearchClick = () =>
    handleSearchSubmit({ key: "Enter", preventDefault: () => {} });

  // --------------------------
  // CLOSE PROFILE ON OUTSIDE CLICK (ignore clicks on profile button)
  // --------------------------
  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest(".profile-btn")) return;
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  // --------------------------
  // AUTH: Register
  // --------------------------
  const handleRegister = async () => {
    try {
      const { name, email, password } = authData;
      if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
      }

      const res = await API.post("/auth/register", { name, email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      attachAuthHeader(token);
      setUser(res.data.user || res.data.user);
      setShowRegisterPopup(false);
      setAuthData({ name: "", email: "", password: "" });
      alert("Account created");
    } catch (err) {
      console.error("Register error:", err?.response?.data || err.message);
      alert(err?.response?.data?.error || "Registration failed");
    }
  };

  // --------------------------
  // AUTH: Login
  // --------------------------
  const handleLogin = async () => {
    try {
      const { email, password } = authData;
      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      const res = await API.post("/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      attachAuthHeader(token);
      setUser(res.data.user);
      setShowLoginPopup(false);
      setAuthData({ name: "", email: "", password: "" });
      alert("Logged in");
    } catch (err) {
      console.error("Login error:", err?.response?.data || err.message);
      alert(err?.response?.data?.error || "Login failed");
    }
  };

  // --------------------------
  // AUTH: Logout
  // --------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    attachAuthHeader(null);
    setUser(null);
    setShowProfile(false);
  };

  return (
    <>
      {/* ======================= HEADER ======================= */}
      <header className="w-full backdrop-blur-lg bg-white/60 shadow-sm sticky top-0 z-50 border-b border-white/30">
        <div className="mx-2 flex flex-col md:flex-row md:items-center px-2 pb-2 gap-3">
          {/* LOGO + LOCATION */}
          <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-[200px]">
            <div className="flex items-center gap-3">
              <img src={Logo} className="h-12 md:h-16" alt="logo" />

              <div className="hidden sm:flex items-center gap-1 text-gray-700 text-sm font-medium">
                <IoMdPin className="text-red-500 text-lg" />
                Lucknow
              </div>
            </div>

            {/* MOBILE PROFILE BUTTON */}
            <button
              className="profile-btn md:hidden"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfile((prev) => !prev);
              }}
            >
              <IoMdContact className="h-8 w-8 text-2xl text-[#D4A017]" />
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="w-full flex justify-center md:px-4 relative">
            <div className="w-full max-w-lg relative">
              <input
                type="text"
                placeholder="Search news or blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-full rounded-full border border-gray-300 bg-white/60 backdrop-blur-md py-2.5 pl-4 pr-10 text-sm shadow-sm focus:ring-[3px] focus:ring-red-400/50"
              />

              <FaSearch
                onClick={handleSearchClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              />

              {/* 🔍 SUGGESTION DROPDOWN */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                  {suggestions.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        navigate(`/search?query=${encodeURIComponent(item)}`);
                        setSearch("");
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                    >
                      🔍 {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE — WEATHER | AQI | LIVE | PROFILE */}
          <div className="hidden md:flex items-center justify-end gap-7 text-xs w-[260px]">
            {/* WEATHER */}
            <div className="flex items-center gap-1 text-gray-700 font-medium">
              <span>{isDay ? "☀️" : "🌙"}</span>
              <SlideNumber value={temperature ? `${temperature}°C` : "--"} />
            </div>

            {/* AQI */}
            <div className="flex items-center gap-1 relative group cursor-pointer">
              {aqi == null ? (
                <AQILoader />
              ) : (
                <>
                  <span className={`w-3 h-3 rounded-full ${getAqiColor(aqi)}`} />
                  <SlideNumber value={`AQI ${aqi}`} />

                  <div className="absolute top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-white shadow-xl border border-gray-200 rounded-lg px-3 py-2 text-[11px] w-44 z-50">
                    <p>
                      <strong>AQI:</strong> {aqi}
                    </p>
                    <p>
                      <strong>Severity:</strong> {getAqiLabel(aqi)}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* LIVE BUTTON */}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1 bg-red-500/10 text-red-600 px-3 py-1 rounded-full shadow-sm hover:bg-red-500/20"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </button>

            {/* PROFILE ICON */}
            <button
              className="profile-btn"
              onClick={(e) => {
                e.stopPropagation(); // prevent outside-click from firing
                setShowProfile((prev) => !prev);
              }}
            >
              <IoMdContact className="h-8 w-8 text-[#D4A017]" />
            </button>
          </div>
        </div>

        {/* PROFILE PANEL */}
        {showProfile && (
          <div
            ref={profileRef}
            className="fixed top-20 right-4 w-64 bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-5 z-[9999]"
          >
            {!user ? (
              <>
                <h3 className="text-lg font-semibold mb-3">Welcome!</h3>

                <button
                  className="w-full bg-red-500 text-white py-2 rounded-xl mb-2"
                  onClick={() => {
                    setShowRegisterPopup(true);
                    setShowProfile(false);
                  }}
                >
                  Create Profile
                </button>

                <button
                  className="w-full border border-red-600 text-red-600 py-2 rounded-xl mb-2"
                  onClick={() => {
                    setShowLoginPopup(true);
                    setShowProfile(false);
                  }}
                >
                  Login
                </button>

                <button
                  onClick={() => setShowProfile(false)}
                  className="w-full text-gray-600 text-sm underline"
                >
                  Continue as Guest
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Hello, {user.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{user.email}</p>

                <div className="flex flex-col gap-3 text-gray-700 text-sm">
                  <button
                    onClick={() => {
                      navigate("/saved"); // example
                      setShowProfile(false);
                    }}
                    className="text-left"
                  >
                    Saved Articles
                  </button>

                  <button
                    onClick={() => {
                      navigate("/account");
                      setShowProfile(false);
                    }}
                    className="text-left"
                  >
                    Account
                  </button>

                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full bg-red-500 text-white py-2 rounded-xl"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* ===================== POPUP — LOGIN ===================== */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30 w-[380px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login</h2>
            <p className="text-sm text-gray-600 mb-6">Enter your credentials</p>

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-xl border mb-3"
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-xl border mb-4"
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            />

            <button
              onClick={handleLogin}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold"
            >
              Login
            </button>

            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <span
                className="text-red-600 cursor-pointer underline"
                onClick={() => {
                  setShowLoginPopup(false);
                  setShowRegisterPopup(true);
                }}
              >
                Create Profile
              </span>
            </p>

            <button
              onClick={() => setShowLoginPopup(false)}
              className="mt-4 w-full text-gray-600 text-sm underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===================== POPUP — REGISTER ===================== */}
      {showRegisterPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30 w-[380px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Profile</h2>
            <p className="text-sm text-gray-600 mb-6">Create your account</p>

            <input
              type="text"
              placeholder="Full name"
              className="w-full p-3 rounded-xl border mb-3"
              value={authData.name}
              onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-xl border mb-3"
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-xl border mb-4"
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            />

            <button
              onClick={handleRegister}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold"
            >
              Create Account
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <span
                className="text-red-600 cursor-pointer underline"
                onClick={() => {
                  setShowRegisterPopup(false);
                  setShowLoginPopup(true);
                }}
              >
                Login
              </span>
            </p>

            <button
              onClick={() => setShowRegisterPopup(false)}
              className="mt-4 w-full text-gray-600 text-sm underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===================== POPUP — NO RESULTS FOUND ===================== */}
      {noResultPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl text-center border border-white/30 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Results Found
            </h2>

            <p className="text-gray-600 mb-6">
              Nothing found for “<strong>{search}</strong>”.
            </p>

            <button
              onClick={() => setNoResultPopup(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow-lg transition"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
}
