import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const StudentDashboard = () => {
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
          <p className="dashboard-subtitle">Student Dashboard</p>
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
              <strong>Role:</strong> <span className="role-badge">{user?.role}</span>
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Your Courses</h2>
          <div className="placeholder-content">
            <p>📚 You are enrolled in the following courses:</p>
            <ul>
              <li>Introduction to Programming</li>
              <li>Web Development Fundamentals</li>
              <li>Advanced JavaScript</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Progress</h2>
          <div className="placeholder-content">
            <p>📊 Your learning progress:</p>
            <div className="progress-item">
              <span>Introduction to Programming</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "75%" }}></div>
              </div>
              <span>75%</span>
            </div>
            <div className="progress-item">
              <span>Web Development Fundamentals</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "60%" }}></div>
              </div>
              <span>60%</span>
            </div>
            <div className="progress-item">
              <span>Advanced JavaScript</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "45%" }}></div>
              </div>
              <span>45%</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Notifications</h2>
          <div className="placeholder-content">
            <p>🔔 Recent Updates:</p>
            <ul>
              <li>✓ Assignment deadline extension: Web Development Project (Next Monday)</li>
              <li>✓ New course material available in Advanced JavaScript</li>
              <li>✓ Your instructor posted feedback on your last quiz</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentDashboard;
