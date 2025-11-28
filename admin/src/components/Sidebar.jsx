import { NavLink, useNavigate } from "react-router-dom";
import { FaNewspaper, FaPlus, FaList, FaSignOutAlt, FaHome } from "react-icons/fa";
import logo from "../assets/Images/Logo.png";

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Add News", icon: <FaPlus />, path: "/add-news" },
    { name: "Add Blog", icon: <FaPlus />, path: "/add-blog" },
    { name: "Manage News", icon: <FaList />, path: "/manage-news" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="w-64 min-h-screen bg-[#0b1c20] text-white flex flex-col py-6">
      
      {/* Logo */}
      <div className="flex justify-center mb-10">
        <img src={logo} alt="logo" className="w-20" />
      </div>

      {/* Menu */}
      <div className="flex-1 space-y-3 px-4">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer 
              transition-all 
              ${isActive ? "bg-[#ff6b00]" : "bg-[#13272f] hover:bg-[#1d3b44]"}`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
