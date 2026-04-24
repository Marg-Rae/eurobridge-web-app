// Centralized API Configuration
// This ensures all API calls use the same base URL regardless of domain

// Get the API base URL from environment variables
const getApiBaseUrl = () => {
  // Always use the environment variable if set
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Fallback for development
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }

  // Production fallback (should not be used if env var is set)
  console.warn("VITE_API_BASE_URL not set, using fallback URL");
  return "https://eurobridge-web-app-2.onrender.com";
};

// Export the base URL
export const API_BASE_URL = getApiBaseUrl();

// Export full API endpoints
export const API_ENDPOINTS = {
  BLOGS: `${API_BASE_URL}/api/blogs`,
  APPLICATIONS: `${API_BASE_URL}/api/applications`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },
  DASHBOARD: {
    STUDENT: `${API_BASE_URL}/api/dashboard/student`,
    STAFF: `${API_BASE_URL}/api/dashboard/staff`,
  },
  COURSES: `${API_BASE_URL}/api/courses`,
  CONTACT: `${API_BASE_URL}/api/contact`,
};

// Utility function for making API calls with logging
export const apiCall = async (url, options = {}) => {
  console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText} for ${url}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ API Success: ${url}`);
    return data;
  } catch (error) {
    console.error(`💥 API Failure: ${url}`, error);
    throw error;
  }
};

// Export for backward compatibility
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  apiCall,
};