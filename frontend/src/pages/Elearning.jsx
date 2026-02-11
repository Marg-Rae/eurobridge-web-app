import { Link } from "react-router-dom";

const Elearning = () => {
  return (
    <section className="page">
      <div className="section-header">
        <h1>eLearning</h1>
        <p>Flexible online lessons, live coaching, and self-paced practice.</p>
      </div>
      <section className="panel-section">
        <div className="elearning-hero">
          <div>
            <h2>Learn anywhere with guided support</h2>
            <p>
              Join live virtual classes, access weekly learning plans, and track
              your progress through interactive assignments and mentor feedback.
            </p>
            <div className="actions">
              <Link to="/portal" className="button primary">
                Start learning
              </Link>
              <Link to="/about" className="button ghost">
                View programs
              </Link>
            </div>
          </div>
          <div className="elearning-card">
            <h3>What you get</h3>
            <ul>
              <li>Live coaching labs and speaking practice</li>
              <li>Weekly assessments and feedback</li>
              <li>On-demand lesson recordings</li>
              <li>Dedicated student success support</li>
            </ul>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Elearning;
