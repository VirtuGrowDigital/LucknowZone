import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaHome,
  FaBlog,
  FaNewspaper,
  FaBars,
  FaTimes,
  FaBolt,   // Icon for ticker
  // FaTag,  // Optional alternative
} from "react-icons/fa";
import logo from "../assets/Images/Logo.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Add News", icon: <FaNewspaper />, path: "/add-news" },
    { name: "Add Blog", icon: <FaBlog />, path: "/add-blog" },

    // ✅ NEW TICKER MENU ITEM
    { name: "Add Ticker", icon: <FaBolt />, path: "/add-ticker" },
    // Alternative: { name: "Add Ticker", icon: <FaTag />, path: "/add-ticker" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[#0b1c20] text-white flex items-center justify-between px-4 py-4 z-50 shadow-md">
        <img src={logo} alt="logo" className="w-12" />
        <button onClick={() => setOpen(!open)}>
          {open ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 min-h-screen w-64 bg-[#0b1c20] text-white flex flex-col py-6 shadow-xl
          transform transition-transform duration-300 z-40
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex justify-center mb-10 lg:mt-0 mt-14">
          <img src={logo} alt="logo" className="w-20 drop-shadow-lg" />
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-3 px-4">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                flex items-center gap-4 px-5 py-3 rounded-xl text-[15px] font-medium
                transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-[#ff6b00] text-white shadow-lg scale-[1.02]"
                    : "bg-[#13272f] hover:bg-[#1d3b44] text-gray-300 hover:text-white"
                }
              `
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <div className="px-4 mt-auto pb-3">
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-3 w-full 
              bg-red-600 hover:bg-red-700 
              py-3 px-5 rounded-xl 
              text-white font-semibold
              transition-all duration-200
            "
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
