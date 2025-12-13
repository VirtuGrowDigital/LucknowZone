import axios from "axios";

const API = axios.create({
  baseURL: "https://lucknowzone.onrender.com",
});

API.interceptors.request.use((config) => {
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.warn("⚠ Storage blocked or unavailable:", err.message);
  }

  return config;
});



export default API;
