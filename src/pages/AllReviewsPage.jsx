import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AllReviewsPage.css';

const BACKEND_URL = 'http://localhost:5000';

export default function AllReviewsPage() {
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New states for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrek, setFilterTrek] = useState('all');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/treks/reviews/all`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setTreks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Filtered treks based on search and trek filter
  const filteredTreks = treks.filter((trek) => {
    // Filter by trek name (if filterTrek is not 'all')
    if (filterTrek !== 'all' && trek._id !== filterTrek) return false;

    // Search in trek name or any review text or username inside this trek
    const searchLower = searchQuery.toLowerCase();

    const trekNameMatch = trek.name.toLowerCase().includes(searchLower);

    const reviewsMatch = trek.reviews?.some((review) => {
      const reviewText = review.review || '';
      const username = review.username || '';
      return (
        reviewText.toLowerCase().includes(searchLower) ||
        username.toLowerCase().includes(searchLower)
      );
    });

    return trekNameMatch || reviewsMatch;
  });

  if (loading) return <p>Loading all reviews...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="all-reviews-page">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      <h1>All User Reviews</h1>

      {/* Search and Filter Inputs */}
      <div className="search-filter-container" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search reviews or trek names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px', width: '60%', marginRight: '10px' }}
        />

        <select
          value={filterTrek}
          onChange={(e) => setFilterTrek(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="all">Filter by trek (all)</option>
          {treks.map((trek) => (
            <option key={trek._id} value={trek._id}>
              {trek.name}
            </option>
          ))}
        </select>
      </div>

      {filteredTreks.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        filteredTreks.map((trek) => (
          <div key={trek._id} className="trek-review-block">
            <img
              src={`${BACKEND_URL}${trek.imageUrl}`}
              alt={trek.name}
              className="trek-review-image"
            />
            <h2 className="trek-review-title">{trek.name}</h2>

            {trek.reviews && trek.reviews.length > 0 ? (
              <ul className="review-list">
                {trek.reviews.map((review) => (
                  <li key={review._id} className="review-item">
                    <strong>{review.username}</strong> says:
                    <p>{review.review}</p>
                    <small className="review-date">
                      {new Date(review.date).toLocaleDateString()}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-reviews">No reviews yet for this trek.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
