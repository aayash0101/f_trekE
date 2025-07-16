import React from 'react';
import '../../styles/AboutUs.css'; 

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <h1>About TrekEnhance</h1>
      <p>
        TrekEnhance is your trusted companion for exploring the majestic Himalayas and beyond.
        We provide curated trekking information, user experiences, expert advice, and much more,
        empowering adventurers to explore, elevate, and experience the outdoors safely and
        memorably.
      </p>

      <h2>Our Mission</h2>
      <p>
        To inspire and equip trekkers of all levels with accurate, up-to-date information and
        personalized recommendations that enhance their trekking experiences.
      </p>

      <h2>What We Offer</h2>
      <ul>
        <li>Comprehensive trekking guides and itineraries</li>
        <li>User-submitted journals and reviews</li>
        <li>Interactive maps and route highlights</li>
        <li>Community features for sharing and connecting</li>
      </ul>

      <h2>Meet the Team</h2>
      <p>
        Our passionate team of trekkers, developers, and outdoor enthusiasts is dedicated to
        making trekking safer, easier, and more enjoyable for everyone.
      </p>

      <h2>Contact Us</h2>
      <p>
        Have questions or want to collaborate? Reach out to us at{' '}
        <a href="mailto:support@trekenhance.com">support@trekenhance.com</a>
      </p>
    </div>
  );
};

export default AboutUs;
