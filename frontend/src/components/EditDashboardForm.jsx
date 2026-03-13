import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../api/axios.js";

const EditDashboardForm = ({ userRole, currentContent, onSave, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // STUDENT CONTENT STATE
  const [studentForm, setStudentForm] = useState({
    courses: currentContent?.courses || [],
    grades: currentContent?.grades || [],
    assignments: currentContent?.assignments || [],
  });

  // STAFF CONTENT STATE
  const [staffForm, setStaffForm] = useState({
    courses: currentContent?.courses || [],
    statistics: currentContent?.statistics || {
      activeCourses: 0,
      totalStudents: 0,
      averageClassSize: 0,
    },
  });

  // STUDENT FORM HANDLERS
  const addStudentCourse = () => {
    setStudentForm({
      ...studentForm,
      courses: [...studentForm.courses, { name: "", code: "", credits: 0, completed: false }],
    });
  };

  const updateStudentCourse = (index, field, value) => {
    const updated = [...studentForm.courses];
    updated[index][field] = field === "completed" ? !updated[index][field] : value;
    setStudentForm({ ...studentForm, courses: updated });
  };

  const removeStudentCourse = (index) => {
    setStudentForm({
      ...studentForm,
      courses: studentForm.courses.filter((_, i) => i !== index),
    });
  };

  const addStudentGrade = () => {
    setStudentForm({
      ...studentForm,
      grades: [...studentForm.grades, { courseId: "", courseName: "", grade: "", percentage: 0 }],
    });
  };

  const updateStudentGrade = (index, field, value) => {
    const updated = [...studentForm.grades];
    updated[index][field] = field === "percentage" ? parseInt(value) || 0 : value;
    setStudentForm({ ...studentForm, grades: updated });
  };

  const removeStudentGrade = (index) => {
    setStudentForm({
      ...studentForm,
      grades: studentForm.grades.filter((_, i) => i !== index),
    });
  };

  const addStudentAssignment = () => {
    setStudentForm({
      ...studentForm,
      assignments: [
        ...studentForm.assignments,
        { title: "", course: "", dueDate: "", submitted: false, grade: "" },
      ],
    });
  };

  const updateStudentAssignment = (index, field, value) => {
    const updated = [...studentForm.assignments];
    updated[index][field] = field === "submitted" ? !updated[index][field] : value;
    setStudentForm({ ...studentForm, assignments: updated });
  };

  const removeStudentAssignment = (index) => {
    setStudentForm({
      ...studentForm,
      assignments: studentForm.assignments.filter((_, i) => i !== index),
    });
  };

  // STAFF FORM HANDLERS
  const addStaffCourse = () => {
    setStaffForm({
      ...staffForm,
      courses: [...staffForm.courses, { name: "", section: "", students: 0 }],
    });
  };

  const updateStaffCourse = (index, field, value) => {
    const updated = [...staffForm.courses];
    updated[index][field] = field === "students" ? parseInt(value) || 0 : value;
    setStaffForm({ ...staffForm, courses: updated });
  };

  const removeStaffCourse = (index) => {
    setStaffForm({
      ...staffForm,
      courses: staffForm.courses.filter((_, i) => i !== index),
    });
  };

  const updateStatistic = (field, value) => {
    setStaffForm({
      ...staffForm,
      statistics: {
        ...staffForm.statistics,
        [field]: parseInt(value) || 0,
      },
    });
  };

  // SUBMIT HANDLERS
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/dashboard/student", studentForm);
      console.log("Student content saved:", response.data);
      if (onSave) onSave(response.data.content);
    } catch (err) {
      console.error("Error saving student content:", err);
      setError(err.response?.data?.message || "Failed to save content");
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/dashboard/staff", staffForm);
      console.log("Staff content saved:", response.data);
      if (onSave) onSave(response.data.content);
    } catch (err) {
      console.error("Error saving staff content:", err);
      setError(err.response?.data?.message || "Failed to save content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-dashboard-form">
      <h2>Edit Your Dashboard</h2>

      {error && <div className="error-message">{error}</div>}

      {userRole === "student" ? (
        // STUDENT FORM
        <form onSubmit={handleStudentSubmit}>
          {/* COURSES SECTION */}
          <fieldset>
            <legend>My Courses</legend>
            {studentForm.courses.map((course, idx) => (
              <div key={idx} className="form-group">
                <input
                  type="text"
                  placeholder="Course Name"
                  value={course.name}
                  onChange={(e) => updateStudentCourse(idx, "name", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Course Code"
                  value={course.code}
                  onChange={(e) => updateStudentCourse(idx, "code", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Credits"
                  value={course.credits}
                  onChange={(e) => updateStudentCourse(idx, "credits", parseInt(e.target.value) || 0)}
                  min="0"
                />
                <label>
                  <input
                    type="checkbox"
                    checked={course.completed}
                    onChange={(e) => updateStudentCourse(idx, "completed", e.target.checked)}
                  />
                  Completed
                </label>
                <button type="button" onClick={() => removeStudentCourse(idx)}>
                  Remove Course
                </button>
              </div>
            ))}
            <button type="button" onClick={addStudentCourse}>
              Add Course
            </button>
          </fieldset>

          {/* GRADES SECTION */}
          <fieldset>
            <legend>My Grades</legend>
            {studentForm.grades.map((grade, idx) => (
              <div key={idx} className="form-group">
                <input
                  type="text"
                  placeholder="Course Name"
                  value={grade.courseName}
                  onChange={(e) => updateStudentGrade(idx, "courseName", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Grade (A, B, C, etc.)"
                  value={grade.grade}
                  onChange={(e) => updateStudentGrade(idx, "grade", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Percentage"
                  value={grade.percentage}
                  onChange={(e) => updateStudentGrade(idx, "percentage", e.target.value)}
                  min="0"
                  max="100"
                />
                <button type="button" onClick={() => removeStudentGrade(idx)}>
                  Remove Grade
                </button>
              </div>
            ))}
            <button type="button" onClick={addStudentGrade}>
              Add Grade
            </button>
          </fieldset>

          {/* ASSIGNMENTS SECTION */}
          <fieldset>
            <legend>My Assignments</legend>
            {studentForm.assignments.map((assignment, idx) => (
              <div key={idx} className="form-group">
                <input
                  type="text"
                  placeholder="Assignment Title"
                  value={assignment.title}
                  onChange={(e) => updateStudentAssignment(idx, "title", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Course"
                  value={assignment.course}
                  onChange={(e) => updateStudentAssignment(idx, "course", e.target.value)}
                />
                <input
                  type="date"
                  value={assignment.dueDate}
                  onChange={(e) => updateStudentAssignment(idx, "dueDate", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Grade"
                  value={assignment.grade}
                  onChange={(e) => updateStudentAssignment(idx, "grade", e.target.value)}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={assignment.submitted}
                    onChange={(e) => updateStudentAssignment(idx, "submitted", e.target.checked)}
                  />
                  Submitted
                </label>
                <button type="button" onClick={() => removeStudentAssignment(idx)}>
                  Remove Assignment
                </button>
              </div>
            ))}
            <button type="button" onClick={addStudentAssignment}>
              Add Assignment
            </button>
          </fieldset>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // STAFF FORM
        <form onSubmit={handleStaffSubmit}>
          {/* COURSES SECTION */}
          <fieldset>
            <legend>My Courses</legend>
            {staffForm.courses.map((course, idx) => (
              <div key={idx} className="form-group">
                <input
                  type="text"
                  placeholder="Course Name"
                  value={course.name}
                  onChange={(e) => updateStaffCourse(idx, "name", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Section"
                  value={course.section}
                  onChange={(e) => updateStaffCourse(idx, "section", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Number of Students"
                  value={course.students}
                  onChange={(e) => updateStaffCourse(idx, "students", e.target.value)}
                  min="0"
                />
                <button type="button" onClick={() => removeStaffCourse(idx)}>
                  Remove Course
                </button>
              </div>
            ))}
            <button type="button" onClick={addStaffCourse}>
              Add Course
            </button>
          </fieldset>

          {/* STATISTICS SECTION */}
          <fieldset>
            <legend>My Statistics</legend>
            <div className="form-group">
              <label>
                Active Courses:
                <input
                  type="number"
                  value={staffForm.statistics.activeCourses}
                  onChange={(e) => updateStatistic("activeCourses", e.target.value)}
                  min="0"
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Total Students:
                <input
                  type="number"
                  value={staffForm.statistics.totalStudents}
                  onChange={(e) => updateStatistic("totalStudents", e.target.value)}
                  min="0"
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Average Class Size:
                <input
                  type="number"
                  value={staffForm.statistics.averageClassSize}
                  onChange={(e) => updateStatistic("averageClassSize", e.target.value)}
                  min="0"
                  step="0.1"
                />
              </label>
            </div>
          </fieldset>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditDashboardForm;
