import { Link } from "react-router-dom";

const Home = () => {
  const testimonials = [
    {
      name: "Lynn K.",
      role: "Business English graduate",
      quote: "My client calls are smoother and I finally speak without second-guessing.",
      image: "/media/student-lynn-k.jpg"
    },
    {
      name: "Samuel O.",
      role: "German A2 learner",
      quote: "The coaching labs gave me the confidence to pass my Goethe exam.",
      image: "/media/student-samuel-o.jpg"
    },
    {
      name: "Aisha M.",
      role: "IELTS achiever",
      quote: "Weekly feedback kept me focused, and I hit my target score in one cycle.",
      image: "/media/student-aisha-m.jpg"
    }
  ];

  const courses = [
    {
      title: "Chinese for Global Trade",
      description: "Negotiation language, cross-cultural etiquette, and real-world scenarios.",
      image: "/media/chinese-global-trade.jpg"
    },
    {
      title: "English for Leadership",
      description: "Presentation coaching, email polish, and executive presence.",
      image: "/media/english-leadership.jpg"
    },
    {
      title: "Community Language Labs",
      description: "Conversation circles and cultural fluency workshops.",
      image: "/media/community-labs.jpg"
    }
  ];

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
      </section>

      <section className="panel-section">
        <div className="section-header">
          <h2>Announcements &amp; News</h2>
          <p>Latest updates, partnerships, and program opportunities.</p>
        </div>
        <div className="announcements-grid">
          <article className="announcement-card">
            <img
              className="announcement-media"
              src="/media/announcement-partnership.jpg"
              alt="Partnership announcement handshake"
            />
            <div className="announcement-meta">
              <span className="announcement-date">Feb 11, 2026</span>
              <span className="announcement-tag">Partnership</span>
            </div>
            <h3>
              🤝 PARTNERSHIP ANNOUNCEMENT | EMPOWERING YOUTH THROUGH SKILLS &amp; LANGUAGE 🇰🇪🇨🇳
            </h3>
            <p>
              Strategic partnership to build skills and Chinese language fluency
              for workplace integration and career growth.
            </p>
            <details className="announcement-details">
              <summary>Read full announcement</summary>
              <p>
                We are excited to announce a strategic partnership between Teso
                North Constituency, Fullcare, and Eurobridge Language Institute
                aimed at enhancing skills development and creating employment
                opportunities within local Chinese companies operating in Kenya.
                This collaboration seeks to equip interested candidates with Basic
                Chinese Language proficiency (HSK 1) — a key requirement for
                effective communication and workplace integration in Chinese-led
                organizations. Opportunities are available for professionals and
                skilled individuals in areas such as Fashion &amp; Design, Electricians,
                Plumbers, IT Professionals, Human Resource Personnel, Plant
                Operators, Technicians, and semi-skilled/unskilled sectors. By
                combining technical skills with basic Chinese language training,
                this initiative will increase employability, enhance workplace
                efficiency, and open doors to sustainable career growth.
                Registration is ongoing. Together, we build capacity. Together,
                we create opportunities.
              </p>
            </details>
          </article>
        </div>
      </section>

      <section className="panel-section">
        <div className="section-header">
          <h2>What our students &amp; alumni say</h2>
          <p>Real stories from learners who built fluency with Eurobridge.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonial-card">
              <img className="testimonial-avatar" src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <span className="testimonial-role">{item.role}</span>
              <p>{item.quote}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <div className="section-header">
          <h2>Courses overview</h2>
          <p>Sliding highlights from our flagship language tracks.</p>
        </div>
        <div className="courses-slider">
          <div className="slider-track">
            {[...courses, ...courses].map((course, index) => (
              <article key={`${course.title}-${index}`} className="course-slide">
                <img src={course.image} alt={course.title} />
                <div className="course-overlay">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              </article>
            ))}
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

      <section className="panel-section">
        <div className="section-header">
          <h2>How your journey unfolds</h2>
          <p>
            A guided roadmap designed to build confidence quickly and sustain
            progress long after the first session.
          </p>
        </div>
        <div className="card-grid">
          {[
            "Diagnostic assessment and placement",
            "Weekly coaching sprints",
            "Live speaking labs",
            "Cultural fluency workshops",
            "Progress dashboards",
            "Career-ready practice"
          ].map((title) => (
            <article key={title} className="card hover-shift">
              <h3>{title}</h3>
              <p>
                Focused milestones and feedback loops that keep you moving with
                clarity.
              </p>
              <span className="pill">Included</span>
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
          <Link to="/about#contact-us" className="button primary">
            Speak with an Advisor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
