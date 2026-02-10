import axios from "axios";

const api = axios.create({
  // Set VITE_API_BASE_URL to your Render API URL in Netlify env vars.
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
});

export default api;
