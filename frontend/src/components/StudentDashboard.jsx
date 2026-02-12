import { useState, useEffect } from "react";
import api from "../api/axios.js";
import Loading from "./Loading.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/student/dashboard");
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading label="Loading dashboard" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!dashboardData) {
    return <ErrorMessage message="No dashboard data available" />;
  }

  const { studentName, enrolledCourses, progressPercentage, unreadNotifications } = dashboardData;

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {studentName}</h1>
        {unreadNotifications > 0 && (
          <div className="notification-badge">
            {unreadNotifications} unread notification{unreadNotifications !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Progress</h3>
          <div className="progress-value">{progressPercentage}%</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <h3>Enrolled Courses</h3>
          <div className="course-count">{enrolledCourses?.length || 0}</div>
        </div>
      </div>

      <div className="enrolled-courses">
        <h2>Your Courses</h2>
        {enrolledCourses && enrolledCourses.length > 0 ? (
          <div className="course-list">
            {enrolledCourses.map((course, index) => (
              <article key={index} className="course-item">
                <h3>{course.title || course.name || "Untitled Course"}</h3>
                <p>{course.description || "No description available"}</p>
                {course.instructor && (
                  <div className="course-meta">
                    <span>Instructor: {course.instructor}</span>
                  </div>
                )}
                {course.progress !== undefined && (
                  <div className="course-progress">
                    <span>Progress: {course.progress}%</span>
                    <div className="progress-bar small">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">No courses enrolled yet</p>
        )}
      </div>
    </section>
  );
};

export default StudentDashboard;
