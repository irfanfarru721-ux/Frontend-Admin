import axios from "axios";

const BASE = import.meta.env.VITE_ADMIN_API || "/api/admin";

const API = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const t = localStorage.getItem("admin_token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default API;
