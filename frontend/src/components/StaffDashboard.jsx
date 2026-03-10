import { useState, useEffect } from "react";
import api from "../api/axios.js";
import Loading from "./Loading.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

const StaffDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/staff/dashboard");
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
    return <Loading label="Loading staff dashboard" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!dashboardData) {
    return <ErrorMessage message="No dashboard data available" />;
  }

  const {
    staffName,
    courses = [],
    students = [],
    analytics = {},
    activeStudents = 0,
    totalCourses = 0,
    completionRate = 0
  } = dashboardData;

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {staffName}</h1>
        <p>Manage your courses, students, and track analytics</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Courses</h3>
          <div className="stat-value">{totalCourses}</div>
        </div>

        <div className="stat-card">
          <h3>Active Students</h3>
          <div className="stat-value">{activeStudents}</div>
        </div>

        <div className="stat-card">
          <h3>Avg. Completion Rate</h3>
          <div className="progress-value">{completionRate}%</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          Course Management
        </button>
        <button
          className={`tab-button ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          Student List
        </button>
        <button
          className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="tab-content">
          <h2>Dashboard Overview</h2>
          <p className="dashboard-description">
            You have {totalCourses} active course{totalCourses !== 1 ? "s" : ""} with {activeStudents} student{activeStudents !== 1 ? "s" : ""}.
            Use the tabs below to manage your courses, view student progress, and access analytics.
          </p>
        </div>
      )}

      {activeTab === "courses" && (
        <div className="tab-content">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Your Courses</h2>
              <button className="button primary">+ Add Course</button>
            </div>

            {courses && courses.length > 0 ? (
              <div className="course-list">
                {courses.map((course, index) => (
                  <article key={index} className="course-item">
                    <div className="course-header">
                      <h3>{course.title || course.name || "Untitled Course"}</h3>
                      <span className={`course-status ${course.status || "active"}`}>
                        {course.status || "Active"}
                      </span>
                    </div>
                    <p>{course.description || "No description available"}</p>
                    {course.enrolledStudents !== undefined && (
                      <div className="course-meta">
                        <span>Students enrolled: {course.enrolledStudents}</span>
                      </div>
                    )}
                    <div className="course-actions">
                      <button className="button secondary">Edit</button>
                      <button className="button secondary">View Progress</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state">No courses created yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "students" && (
        <div className="tab-content">
          <div className="dashboard-section">
            <h2>Student List</h2>
            {students && students.length > 0 ? (
              <div className="student-list">
                {students.map((student, index) => (
                  <article key={index} className="student-item">
                    <div className="student-info">
                      <h3>{student.name || "Unnamed Student"}</h3>
                      <p>{student.email || "No email provided"}</p>
                    </div>
                    <div className="student-stats">
                      <span>Courses: {student.enrolledCourses || 0}</span>
                      <span>Progress: {student.progress || 0}%</span>
                    </div>
                    <button className="button secondary">View Details</button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state">No students enrolled yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="tab-content">
          <div className="dashboard-section">
            <h2>Analytics</h2>
            <div className="analytics-cards">
              <article className="analytics-card">
                <h3>Course Completion Rate</h3>
                <div className="analytics-value">{analytics.completionRate || 0}%</div>
                <p>Average across all your courses</p>
              </article>
              <article className="analytics-card">
                <h3>Student Engagement</h3>
                <div className="analytics-value">{analytics.engagement || 0}%</div>
                <p>Based on activity and participation</p>
              </article>
              <article className="analytics-card">
                <h3>Average Grade</h3>
                <div className="analytics-value">{analytics.averageGrade || "N/A"}</div>
                <p>Across all graded assessments</p>
              </article>
              <article className="analytics-card">
                <h3>Total Hours Taught</h3>
                <div className="analytics-value">{analytics.totalHours || 0}</div>
                <p>This month</p>
              </article>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StaffDashboard;
