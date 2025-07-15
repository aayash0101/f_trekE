import React from "react";
import { Link } from "react-router-dom";
import "../../styles/HomePage.css";
import Layout from "../layouts/layout";

const HomePage = () => {
  return (
    <Layout>
      <div>
        <header className="home-header">
          <h1 className="home-title">TrekEnhance</h1>
          <p className="home-subtitle">Explore. Elevate. Experience the Himalayas.</p>
        </header>

        <main className="home-main">
          <section className="hero-section">
            <h2 className="hero-title">Find the Perfect Trek for You</h2>
            <p className="hero-description">
              Whether you're a seasoned mountaineer or a casual explorer, TrekEnhance helps you discover personalized trekking experiences across Nepal.
            </p>
            <div className="hero-button-group">
              <Link to="/journals" className="hero-button">
                Journals
              </Link>
              <Link to="/trekker" className="hero-button explore-button">
                Explore Treks
              </Link>
              <Link to="/profile" className="hero-button">
                Profile
              </Link>
            </div>

          </section>

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
        </main>
      </div>
    </Layout>
  );
};

export default HomePage;
