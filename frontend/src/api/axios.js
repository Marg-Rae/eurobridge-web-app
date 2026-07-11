import axios from "axios";
import { API_BASE_URL } from "./config.js";

// Create axios instance with centralized base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
