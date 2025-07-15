import '../../styles/TrekDetailPage.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:5000';

export default function TrekDetailPage() {
  const { trekId } = useParams();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/treks/${trekId}`);
        if (!response.ok) throw new Error('Failed to fetch trek');
        const data = await response.json();
        setTrek(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (trekId) fetchTrek();
  }, [trekId]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Navigate to journal page with trekId and userId
  const goToJournal = () => {
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      alert('User not logged in');
      return;
    }
    const user = JSON.parse(userJSON);
    const userId = user?.id || user?._id; // depends on your backend user schema, maybe "_id"

    if (!userId) {
      alert('User not logged in');
      return;
    }

    // proceed with userId

    navigate(`/trek/${trekId}/journal`, { state: { userId } });
  };

  if (error) return <p>Error: {error}</p>;
  if (!trek) return <p>Loading trek details...</p>;

  return (
    <div className="trek-detail-container">
      <h1 className="trek-title">{trek.name}</h1>

      {trek.imageUrl && (
        <img
          src={`${BACKEND_URL}${trek.imageUrl}`}
          alt={trek.name}
          className="trek-image"
        />
      )}

      <button
        className={`favorite-btn ${isFavorite ? 'favorite' : ''}`}
        onClick={toggleFavorite}
      >
        {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
      </button>

      {/* New button to go to journal */}
      <button className="journal-btn" onClick={goToJournal}>
        View Trek Journal
      </button>

      <p><strong>Location:</strong> {trek.location || 'N/A'}</p>
      <p><strong>Difficulty:</strong> {trek.difficulty || 'N/A'}</p>
      <p><strong>Distance:</strong> {trek.distance ? `${trek.distance} km` : 'N/A'}</p>
      <p><strong>Best Season:</strong> {trek.bestSeason || 'N/A'}</p>
      <p><strong>Short Description:</strong> {trek.smallDescription || 'N/A'}</p>

      <section className="trek-full-description">
        <h3>Full Description</h3>
        <p>{trek.description || 'N/A'}</p>
      </section>

      {trek.highlights && trek.highlights.length > 0 && (
        <section className="trek-highlights">
          <h3>Highlights</h3>
          <ul>
            {trek.highlights.map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
