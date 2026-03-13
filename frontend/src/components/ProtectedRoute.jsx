import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Loading from "./Loading.jsx";
import { useEffect, useState } from "react";
import api from "../api/axios.js";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, token } = useAuth();
  const [localUser, setLocalUser] = useState(user);
  const [userLoaded, setUserLoaded] = useState(!!user);

  // If user not yet in context but token exists, fetch current user
  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !user) {
        console.log("ProtectedRoute: Token exists but user not loaded, fetching...");
        try {
          const response = await api.get("/api/auth/me");
          console.log("ProtectedRoute: User fetched:", response.data.user);
          setLocalUser(response.data.user);
          setUserLoaded(true);
        } catch (error) {
          console.error("ProtectedRoute: Failed to fetch user:", error);
          setUserLoaded(true); // Stop loading even on error
        }
      } else if (user) {
        console.log("ProtectedRoute: User already in context");
        setLocalUser(user);
        setUserLoaded(true);
      } else {
        console.log("ProtectedRoute: No token and no user");
        setUserLoaded(true);
      }
    };
    
    fetchUserData();
  }, [token, user]);

  // Debug logging
  const debugUser = localUser || user;
  console.log("ProtectedRoute Debug:", {
    token: token ? "Present" : "Missing",
    user: debugUser ? `${debugUser.name} (${debugUser.role})` : "Missing",
    loading,
    userLoaded,
    allowedRoles,
    userRole: debugUser?.role,
    checksPassed: {
      hasToken: !!token,
      hasUser: !!debugUser,
      roleMatch: allowedRoles ? allowedRoles.includes(debugUser?.role) : true,
    },
  });

  // Wait for auth check to complete
  if (loading || !userLoaded) {
    console.log("ProtectedRoute: Loading user data...");
    return <Loading label="Loading..." />;
  }

  // Check if authenticated
  if (!token || !debugUser) {
    console.warn("ProtectedRoute: Not authenticated - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check role permissions
  if (allowedRoles && !allowedRoles.includes(debugUser.role)) {
    console.warn("ProtectedRoute: Insufficient permissions - redirecting to home", {
      userRole: debugUser.role,
      allowedRoles,
    });
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute: All checks passed - rendering component");
  return children;
};

export default ProtectedRoute;
