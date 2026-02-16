import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
            poster="/media/hero-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
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

      <section className="panel-section flashy-announcement-section">
        <div className="section-header">
          <h2 className="flashy-title">
            <span className="announcement-badge">HOT</span> Announcements &amp; News
          </h2>
          <p>Latest updates, partnerships, and program opportunities.</p>
        </div>
        <div className="announcements-grid flashy-grid">
          <article className="announcement-card flashy-card">
            <div className="flashy-border-animation"></div>
            <img
              className="announcement-media"
              src="/media/announcement-partnership.jpg"
              alt="Partnership announcement handshake"
            />
            <div className="announcement-meta">
              <span className="announcement-date pulse-animation">Feb 11, 2026</span>
              <span className="announcement-tag glow-effect">Partnership</span>
            </div>
            <h3 className="announcement-title-flashy">
              🤝 PARTNERSHIP ANNOUNCEMENT | EMPOWERING YOUTH THROUGH SKILLS &amp; LANGUAGE 🇰🇪🇨🇳
            </h3>
            <p className="announcement-highlight">
              Strategic partnership to build skills and Chinese language fluency
              for workplace integration and career growth.
            </p>
            <details className="announcement-details">
              <summary className="flashy-summary">📖 Read full announcement</summary>
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
        <div className="testimonial-carousel">
          <button
            className="carousel-nav prev"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            ‹
          </button>
          <div className="testimonial-slides">
            {testimonials.map((item, index) => (
              <article
                key={item.name}
                className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - currentTestimonial) * 100}%)`,
                  opacity: index === currentTestimonial ? 1 : 0,
                  transition: 'all 0.5s ease-in-out'
                }}
              >
                <img className="testimonial-avatar" src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <span className="testimonial-role">{item.role}</span>
                <p>{item.quote}</p>
              </article>
            ))}
          </div>
          <button
            className="carousel-nav next"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            ›
          </button>
          <div className="carousel-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="panel-section lead-magnet-section">
        <div className="section-header">
          <h2>Start Your Language Journey Today</h2>
          <p>Get exclusive resources and offers to kickstart your learning</p>
        </div>
        <div className="lead-magnet-grid">
          <div className="lead-magnet-card">
            <div className="magnet-icon">📚</div>
            <h3>Free Language Guide</h3>
            <p>Download our comprehensive beginner's guide to learning German or Chinese. Includes essential phrases, cultural tips, and study strategies.</p>
            <Link to="/about#contact-us" className="button primary">
              Download Free Guide
            </Link>
          </div>
          <div className="lead-magnet-card highlighted">
            <div className="magnet-badge">POPULAR</div>
            <div className="magnet-icon">🎯</div>
            <h3>Free Trial Class</h3>
            <p>Experience our teaching method firsthand. Join a 60-minute trial class in German, Chinese, or English with no commitment required.</p>
            <Link to="/about#contact-us" className="button secondary">
              Book Your Free Trial
            </Link>
          </div>
          <div className="lead-magnet-card">
            <div className="magnet-icon">📊</div>
            <h3>Free Language Assessment</h3>
            <p>Not sure which level to start at? Take our professional language assessment test and get personalized course recommendations.</p>
            <Link to="/about#contact-us" className="button primary">
              Take Assessment
            </Link>
          </div>
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
            {
              title: "Business English & IELTS",
              description: "Interview practice, workplace writing drills, and fluency coaching tied to your goals."
            },
            {
              title: "German A1-A2 Foundations",
              description: "Fast-start grammar bootcamps, speaking labs, and Goethe-style exam prep."
            },
            {
              title: "French for Professionals",
              description: "Client-ready vocabulary, meeting simulations, and cultural etiquette mastery."
            },
            {
              title: "Conversational Swahili",
              description: "Community immersion, everyday role-play, and confident pronunciation coaching."
            },
            {
              title: "Chinese for Global Trade",
              description: "Business negotiation scenarios, tone accuracy training, and trade vocabulary drills."
            },
            {
              title: "Kalenjin Cultural Fluency",
              description: "Heritage storytelling, listening comprehension, and community engagement sessions."
            }
          ].map((track) => (
            <article key={track.title} className="card hover-shift">
              <h3>{track.title}</h3>
              <p>{track.description}</p>
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
            {
              title: "Diagnostic assessment and placement",
              description: "We map your baseline, set targets, and place you in the right cohort from day one."
            },
            {
              title: "Weekly coaching sprints",
              description: "Short, focused goals with coach check-ins to keep momentum high."
            },
            {
              title: "Live speaking labs",
              description: "Real-time practice with guided corrections to build confident delivery."
            },
            {
              title: "Cultural fluency workshops",
              description: "Context, etiquette, and social nuance so your language feels natural."
            },
            {
              title: "Progress dashboards",
              description: "Transparent tracking so you can see growth in every skill area."
            },
            {
              title: "Career-ready practice",
              description: "Role-play interviews, presentations, and workplace conversations."
            }
          ].map((step) => (
            <article key={step.title} className="card hover-shift">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
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
