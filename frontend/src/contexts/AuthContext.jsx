import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    console.log("AuthContext init - SavedToken:", savedToken ? "Present" : "Missing");
    if (savedToken) {
      setToken(savedToken);
      console.log("Fetching current user with saved token");
      // Verify token is still valid by fetching current user
      fetchCurrentUser(savedToken);
    } else {
      console.log("No saved token - setting loading to false");
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken) => {
    try {
      console.log("Fetching current user...");
      // Just need to pass the token to localStorage so the interceptor can pick it up
      if (authToken) {
        localStorage.setItem("token", authToken);
      }
      const response = await api.get("/api/auth/me");
      console.log("Current user fetched:", response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, userType = "student") => {
    try {
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
        userType,
      });
      const { token, user } = response.data;
      console.log("Register response:", { token: token ? "Present" : "Missing", user });
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      console.log("Auth state set from registration");
      return { success: true, user };
    } catch (error) {
      console.error("Registration error:", error);
      const message = error.response?.data?.message || "Registration failed";
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Login attempt:", email);
      const response = await api.post("/api/auth/login", { email, password });
      console.log("Login response:", response.data);
      const { token, user } = response.data;
      console.log("Setting auth state - Token:", token ? "Present" : "Missing", "User:", user);
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      console.log("Auth state set successfully");
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      console.log("Logout complete");
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
