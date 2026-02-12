const Academics = () => {
  return (
    <section className="page">
      <div className="academics-hero">
        <h1>Academic Programs</h1>
        <p>Explore our comprehensive language courses designed for all proficiency levels</p>
      </div>

      <div className="content-wrapper">
        <div className="programs-grid">
          <div className="program-card">
            <h2>German Language</h2>
            <p>From beginner A1 to advanced C2 levels. Prepare for Goethe-Institut certifications.</p>
            <ul>
              <li>A1 & A2 - Basic User</li>
              <li>B1 & B2 - Independent User</li>
              <li>C1 & C2 - Proficient User</li>
            </ul>
          </div>

          <div className="program-card">
            <h2>Chinese Language</h2>
            <p>Master Mandarin Chinese with our HSK-focused curriculum.</p>
            <ul>
              <li>HSK 1-3 - Beginner to Intermediate</li>
              <li>HSK 4-6 - Advanced</li>
              <li>Business Chinese</li>
            </ul>
          </div>

          <div className="program-card">
            <h2>English Language</h2>
            <p>IELTS preparation and general English proficiency courses.</p>
            <ul>
              <li>General English</li>
              <li>IELTS Preparation</li>
              <li>Business English</li>
            </ul>
          </div>

          <div className="program-card">
            <h2>French Language</h2>
            <p>Learn French from basics to advanced business communication.</p>
            <ul>
              <li>A1 & A2 - Beginner</li>
              <li>B1 & B2 - Intermediate</li>
              <li>DELF/DALF Preparation</li>
            </ul>
          </div>

          <div className="program-card">
            <h2>Swahili Language</h2>
            <p>Master East Africa's lingua franca for business and cultural integration.</p>
            <ul>
              <li>Basic Swahili</li>
              <li>Intermediate Swahili</li>
              <li>Business Swahili</li>
            </ul>
          </div>

          <div className="program-card">
            <h2>Arabic Language</h2>
            <p>Learn Modern Standard Arabic and classical texts.</p>
            <ul>
              <li>Modern Standard Arabic</li>
              <li>Quranic Arabic</li>
              <li>Business Arabic</li>
            </ul>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Start Your Language Journey?</h2>
          <p>Join thousands of successful graduates who achieved fluency with Eurobridge</p>
          <a href="/portal" className="btn-primary">Enroll Now</a>
        </div>
      </div>
    </section>
  );
};

export default Academics;
