import { Link } from "react-router-dom";

const Academics = () => {
  const courses = [
    {
      title: "Business English & IELTS",
      description: "Executive communication, interview readiness, and exam coaching.",
      meta: "Intakes monthly"
    },
    {
      title: "German A1-A2 Foundations",
      description: "Grammar, speaking labs, and exam-aligned practice sessions.",
      meta: "Live + online"
    },
    {
      title: "French for Professionals",
      description: "Workplace fluency, cultural etiquette, and negotiation skills.",
      meta: "Flexible formats"
    },
    {
      title: "Conversational Swahili",
      description: "Everyday confidence for travel, work, and community integration.",
      meta: "Small cohorts"
    },
    {
      title: "Chinese for Global Trade",
      description: "Market vocabulary, deal making, and cross-cultural strategy.",
      meta: "Business focus"
    },
    {
      title: "Kalenjin Cultural Fluency",
      description: "Language + culture immersion for meaningful local engagement.",
      meta: "Cultural labs"
    }
  ];

  return (
    <section className="page">
      <div className="academics-hero">
        <div>
          <p className="eyebrow">Academics</p>
          <h1>Structured language pathways with measurable outcomes.</h1>
          <p className="lead">
            Explore our curriculum designed for career progress, exam success, and
            confident global communication.
          </p>
        </div>
        <div className="academics-hero-card">
          <h3>Academic Calendar</h3>
          <p>New cohorts start every month with placement assessments every week.</p>
          <div className="value-pill">Placement in 48 hours</div>
        </div>
      </div>

      <section className="panel-section application-panel">
        <div>
          <div className="section-header">
            <h2>Application procedure</h2>
            <p>Apply in minutes and get matched to the right level.</p>
          </div>
          <ol className="application-steps">
            <li>Complete the online application form.</li>
            <li>Book a placement assessment with our admissions team.</li>
            <li>Receive your learning plan, schedule, and fee guidance.</li>
            <li>Confirm enrollment and join your cohort.</li>
          </ol>
        </div>
        <div className="application-card">
          <h3>Apply online</h3>
          <p>
            Submit your details and we will reach out within 24 hours to confirm
            your placement assessment.
          </p>
          <Link to="/portal" className="button primary">
            Apply online
          </Link>
        </div>
      </section>

      <section className="panel-section">
        <div className="section-header">
          <h2>Academics & courses</h2>
          <p>Choose a track tailored to your goals and timeline.</p>
        </div>
        <div className="card-grid">
          {courses.map((course) => (
            <article key={course.title} className="card hover-shift">
              <div className="card-header">
                <h3>{course.title}</h3>
                <span className="pill">{course.meta}</span>
              </div>
              <p>{course.description}</p>
              <div className="card-meta">
                <span>Weekly labs</span>
                <span>Mentor feedback</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Academics;
