import axios from "axios";

// Determine API base URL
let baseURL = "http://localhost:5000"; // Default for local development

// Use production URL for built app or non-localhost environments
if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
  baseURL = "https://eurobridge-web-app-2.onrender.com";
}

const api = axios.create({
  baseURL: baseURL
});

export default api;
