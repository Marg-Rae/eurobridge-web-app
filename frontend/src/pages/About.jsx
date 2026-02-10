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
    </section>
  );
};

export default About;
