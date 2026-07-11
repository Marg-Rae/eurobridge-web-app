const MOODLE_URL = "https://moodle.eurobridgelanguageinstitute.com";

const features = [
  {
    icon: "🎓",
    title: "Self-Paced Courses",
    description: "Learn at your own speed with structured modules, quizzes, and assignments available 24/7."
  },
  {
    icon: "🎥",
    title: "Video Lessons",
    description: "Recorded lectures and speaking labs you can rewatch as many times as you need."
  },
  {
    icon: "📝",
    title: "Interactive Assessments",
    description: "Graded exercises, timed quizzes, and instant feedback to track real progress."
  },
  {
    icon: "💬",
    title: "Discussion Forums",
    description: "Practice writing and engage with classmates and tutors in moderated language forums."
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    description: "A personal dashboard shows completed lessons, grades, and upcoming deadlines at a glance."
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Access every lesson from your phone or tablet. Learning never stops when you're on the go."
  }
];

const steps = [
  { step: "1", title: "Create Your Account", description: "Register on the Moodle platform using your Eurobridge student email or sign up with a new account." },
  { step: "2", title: "Enroll in a Course", description: "Browse the course catalogue and enroll in the language program that matches your level and goals." },
  { step: "3", title: "Learn & Practice", description: "Work through video lessons, complete exercises, and join live virtual sessions with your tutor." },
  { step: "4", title: "Track Your Progress", description: "Check your grades and completion status from your personal dashboard and earn your certificate." }
];

const Elearning = () => {
  return (
    <section className="page">
      {/* Hero */}
      <div className="elearning-gateway-hero">
        <div className="elearning-gateway-hero-content">
          <span className="elearning-badge">Online Learning Platform</span>
          <h1>Learn Anywhere, Anytime</h1>
          <p className="hero-subtitle">
            Eurobridge's full e-learning experience lives on our dedicated Moodle platform,
            with structured courses, live sessions, and progress tracking all in one place.
          </p>
          <div className="elearning-hero-actions">
            <a
              href={MOODLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button primary btn-lg"
            >
              Go to E-Learning Platform →
            </a>
            <a href="#how-it-works" className="button secondary btn-lg">
              How It Works
            </a>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Features */}
        <section className="academics-section">
          <div className="section-header">
            <h2>Everything You Need to Succeed Online</h2>
            <p>Our Moodle platform is packed with tools built for language learners</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card-academic">
                <div className="feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="academics-section" id="how-it-works">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started on the platform in four simple steps</p>
          </div>
          <div className="elearning-steps">
            {steps.map((s) => (
              <div key={s.step} className="elearning-step">
                <div className="elearning-step-number">{s.step}</div>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="cta-section-academic">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>
              Head over to our Moodle platform, create your account, and begin your
              language journey today, available 24/7 from any device.
            </p>
            <div className="cta-buttons">
              <a
                href={MOODLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button primary btn-lg"
              >
                Launch E-Learning Platform
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Elearning;
