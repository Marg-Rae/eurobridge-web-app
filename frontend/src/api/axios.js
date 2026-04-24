import axios from "axios";
import { API_BASE_URL } from "./config.js";

// Create axios instance with centralized base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Request with token:", config.method?.toUpperCase(), config.url);
    } else {
      console.log("📤 Request without token:", config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and log responses
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response OK:", response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.message);

    // Handle 401 errors (token expired/invalid)
    if (error.response?.status === 401) {
      console.log("🚪 401 Unauthorized - clearing token and redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
  (error) => {
    console.log("Response Error:", error.config?.url, error.response?.status);
    if (error.response?.status === 401) {
      // Token is invalid or expired
      console.log("401 Unauthorized - clearing token and redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
