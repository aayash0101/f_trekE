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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review form state
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const goToJournal = () => {
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      alert('User not logged in');
      return;
    }
    const user = JSON.parse(userJSON);
    const userId = user?.id || user?._id;

    if (!userId) {
      alert('User not logged in');
      return;
    }

    navigate(`/trek/${trekId}/journal`, { state: { userId } });
  };

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      alert('You must be logged in to submit a review.');
      return;
    }
    const user = JSON.parse(userJSON);
    const userId = user?.id || user?._id;
    const username = user?.username || user?.name || 'Anonymous';

    if (!reviewText.trim()) {
      alert('Please write something before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/treks/${trekId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          username,
          review: reviewText.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      setReviewText('');
      alert('Review submitted successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!trek) return <p>Loading trek details...</p>;

  return (
    <div className="trek-detail-container">
      <h1 className="trek-title">{trek.name}</h1>

      {trek.imageUrl && (
        <>
          <img
            src={`${BACKEND_URL}${trek.imageUrl}`}
            alt={trek.name}
            className="trek-image"
            onClick={() => setIsModalOpen(true)}
          />

          {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img
                  src={`${BACKEND_URL}${trek.imageUrl}`}
                  alt={trek.name}
                  className="modal-image"
                />
                <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                  ✕
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <button
        className={`favorite-btn ${isFavorite ? 'favorite' : ''}`}
        onClick={toggleFavorite}
      >
        {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
      </button>

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

      {/* Review submission form */}
      <section className="review-form-section">
        <h3>Submit a Review</h3>
        <form onSubmit={handleReviewSubmit} className="review-form">
          <textarea
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </section>

      {/* Button to navigate to Reviews page */}
      <button className="reviews-btn" onClick={() => navigate(`/treks/${trekId}/reviews`)}>
        View Reviews
      </button>
    </div>
  );
}
