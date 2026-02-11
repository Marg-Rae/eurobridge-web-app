import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Home = () => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") || "");
  const [apiState, setApiState] = useState({
    loading: false,
    error: "",
    action: "",
    data: null
  });

  const setToken = (token) => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  };

  const formatResponse = (data) => {
    if (Array.isArray(data)) {
      return {
        count: data.length,
        preview: data.slice(0, 2)
      };
    }

    return data;
  };

  const runApiAction = async (label, handler, onSuccess) => {
    setApiState({ loading: true, error: "", action: label, data: null });

    try {
      const result = await handler();
      if (onSuccess) {
        onSuccess(result);
      }
      setApiState({ loading: false, error: "", action: label, data: formatResponse(result) });
    } catch (error) {
      setApiState({
        loading: false,
        error: "Unable to reach the backend right now.",
        action: label,
        data: null
      });
    }
  };

  const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};

  const demoContactPayload = {
    name: "Demo Learner",
    email: "demo@eurobridge.com",
    phone: "+254700000000",
    message: "Demo submission from the frontend API console."
  };

  const demoUserPayload = {
    name: "Demo User",
    email: "demo.user@eurobridge.com",
    password: "DemoPass123!"
  };

  const demoCoursePayload = {
    title: "Business English Sprint",
    level: "Intermediate",
    duration: "6 weeks",
    price: "KES 18,000",
    description: "Fast-track speaking, email, and presentation fluency.",
    imageUrl: ""
  };

  const demoBlogPayload = {
    title: "How to Build Language Momentum",
    slug: `language-momentum-${Date.now()}`,
    excerpt: "Build daily routines that compound into real fluency gains.",
    content: "Short daily rituals, feedback loops, and confidence wins matter more than cramming."
  };

  const fetchCourses = () => api.get("/api/courses").then((response) => response.data);
  const fetchBlogs = () => api.get("/api/blogs").then((response) => response.data);
  const createContact = () =>
    api.post("/api/contact", demoContactPayload).then((response) => response.data);
  const registerUser = () =>
    api.post("/api/auth/register", demoUserPayload).then((response) => response.data);
  const loginUser = () =>
    api
      .post("/api/auth/login", {
        email: demoUserPayload.email,
        password: demoUserPayload.password
      })
      .then((response) => response.data);
  const logoutUser = () =>
    api.post("/api/auth/logout").then((response) => response.data);

  const createCourse = () =>
    api.post("/api/courses", demoCoursePayload, { headers: authHeaders }).then((response) => response.data);
  const createBlog = () =>
    api.post("/api/blogs", demoBlogPayload, { headers: authHeaders }).then((response) => response.data);

  const updateFirstCourse = async () => {
    const courses = await fetchCourses();
    if (!courses.length) {
      return { message: "No courses available to update." };
    }
    const target = courses[0];
    const response = await api.put(
      `/api/courses/${target._id}`,
      { title: `${target.title} (Updated)` },
      { headers: authHeaders }
    );
    return response.data;
  };

  const deleteFirstCourse = async () => {
    const courses = await fetchCourses();
    if (!courses.length) {
      return { message: "No courses available to delete." };
    }
    const target = courses[0];
    const response = await api.delete(`/api/courses/${target._id}`, { headers: authHeaders });
    return response.data;
  };

  const updateFirstBlog = async () => {
    const blogs = await fetchBlogs();
    if (!blogs.length) {
      return { message: "No blog posts available to update." };
    }
    const target = blogs[0];
    const response = await api.put(
      `/api/blogs/${target._id}`,
      { title: `${target.title} (Updated)` },
      { headers: authHeaders }
    );
    return response.data;
  };

  const deleteFirstBlog = async () => {
    const blogs = await fetchBlogs();
    if (!blogs.length) {
      return { message: "No blog posts available to delete." };
    }
    const target = blogs[0];
    const response = await api.delete(`/api/blogs/${target._id}`, { headers: authHeaders });
    return response.data;
  };

  return (
    <div className="page">
      <section className="hero-banner">
        <div className="hero-media">
          <video
            className="hero-video"
            src="/media/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="hero-overlay" />
          <div className="hero-keywords">
            <span>English</span>
            <span>German</span>
            <span>Chinese</span>
            <span>French</span>
            <span>Swahili</span>
            <span>Kalenjin</span>
          </div>
        </div>
        <div className="hero-content">
          <p className="eyebrow">Eurobridge Language Institute</p>
          <h1>Words that open doors.</h1>
          <p className="lead">
            High-touch language coaching for professionals, students, and global
            teams who need confidence, clarity, and real-world fluency.
          </p>
          <div className="actions">
            <Link to="/courses" className="button primary">
              Explore Programs
            </Link>
            <Link to="/contact" className="button ghost">
              Book a Consultation
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>98%</strong>
              <span>Completion rate</span>
            </div>
            <div>
              <strong>6</strong>
              <span>Core languages</span>
            </div>
            <div>
              <strong>1:1</strong>
              <span>Coaching focus</span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel-section api-console" id="api-console">
        <div className="section-header">
          <h2>Backend action console</h2>
          <p>
            Run live requests against the API. Auth buttons use real JWT auth,
            and CRUD actions are protected by the token.
          </p>
        </div>
        <div className="api-grid">
          <div className="api-actions">
            <div className="api-group">
              <h3>Auth (demo)</h3>
              <div className="actions">
                <button
                  type="button"
                  className="button primary"
                  onClick={() =>
                    runApiAction("Sign in", loginUser, (result) => setToken(result.token || ""))
                  }
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() =>
                    runApiAction("Register", registerUser, (result) => setToken(result.token || ""))
                  }
                >
                  Register
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() =>
                    runApiAction("Sign out", logoutUser, () => setToken(""))
                  }
                >
                  Sign out
                </button>
              </div>
              <p className="api-note">
                Token status: {authToken ? "Authenticated" : "Not signed in"}
              </p>
            </div>
            <div className="api-group">
              <h3>CRUD actions</h3>
              <div className="actions">
                <button
                  type="button"
                  className="button primary"
                  onClick={() => runApiAction("Read courses", fetchCourses)}
                >
                  Read courses
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => runApiAction("Create course", createCourse)}
                >
                  Create course
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => runApiAction("Update course", updateFirstCourse)}
                >
                  Update course
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => runApiAction("Delete course", deleteFirstCourse)}
                >
                  Delete course
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => runApiAction("Read blogs", fetchBlogs)}
                >
                  Read blogs
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => runApiAction("Create blog", createBlog)}
                >
                  Create blog
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => runApiAction("Update blog", updateFirstBlog)}
                >
                  Update blog
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => runApiAction("Delete blog", deleteFirstBlog)}
                >
                  Delete blog
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => runApiAction("Create contact", createContact)}
                >
                  Create contact
                </button>
              </div>
            </div>
          </div>
          <div className="api-output">
            <div className="api-output-header">
              <span>Last action</span>
              <strong>{apiState.action || "No requests yet"}</strong>
            </div>
            {apiState.loading && <Loading label="Running" />}
            {apiState.error && <ErrorMessage message={apiState.error} />}
            {apiState.data && (
              <pre className="code-block">
                {JSON.stringify(apiState.data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </section>

      <section className="panel-section">
        <div className="section-header">
          <h2>Signature Language Tracks</h2>
          <p>
            English, German, Chinese, French, Swahili, and Kalenjin programs
            designed around your goals and schedule.
          </p>
        </div>
        <div className="card-grid">
          {[
            "Business English & IELTS",
            "German A1-A2 Foundations",
            "French for Professionals",
            "Conversational Swahili",
            "Chinese for Global Trade",
            "Kalenjin Cultural Fluency"
          ].map((title) => (
            <article key={title} className="card hover-shift">
              <h3>{title}</h3>
              <p>
                Tailored curriculum, weekly assessments, and real-life
                simulations led by certified mentors.
              </p>
              <span className="pill">New intake every month</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-section dark-panel">
        <div className="section-header">
          <h2>Why leaders choose Eurobridge</h2>
          <p>
            We blend immersive practice, cultural coaching, and performance
            tracking to move you from classroom theory to confident action.
          </p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Executive Coaching</h3>
            <p>Private sessions for executives, diplomats, and global teams.</p>
          </div>
          <div className="feature-card">
            <h3>Placement Precision</h3>
            <p>Smart diagnostics match you to the right level from day one.</p>
          </div>
          <div className="feature-card">
            <h3>Measured Outcomes</h3>
            <p>Weekly progress reports and practical performance benchmarks.</p>
          </div>
        </div>
      </section>

      <section className="panel-section">
        <div className="cta-panel">
          <div>
            <h2>Ready to unlock global opportunity?</h2>
            <p>
              Meet our advisors in Eldoret or connect online to map your custom
              language journey.
            </p>
          </div>
          <Link to="/contact" className="button primary">
            Speak with an Advisor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
