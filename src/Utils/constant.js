import axios from "axios";

export const BASE_URL = location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://brilliant-wonder-production-63d3.up.railway.app";

// Attach token to every request automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});