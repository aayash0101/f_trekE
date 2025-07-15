import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTreks from '../hooks/Trek/useTreks';
import '../../styles/TreksPage.css';

function getDifficultyClass(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'difficulty-easy';
    case 'moderate':
      return 'difficulty-moderate';
    case 'hard':
      return 'difficulty-hard';
    default:
      return 'difficulty-default';
  }
}

export default function TreksPage() {
  const { treks } = useTreks();

  const [searchText, setSearchText] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [allTreks, setAllTreks] = useState([]);

  useEffect(() => {
    if (treks) setAllTreks(treks);
  }, [treks]);

  const filteredTreks = allTreks.filter((trek) => {
    const matchesSearch =
      trek.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      trek.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      (trek.difficulty && trek.difficulty.toLowerCase() === selectedDifficulty);

    const matchesLocation =
      selectedLocation === 'all' ||
      (trek.location && trek.location.toLowerCase().includes(selectedLocation));

    let matchesDuration = true;
    if (selectedDuration !== 'all') {
      const days = parseInt(trek.duration);
      if (!isNaN(days)) {
        if (selectedDuration === 'short') matchesDuration = days <= 5;
        else if (selectedDuration === 'medium') matchesDuration = days >= 6 && days <= 10;
        else if (selectedDuration === 'long') matchesDuration = days > 10;
      }
    }

    return matchesSearch && matchesDifficulty && matchesLocation && matchesDuration;
  });

  return (
    <div className={`treks-page ${darkMode ? 'dark-mode' : ''}`}>
      <header className="treks-header">
        <h1 className="treks-title">🏔️ Explore Treks</h1>
        <p className="treks-subtitle">Discover breathtaking adventures curated just for you</p>
        <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <section className="treks-filters">
        <input
          type="text"
          placeholder="🔍 Search treks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="treks-filter__search"  // Keep existing class for CSS targeting
        />
        <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>
        <select value={selectedDuration} onChange={(e) => setSelectedDuration(e.target.value)}>
          <option value="all">All Durations</option>
          <option value="short">1–5 days</option>
          <option value="medium">6–10 days</option>
          <option value="long">11+ days</option>
        </select>
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="all">All Locations</option>
          <option value="nepal">Nepal</option>
          <option value="peru">Peru</option>
          <option value="tanzania">Tanzania</option>
          <option value="chile">Chile</option>
          <option value="europe">Europe</option>
        </select>
      </section>

      <p className="treks-count">🌿 Showing {filteredTreks.length} trek(s)</p>

      <section className="treks-grid">
        {filteredTreks.map((trek) => (
          <article key={trek._id} className="trek-card fade-in">
            <div className={`trek-card__difficulty ${getDifficultyClass(trek.difficulty)}`}>
              {trek.difficulty || 'N/A'}
            </div>
            <div className="trek-card__content">
              <Link to={`/treks/${trek._id}`} className="trek-card__title">
                {trek.name || 'Unnamed Trek'}
              </Link>
              <p className="trek-card__location">📍 {trek.location || 'Unknown location'}</p>
              <p className="trek-card__description">{trek.description || 'No description provided.'}</p>
              <div className="trek-card__meta">
                <span>⏱️ {trek.duration || 'N/A'} days</span>
                <span>👥 Max {trek.maxGroupSize || 'N/A'}</span>
                <span>⭐ {trek.rating || 'N/A'} ({trek.reviews || 0} reviews)</span>
              </div>
              <Link to={`/treks/${trek._id}`} className="trek-card__view-link">
                View Details →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
