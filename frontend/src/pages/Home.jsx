import { Link } from "react-router-dom";

const Home = () => {
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
