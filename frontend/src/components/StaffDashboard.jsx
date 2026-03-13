import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="dashboard-subtitle">Staff Dashboard</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

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
              <span className="stat-value">5</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Students:</span>
              <span className="stat-value">145</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Class Size:</span>
              <span className="stat-value">29</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Courses</h2>
          <div className="placeholder-content">
            <p>📚 Courses You're Teaching:</p>
            <ul>
              <li>Web Development Fundamentals (Sec A)</li>
              <li>Web Development Fundamentals (Sec B)</li>
              <li>Advanced JavaScript Patterns</li>
              <li>Database Design Principles</li>
              <li>Full-Stack MERN Development</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Activity</h2>
          <div className="placeholder-content">
            <p>🔔 Recent Updates:</p>
            <ul>
              <li>✓ New assignment submitted by 12 students in Sec A</li>
              <li>✓ 3 students requested 1-on-1 consultation</li>
              <li>✓ Course materials updated for Advanced JavaScript</li>
              <li>✓ Quiz results compiled for Web Development Fundamentals</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="placeholder-content">
            <p>⚡ Manage your courses and students:</p>
            <div className="quick-actions">
              <button className="action-btn">📝 Grade Assignments</button>
              <button className="action-btn">👥 View Student List</button>
              <button className="action-btn">📅 Create Quiz</button>
              <button className="action-btn">📂 Upload Materials</button>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Student Performance</h2>
          <div className="placeholder-content">
            <p>📈 Q1 2025 Performance Summary:</p>
            <div className="performance-metrics">
              <div className="metric">
                <span>Average Grade:</span>
                <strong>B+ (87%)</strong>
              </div>
              <div className="metric">
                <span>Pass Rate:</span>
                <strong>94%</strong>
              </div>
              <div className="metric">
                <span>Students Needing Support:</span>
                <strong>8</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default StaffDashboard;
