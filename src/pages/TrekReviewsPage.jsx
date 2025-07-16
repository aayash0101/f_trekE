import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/TrekReviewsPage.css'; // 

const BACKEND_URL = 'http://localhost:5000';

export default function TrekReviewsPage() {
  const { trekId } = useParams();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/treks/${trekId}`);
        if (!res.ok) throw new Error('Failed to fetch trek');
        const data = await res.json();
        setTrek(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrek();
  }, [trekId]);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!trek) return <p>No trek data found.</p>;

  return (
    <div className="trek-reviews-page">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>

      <h1>{trek.name} — Reviews</h1>

      {trek.imageUrl && (
        <img
          src={`${BACKEND_URL}${trek.imageUrl}`}
          alt={trek.name}
          className="trek-reviews-image"
        />
      )}

      <section className="reviews-list">
        {trek.reviews && trek.reviews.length > 0 ? (
          <ul>
            {trek.reviews.map((review, idx) => (
              <li key={idx} className="review-item">
                <strong>{review.username}</strong> says:
                <p>{review.review}</p>
                <small>{new Date(review.date).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet for this trek.</p>
        )}
      </section>
    </div>
  );
}
