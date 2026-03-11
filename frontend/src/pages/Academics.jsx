import { Link } from "react-router-dom";

const Academics = () => {
  const programs = [
    {
      name: "German Language",
      level: "A1-C2",
      description: "From beginner to advanced proficiency with Goethe-Institut exam preparation",
      features: ["6-level framework (A1-C2)", "Goethe certification prep", "Business German modules", "Intensive bootcamps"],
      duration: "3-12 months",
      icon: "🇩🇪"
    },
    {
      name: "Mandarin Chinese",
      level: "HSK 1-6",
      description: "Master Mandarin Chinese with our comprehensive HSK curriculum",
      features: ["HSK 1-6 pathway", "Tone & pronunciation accuracy", "Business negotiation scenarios", "Cultural immersion"],
      duration: "4-16 months",
      icon: "🇨🇳"
    },
    {
      name: "English Proficiency",
      level: "Elementary-Advanced",
      description: "IELTS, TOEFL, and general English for professional growth",
      features: ["IELTS & TOEFL prep", "Business English", "Academic writing", "Interview coaching"],
      duration: "2-10 months",
      icon: "🇬🇧"
    },
    {
      name: "French Language",
      level: "A1-C2",
      description: "Professional and conversational French with DELF/DALF certification",
      features: ["A1-C2 progression", "DELF/DALF exams", "Professional communication", "Cultural workshops"],
      duration: "3-12 months",
      icon: "🇫🇷"
    },
    {
      name: "Swahili Language",
      level: "Beginner-Advanced",
      description: "East Africa's lingua franca for business and community integration",
      features: ["Conversational fluency", "Business Swahili", "Regional dialects", "Community immersion"],
      duration: "2-8 months",
      icon: "🇰🇪"
    },
    {
      name: "Kalenjin Language",
      level: "Beginner-Conversational",
      description: "Heritage language preservation with cultural storytelling and community engagement",
      features: ["Conversational skills", "Traditional narratives", "Cultural protocols", "Community projects"],
      duration: "2-6 months",
      icon: "🏛️"
    }
  ];

  const features = [
    {
      title: "Experienced Facilitators",
      description: "Native speakers with 5+ years teaching experience",
      icon: "👨‍🏫"
    },
    {
      title: "Flexible Scheduling",
      description: "Evening, weekend, and intensive classes available",
      icon: "📅"
    },
    {
      title: "Interactive Learning",
      description: "Role-plays, group discussions, and real-world scenarios",
      icon: "🎯"
    },
    {
      title: "Certified Programs",
      description: "Internationally recognized certifications and credentials",
      icon: "🏆"
    },
    {
      title: "Small Class Sizes",
      description: "Maximum 12 students for personalized attention",
      icon: "👥"
    },
    {
      title: "Career Support",
      description: "Job placement assistance and professional networking",
      icon: "💼"
    }
  ];

  return (
    <section className="page">
      {/* Hero Section */}
      <div className="academics-hero">
        <div>
          <h1>Academic Programs</h1>
          <p className="hero-subtitle">Comprehensive language courses designed for all proficiency levels and life goals</p>
        </div>
        <div className="academics-hero-media">
          <img
            src="/media/academics-hero-new.jpg"
            alt="Eurobridge classroom learning session"
          />
        </div>
      </div>

      <div className="content-wrapper">
        {/* Featured Programs Section */}
        <section className="academics-section">
          <div className="section-header">
            <h2>Our Language Programs</h2>
            <p>Six comprehensive pathways to fluency with professional certification</p>
          </div>

          <div className="programs-grid">
            {programs.map((program, index) => (
              <div key={index} className="program-card-enhanced">
                <div className="program-icon">{program.icon}</div>
                <h3>{program.name}</h3>
                <span className="program-level">CEFR Level: {program.level}</span>
                <p className="program-description">{program.description}</p>
                
                <div className="program-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {program.features.map((feature, i) => (
                      <li key={i}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="program-meta">
                  <span className="program-duration">⏱️ {program.duration}</span>
                </div>

                <Link to={`/school-portal?lang=${program.name.toLowerCase()}`} className="button primary btn-block">
                  Explore Course
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Eurobridge */}
        <section className="academics-section why-choose">
          <div className="section-header">
            <h2>Why Choose Eurobridge?</h2>
            <p>Industry-leading methodology and proven results</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card-academic">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Methodology */}
        <section className="academics-section methodology">
          <div className="section-header">
            <h2>Our Teaching Methodology</h2>
            <p>Proven approaches that accelerate language acquisition</p>
          </div>

          <div className="methodology-grid">
            <div className="methodology-card">
              <h4>Communicative Approach</h4>
              <p>Focus on real-world conversation and practical language use from day one</p>
            </div>

            <div className="methodology-card">
              <h4>Immersive Environment</h4>
              <p>Cultural context, native-speaker interactions, and authentic materials</p>
            </div>

            <div className="methodology-card">
              <h4>Personalized Learning</h4>
              <p>Customized pacing and content based on individual goals and learning style</p>
            </div>

            <div className="methodology-card">
              <h4>Continuous Assessment</h4>
              <p>Regular progress tracking with detailed feedback and adjustment strategies</p>
            </div>

            <div className="methodology-card">
              <h4>Technology Integration</h4>
              <p>Online platforms, interactive tools, and hybrid learning options</p>
            </div>

            <div className="methodology-card">
              <h4>Community Building</h4>
              <p>Conversation circles, cultural events, and peer learning communities</p>
            </div>
          </div>
        </section>

        {/* Program Pathways */}
        <section className="academics-section pathways">
          <div className="section-header">
            <h2>Program Pathways</h2>
            <p>Choose your learning journey based on time and intensity</p>
          </div>

          <div className="pathways-grid">
            <div className="pathway-card">
              <h4>Standard Track</h4>
              <p className="pathway-duration">6 months | 2-3 sessions/week</p>
              <p>Balanced pace for working professionals and students</p>
              <ul>
                <li>📚 16-20 instructional hours</li>
                <li>👥 Small group sizes</li>
                <li>📝 Weekly homework</li>
                <li>🧪 Monthly assessments</li>
              </ul>
              <Link to="/school-portal" className="button secondary">
                Enroll in Standard
              </Link>
            </div>

            <div className="pathway-card featured">
              <span className="pathway-badge">POPULAR</span>
              <h4>Intensive Track</h4>
              <p className="pathway-duration">3 months | 4-5 sessions/week</p>
              <p>Fast-track for results-driven learners</p>
              <ul>
                <li>📚 40-60 instructional hours</li>
                <li>👥 1-on-1 tutoring available</li>
                <li>📝 Daily practice</li>
                <li>🧪 Bi-weekly assessments</li>
              </ul>
              <Link to="/school-portal" className="button primary">
                Enroll in Intensive
              </Link>
            </div>

            <div className="pathway-card">
              <h4>Executive Program</h4>
              <p className="pathway-duration">Flexible | Customizable</p>
              <p>Tailored for busy professionals and organizations</p>
              <ul>
                <li>📚 Bespoke curriculum</li>
                <li>👥 Individual coaching</li>
                <li>📝 Flexible scheduling</li>
                <li>🧪 Business-focused modules</li>
              </ul>
              <Link to="/about#contact-us" className="button secondary">
                Book Consultation
              </Link>
            </div>
          </div>
        </section>

        {/* Certification Section */}
        <section className="academics-section certifications">
          <div className="section-header">
            <h2>International Certifications</h2>
            <p>Recognized credentials that boost career prospects globally</p>
          </div>

          <div className="certs-grid">
            <div className="cert-item">
              <h4>Goethe-Institut</h4>
              <p>German language certification recognized worldwide for academic and professional purposes</p>
            </div>

            <div className="cert-item">
              <h4>HSK (Chinese)</h4>
              <p>Official Chinese proficiency test accepted by universities and employers globally</p>
            </div>

            <div className="cert-item">
              <h4>IELTS / TOEFL</h4>
              <p>International English qualifications for higher education and migration</p>
            </div>

            <div className="cert-item">
              <h4>DELF/DALF</h4>
              <p>French government certification for professional and academic advancement</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="cta-section-academic">
          <div className="cta-content">
            <h2>Ready to Transform Your Language Skills?</h2>
            <p>Join thousands of successful graduates who achieved fluency and career advancement with Eurobridge</p>
            <div className="cta-buttons">
              <Link to="/school-portal" className="button primary btn-lg">
                Enroll Now
              </Link>
              <Link to="/about#contact-us" className="button secondary btn-lg">
                Get Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Academics;
