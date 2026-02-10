import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="page hero">
      <div>
        <p className="eyebrow">Language Institute</p>
        <h1>Build confidence in every conversation.</h1>
        <p className="lead">
          Eurobridge helps students and professionals master new languages with
          immersive, goal-driven programs.
        </p>
        <div className="actions">
          <Link to="/courses" className="button primary">
            Explore Courses
          </Link>
          <Link to="/contact" className="button ghost">
            Book a Consultation
          </Link>
        </div>
      </div>
      <div className="hero-card">
        <h2>Upcoming Intakes</h2>
        <ul>
          <li>Intensive English - March 18</li>
          <li>Business French - April 7</li>
          <li>German A1 Foundations - April 22</li>
        </ul>
      </div>
    </section>
  );
};

export default Home;
