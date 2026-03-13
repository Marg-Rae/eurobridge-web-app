import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { api } from "../api/axios.js";
import EditDashboardForm from "./EditDashboardForm.jsx";
import Loading from "./Loading.jsx";

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/staff");
        console.log("Staff content fetched:", response.data);
        setContent(response.data.content);
        setError(null);
      } catch (err) {
        console.error("Error fetching staff content:", err);
        setError("Failed to load dashboard content");
        // Set default empty content on error
        setContent({
          courses: [],
          statistics: {
            activeCourses: 0,
            totalStudents: 0,
            averageClassSize: 0,
          },
          recentActivity: [],
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchContent();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSaveContent = (updatedContent) => {
    setContent(updatedContent);
    setIsEditing(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (isEditing) {
    return (
      <section className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Edit Dashboard</h1>
            <p className="dashboard-subtitle">Staff Dashboard</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
        <div className="dashboard-container">
          <EditDashboardForm
            userRole="staff"
            currentContent={content}
            onSave={handleSaveContent}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="dashboard-subtitle">Staff Dashboard</p>
        </div>
        <div className="header-buttons">
          <button onClick={() => setIsEditing(true)} className="btn-edit">
            Edit Dashboard
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>Profile Information</h2>
          <div className="profile-info">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> <span className="role-badge staff">{user?.role}</span>
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Teaching Overview</h2>
          <div className="placeholder-content">
            <p>📊 Your Teaching Statistics:</p>
            <div className="stat-item">
              <span className="stat-label">Active Courses:</span>
              <span className="stat-value">{content?.statistics?.activeCourses || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Students:</span>
              <span className="stat-value">{content?.statistics?.totalStudents || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Class Size:</span>
              <span className="stat-value">
                {content?.statistics?.averageClassSize ? content.statistics.averageClassSize.toFixed(1) : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Courses</h2>
          <div className="placeholder-content">
            {content?.courses && content.courses.length > 0 ? (
              <>
                <p>📚 Courses You're Teaching:</p>
                <ul>
                  {content.courses.map((course, idx) => (
                    <li key={idx}>
                      {course.name} {course.section ? `(${course.section})` : ""} - {course.students || 0} students
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>📚 No courses added yet. Click "Edit Dashboard" to add courses.</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Activity</h2>
          <div className="placeholder-content">
            {content?.recentActivity && content.recentActivity.length > 0 ? (
              <>
                <p>🔔 Recent Updates:</p>
                <ul>
                  {content.recentActivity.slice(0, 5).map((activity, idx) => (
                    <li key={idx}>✓ {activity}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>🔔 No recent activity. Click "Edit Dashboard" to add activity updates.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaffDashboard;
