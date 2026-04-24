import axios from "axios";

// Determine API base URL from environment variables or window.location
let baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Override with production URL for deployed apps
if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
  baseURL = import.meta.env.VITE_API_BASE_URL || "https://eurobridge-web-app-2.onrender.com";
}

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Request interceptor - Token attached to:", config.url);
    } else {
      console.log("Request interceptor - No token for:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log("Response OK:", response.config.url, response.status);
    return response;
  },
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
