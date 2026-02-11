const About = () => {
  return (
    <section className="page">
      <div className="about-hero">
        <div>
          <p className="eyebrow">About Eurobridge</p>
          <h1>Language mastery with culture, clarity, and confidence.</h1>
          <p className="lead">
            Based in Eldoret, we deliver high-touch coaching in English, German,
            Chinese, French, Swahili, and Kalenjin for learners who need real
            results for work, study, and global connection.
          </p>
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
        <div className="team-grid">
          {[
            {
              name: "Dr. Esther K.",
              role: "Director",
              image: "/media/director.jpg"
            },
            {
              name: "David M.",
              role: "Lead Tutor",
              image: "/media/lead-tutor.jpg"
            },
            {
              name: "Joyce A.",
              role: "Student Success Tutor",
              image: "/media/student-success-tutor.jpg"
            }
          ].map((member) => (
            <article key={member.name} className="team-card">
              <img src={member.image} alt={member.name} />
              <div>
                <h3>{member.name}</h3>
                <span>{member.role}</span>
              </div>
            </article>
          ))}
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
