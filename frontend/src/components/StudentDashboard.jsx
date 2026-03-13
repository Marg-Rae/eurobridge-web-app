import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../api/axios.js";
import EditDashboardForm from "./EditDashboardForm.jsx";
import Loading from "./Loading.jsx";

const StudentDashboard = () => {
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
        const response = await api.get("/api/dashboard/student");
        console.log("Student content fetched:", response.data);
        setContent(response.data.content);
        setError(null);
      } catch (err) {
        console.error("Error fetching student content:", err);
        setError("Failed to load dashboard content");
        // Set default empty content on error
        setContent({
          courses: [],
          grades: [],
          assignments: [],
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
            <p className="dashboard-subtitle">Student Dashboard</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
        <div className="dashboard-container">
          <EditDashboardForm
            userRole="student"
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
          <p className="dashboard-subtitle">Student Dashboard</p>
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
              <strong>Role:</strong> <span className="role-badge">{user?.role}</span>
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Your Courses</h2>
          <div className="placeholder-content">
            {content?.courses && content.courses.length > 0 ? (
              <>
                <p>📚 You are enrolled in the following courses:</p>
                <ul>
                  {content.courses.map((course, idx) => (
                    <li key={idx}>
                      {course.name} {course.code ? `(${course.code})` : ""} - {course.credits} credits
                      {course.completed && " ✓"}
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
          <h2>Your Grades</h2>
          <div className="placeholder-content">
            {content?.grades && content.grades.length > 0 ? (
              <>
                <p>📊 Your grades:</p>
                <ul>
                  {content.grades.map((grade, idx) => (
                    <li key={idx}>
                      {grade.courseName}: {grade.grade} ({grade.percentage}%)
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>📊 No grades recorded yet. Click "Edit Dashboard" to add grades.</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Assignments</h2>
          <div className="placeholder-content">
            {content?.assignments && content.assignments.length > 0 ? (
              <>
                <p>📝 Your assignments:</p>
                <ul>
                  {content.assignments.map((assignment, idx) => (
                    <li key={idx}>
                      {assignment.title} ({assignment.course}) - Due: {assignment.dueDate}{" "}
                      {assignment.submitted && "✓ Submitted"}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>📝 No assignments added yet. Click "Edit Dashboard" to add assignments.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentDashboard;
