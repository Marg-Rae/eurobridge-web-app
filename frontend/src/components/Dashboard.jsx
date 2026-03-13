import { useAuth } from "../contexts/AuthContext.jsx";
import StudentDashboard from "./StudentDashboard.jsx";
import StaffDashboard from "./StaffDashboard.jsx";

const Dashboard = () => {
  const { user } = useAuth();

  // Show appropriate dashboard based on user role
  if (user?.role === "staff" || user?.role === "admin") {
    return <StaffDashboard />;
  }

  // Default to student dashboard for "student" role or any other role
  return <StudentDashboard />;
};

export default Dashboard;
