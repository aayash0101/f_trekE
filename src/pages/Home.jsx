import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.css"; 
import Footer from "../components/footer";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">TrekEnhance</h1>
        <p className="home-subtitle">Explore. Elevate. Experience the Himalayas.</p>
      </header>

      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <h2 className="hero-title">Find the Perfect Trek for You</h2>
          <p className="hero-description">
            Whether you're a seasoned mountaineer or a casual explorer, TrekEnhance helps you discover personalized trekking experiences across Nepal.
          </p>
          <Link to="/trekker" className="hero-button">
            Explore Treks
          </Link>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="feature-card">
            <h3>Curated Treks</h3>
            <p>Access handpicked trekking trails with detailed descriptions and difficulty levels.</p>
          </div>
          <div className="feature-card">
            <h3>Track Progress</h3>
            <p>Track your completed treks, set goals, and review your experience.</p>
          </div>
          <div className="feature-card">
            <h3>Community Reviews</h3>
            <p>Read real reviews from fellow trekkers to plan your journey better.</p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta">
          <h2>Ready to begin your next adventure?</h2>
          <Link to="/login" className="signup-button">
            Join Now
          </Link>
          <section className="cta-section">

  {/* Admin dashboard link */}
  <div style={{ marginTop: "20px" }}>
    <p style={{ fontSize: "14px", color: "#555" }}>Are you an admin?</p>
    <Link to="/admindashboard" className="btn admin-btn">
      Go to Admin Dashboard
    </Link>
  </div>
</section>

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
