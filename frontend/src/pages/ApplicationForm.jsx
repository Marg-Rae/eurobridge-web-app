import { useState } from "react";
import api from "../api/axios.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import "../styles/application-form.css";

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    currentLevel: "beginner",
    preferredCourse: "",
    motivation: "",
    experience: "",
    availability: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    agreeToTerms: false
  });

  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [submitted, setSubmitted] = useState(false);

  const courses = [
    "Chinese",
    "German",
    "French",
    "English",
    "Swahili",
    "Kalenjin"
  ];

  const levels = ["Beginner", "Elementary", "Intermediate", "Upper-Intermediate", "Advanced"];
  const availability = ["Full-time", "Part-time", "Weekends Only", "Flexible"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.preferredCourse || !formData.agreeToTerms) {
        throw new Error("Please fill in all required fields");
      }

      // Submit to backend
      const response = await api.post("/api/applications", formData);

      if (response.status === 201 || response.status === 200) {
        setStatus({
          loading: false,
          error: "",
          success: "Application submitted successfully! We'll contact you soon."
        });
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            currentLevel: "beginner",
            preferredCourse: "",
            motivation: "",
            experience: "",
            parentName: "",
            parentEmail: "",
            parentPhone: "",
            availability: "",
            agreeToTerms: false
          });
          setSubmitted(false);
        }, 3000);
      }
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.message || err.message || "Failed to submit application",
        success: ""
      });
    }
  };

  if (submitted && status.success) {
    return (
      <div className="page">
        <section className="form-section">
          <div className="form-container">
            <div className="success-message">
              <h2>✓ Application Submitted</h2>
              <p>{status.success}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h1>Application Form</h1>
            <p className="form-description">Fill out the form below to apply for your preferred course at Eurobridge.</p>
          </div>

          {status.error && <ErrorMessage message={status.error} />}

          <form onSubmit={handleSubmit} className="application-form">
            {/* Student Information */}
            <fieldset className="form-fieldset">
              <legend>Student Information</legend>

              <div className="form-group">
                <label htmlFor="fullName">Student Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Student's full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Student Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="student.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Student Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 7XX XXX XXX"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </fieldset>

            {/* Parent/Guardian Information */}
            <fieldset className="form-fieldset">
              <legend>Parent/Guardian Information</legend>

              <div className="form-group">
                <label htmlFor="parentName">Parent/Guardian Full Name</label>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  placeholder="Parent/Guardian's full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="parentEmail">Parent/Guardian Email Address</label>
                <input
                  type="email"
                  id="parentEmail"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  placeholder="parent.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="parentPhone">Parent/Guardian Phone Number</label>
                <input
                  type="tel"
                  id="parentPhone"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
            </fieldset>

            {/* Course Information */}
            <fieldset className="form-fieldset">
              <legend>Course Information</legend>

              <div className="form-group">
                <label htmlFor="preferredCourse">Preferred Course *</label>
                <select
                  id="preferredCourse"
                  name="preferredCourse"
                  value={formData.preferredCourse}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select a course --</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="currentLevel">Current Language Level</label>
                <select
                  id="currentLevel"
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleChange}
                >
                  {levels.map(level => (
                    <option key={level} value={level.toLowerCase()}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="availability">Preferred Availability</label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="">-- Select availability --</option>
                  {availability.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </fieldset>

            {/* Additional Information */}
            <fieldset className="form-fieldset">
              <legend>Additional Information</legend>

              <div className="form-group">
                <label htmlFor="experience">Previous Language Learning Experience</label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Tell us about your language learning background..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="motivation">What motivates you to learn with Eurobridge?</label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  placeholder="Share your goals and what you hope to achieve..."
                  rows="4"
                />
              </div>
            </fieldset>

            {/* Agreement */}
            <fieldset className="form-fieldset">
              <legend>Agreement</legend>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreeToTerms">
                  I agree to the terms and conditions and understand that my data will be used to process my application *
                </label>
              </div>
            </fieldset>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={status.loading}
                className="button primary submit-btn"
              >
                {status.loading ? "Submitting..." : "Submit Application"}
              </button>
              {status.loading && <Loading />}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ApplicationForm;
