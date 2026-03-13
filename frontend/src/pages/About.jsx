import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const About = () => {
  const [currentTeamMember, setCurrentTeamMember] = useState(0);

  const teamMembers = [
    {
      name: "Chepkoech K.",
      role: "Web & Digital Operations Manager",
      image: "/media/chepkoech-k.jpg"
    },
    {
      name: "Bond N.",
      role: "Digital Marketing Assistant",
      image: "/media/bond-n.jpg"
    },
    {
      name: "Kamala R.",
      role: "Front Desk Assistant",
      image: "/media/kamala-r.png"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTeamMember((prev) => (prev + 1) % teamMembers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [teamMembers.length]);

  const nextTeamMember = () => {
    setCurrentTeamMember((prev) => (prev + 1) % teamMembers.length);
  };

  const prevTeamMember = () => {
    setCurrentTeamMember((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  return (
    <section className="page">
      <div className="about-hero">
        <div className="about-hero-media">
          <img src="/media/about-hero-new.jpg" alt="Eurobridge learners in class" />
          <div className="about-hero-overlay">
            <p className="eyebrow">About Eurobridge</p>
            <h1>Language mastery with culture, clarity, and confidence.</h1>
            <p className="lead">
              Based in Eldoret, we deliver high-touch coaching in English,
              German, Chinese, French, Swahili, and Kalenjin for learners who
              need real results for work, study, and global connection.
            </p>
          </div>
        </div>
        <div className="about-hero-card">
          <h3>Our Promise</h3>
          <p>
            Words that open doors, guided by mentors who track your progress and
            celebrate every milestone.
          </p>
          <div className="value-pill">Personalized placement in 48 hours</div>
        </div>
      </div>

      <div className="about-grid">
        <article className="about-card">
          <h3>Expert Mentors</h3>
          <p>Certified tutors deliver structured pathways and clear feedback.</p>
        </article>
        <article className="about-card">
          <h3>Flexible Formats</h3>
          <p>Choose in-person, hybrid, or online sessions that fit your life.</p>
        </article>
        <article className="about-card">
          <h3>Career Focus</h3>
          <p>Build language skills that translate into workplace confidence.</p>
        </article>
        <article className="about-card">
          <h3>Culture First</h3>
          <p>Learn the context behind the words, from etiquette to expression.</p>
        </article>
      </div>

      <section className="cta-panel">
        <div>
          <h2>Ready to Master Languages?</h2>
          <p>Join our community of confident global communicators. Take the first step toward language mastery today.</p>
        </div>
        <Link to="/school-portal" className="button primary">Join Us</Link>
      </section>

      <section className="panel-section">
        <div className="section-header">
          <h2>Vision, mission, values</h2>
          <p>The principles guiding every learner experience at Eurobridge.</p>
        </div>
        <div className="mission-grid">
          <article className="mission-card">
            <h3>Vision</h3>
            <p>To build confident global communicators who lead with language and culture.</p>
          </article>
          <article className="mission-card">
            <h3>Mission</h3>
            <p>
              Deliver measurable language mastery through personalized coaching,
              practical immersion, and continuous progress tracking.
            </p>
          </article>
          <article className="mission-card">
            <h3>Values</h3>
            <p>
              Empathy, accountability, and excellence in every class, with
              community-driven support.
            </p>
          </article>
        </div>
      </section>

      <div className="color-band">
        <div>
          <h2>How we teach</h2>
          <p>
            Each track blends speaking labs, cultural immersion, and progress
            diagnostics with measurable outcomes.
          </p>
        </div>
        <div className="color-band-list">
          <div>
            <strong>Step 1</strong>
            <span>Diagnostic + placement</span>
          </div>
          <div>
            <strong>Step 2</strong>
            <span>Live coaching + labs</span>
          </div>
          <div>
            <strong>Step 3</strong>
            <span>Weekly progress snapshots</span>
          </div>
        </div>
      </div>

      <section className="panel-section">
        <div className="section-header">
          <h2>Meet our team</h2>
          <p>Dedicated mentors and leaders guiding every learning journey.</p>
        </div>
        <div className="team-carousel">
          <button
            className="carousel-nav prev"
            onClick={prevTeamMember}
            aria-label="Previous team member"
          >
            ‹
          </button>

          <div className="team-slides">
            {teamMembers.map((member, index) => (
              <article
                key={member.name}
                className={`team-card ${index === currentTeamMember ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - currentTeamMember) * 100}%)`,
                  opacity: index === currentTeamMember ? 1 : 0,
                  transition: 'all 0.5s ease-in-out'
                }}
              >
                <img src={member.image} alt={member.name} />
                <div>
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                </div>
              </article>
            ))}
          </div>

          <button
            className="carousel-nav next"
            onClick={nextTeamMember}
            aria-label="Next team member"
          >
            ›
          </button>

          <div className="carousel-dots">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentTeamMember ? 'active' : ''}`}
                onClick={() => setCurrentTeamMember(index)}
                aria-label={`Go to team member ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="panel-section" id="contact-us">
        <div className="section-header">
          <h2>Contact us</h2>
          <p>Talk to admissions or schedule a placement assessment.</p>
        </div>
        <div className="contact-panel">
          <div>
            <p>Email: info@eurobridgelanguageinstitute.com</p>
            <p>Phone/WhatsApp: +254722108799</p>
            <p>
              Location: Second Floor, Champion Heights Building, Behind Comfy
              Hotel, Eldoret (K)
            </p>
            <p>Hours: Mon-Sat 8:00am - 7:00pm</p>
          </div>
          <a className="button primary" href="mailto:info@eurobridgelanguageinstitute.com">
            Email admissions
          </a>
        </div>
      </section>
    </section>
  );
};

export default About;
