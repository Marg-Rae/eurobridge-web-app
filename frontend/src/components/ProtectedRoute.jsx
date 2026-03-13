import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Loading from "./Loading.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading, token } = useAuth();

  // Debug logging
  console.log("ProtectedRoute Debug:", {
    isAuthenticated,
    user,
    token: token ? "Present" : "Missing",
    loading,
    allowedRoles,
    userRole: user?.role,
  });

  if (loading) {
    return <Loading label="Loading..." />;
  }

  if (!isAuthenticated || !token || !user) {
    console.warn("Auth check failed - redirecting to login", {
      isAuthenticated,
      tokenExists: !!token,
      userExists: !!user,
    });
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.warn("Role check failed - redirecting to home", {
      userRole: user?.role,
      allowedRoles,
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
