import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Loading from "./Loading.jsx";
import { useEffect, useState } from "react";
import api from "../api/axios.js";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [userToCheck, setUserToCheck] = useState(null);

  useEffect(() => {
    console.log("=== ProtectedRoute useEffect ===");
    
    // Check context state first, then localStorage as fallback
    const tokenFromContext = auth.token;
    const tokenFromStorage = localStorage.getItem("token");
    const tokenAvailable = tokenFromContext || tokenFromStorage;
    const userFromContext = auth.user;
    
    console.log("Token - context:", tokenFromContext ? "yes" : "no", "storage:", tokenFromStorage ? "yes" : "no");
    console.log("User - context:", userFromContext ? userFromContext.name : "no");
    console.log("Loading:", auth.loading);

    // Still loading from initial mount
    if (auth.loading) {
      console.log("Context still loading, waiting...");
      return;
    }

    // User already loaded in context from login or initial fetch
    if (userFromContext && tokenAvailable) {
      console.log("User in context:", userFromContext.name, "role:", userFromContext.role);
      setUserToCheck(userFromContext);
      setIsReady(true);
      return;
    }

    // Have token but no user - fetch from API
    if (tokenAvailable && !userFromContext) {
      console.log("Have token from", tokenFromContext ? "context" : "storage", "but no user, fetching...");
      const fetchUser = async () => {
        try {
          const response = await api.get("/api/auth/me");
          console.log("Fetched user:", response.data.user.name, "role:", response.data.user.role);
          setUserToCheck(response.data.user);
          setIsReady(true);
        } catch (error) {
          console.error("Failed to fetch user:", error.message);
          // If fetch fails, clear everything
          localStorage.removeItem("token");
          setUserToCheck(null);
          setIsReady(true);
        }
      };
      fetchUser();
      return;
    }

    // No token and no user - not authenticated
    console.log("No token and no user, not authenticated");
    setIsReady(true);
  }, [auth.token, auth.user, auth.loading]);

  // Still loading
  if (!isReady) {
    console.log("Not ready, showing loading screen");
    return <Loading label="Loading..." />;
  }

  // Check if authenticated (use context first, then localStorage, then API fetch result)
  const currentUser = userToCheck || auth.user;
  const hasToken = auth.token || localStorage.getItem("token");
  
  if (!hasToken || !currentUser) {
    console.log("Not authenticated - token:", hasToken ? "yes" : "no", "user:", currentUser ? "yes" : "no", "redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    console.log("Role check failed - user:", currentUser.role, "allowed:", allowedRoles, "redirecting home");
    return <Navigate to="/" replace />;
  }

  console.log("Access granted - rendering", currentUser.name);
  return children;
};

export default ProtectedRoute;
