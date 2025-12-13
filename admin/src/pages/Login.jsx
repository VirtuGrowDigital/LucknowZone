import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import bgimg from "../assets/Images/bgadmin.png";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../assets/Images/Logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 🔥 Correct admin login route
      const res = await API.post("/auth/admin/login", { email, password });

      localStorage.setItem("adminToken", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        className="backdrop-blur-md bg-white/20 p-10 rounded-2xl shadow-2xl w-[430px] border border-white/30"
        onSubmit={handleLogin}
      >
        <div className="flex justify-center  mb-8">
          <img src={logo} alt="Logo" className="w-32 drop-shadow-lg" />
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-3 bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        <label className="text-sm font-semibold text-white block drop-shadow mt-1">
          Email Address
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-white opacity-80 text-lg">
            <FiMail />
          </span>
          <input
            type="email"
            className="pl-11 border border-white/50 bg-white/10 text-white placeholder-white/60 p-3 w-full rounded-md outline-none focus:border-white transition"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label className="text-sm font-semibold text-white block drop-shadow mt-6">
          Password
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-white opacity-80 text-lg">
            <FiLock />
          </span>

          <input
            type={showPassword ? "text" : "password"}
            className="pl-11 pr-11 border border-white/50 bg-white/10 text-white placeholder-white/60 p-3 w-full rounded-md outline-none focus:border-white transition"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="absolute inset-y-0 right-3 flex items-center text-white opacity-80 text-xl cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button className="bg-red-600 hover:bg-red-700 text-white font-bold w-full py-3 mt-8 rounded-full text-lg shadow-lg transition">
          Login
        </button>
      </form>
    </div>
  );
}
