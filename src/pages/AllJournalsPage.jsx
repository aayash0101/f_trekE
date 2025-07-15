import React, { useEffect, useState } from 'react';
import { getAllJournals } from '../api/journalApi';
import {
  getSavedJournals,
  addSavedJournal,
  removeSavedJournal,
  getFavoriteJournals,
  addFavoriteJournal,
  removeFavoriteJournal,
} from '../api/savedAndFavoriteApi'; // your saved/favorite API
import '../../styles/AllJournalsPage.css';

const BACKEND_URL = 'http://localhost:5000';
const ITEMS_PER_PAGE = 6;

export default function AllJournalsPage() {
  const [entries, setEntries] = useState([]);
  const [treks, setTreks] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedTrekId, setSelectedTrekId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Saved and favorite journal IDs
  const [savedJournals, setSavedJournals] = useState(new Set());
  const [favoriteJournals, setFavoriteJournals] = useState(new Set());

  // Get current logged-in user ID from localStorage (adjust if your storage differs)
  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? (JSON.parse(storedUser).id || JSON.parse(storedUser)._id) : null;

  useEffect(() => {
    async function fetchEntries() {
      try {
        const data = await getAllJournals();
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEntries(sorted);

        const uniqueTreks = Array.from(
          new Map(
            sorted
              .filter(entry => entry.trekId?._id && entry.trekId.name)
              .map(entry => [entry.trekId._id, entry.trekId])
          ).values()
        );
        setTreks(uniqueTreks);
        setFilteredEntries(sorted);

        // Fetch user's saved and favorite journals if logged in
        if (userId) {
          const [saved, favorites] = await Promise.all([
            getSavedJournals(userId),
            getFavoriteJournals(userId),
          ]);
          setSavedJournals(new Set(saved.map(j => j._id)));
          setFavoriteJournals(new Set(favorites.map(j => j._id)));
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load journal entries');
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, [userId]);

  useEffect(() => {
    let temp = [...entries];

    if (selectedTrekId !== 'all') {
      temp = temp.filter(entry => entry.trekId?._id === selectedTrekId);
    }

    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      temp = temp.filter(entry =>
        entry.text?.toLowerCase().includes(lower) ||
        entry.userId?.username?.toLowerCase().includes(lower)
      );
    }

    setCurrentPage(1);
    setFilteredEntries(temp);
  }, [selectedTrekId, searchQuery, entries]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEntries = filteredEntries.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, idx) =>
      part.toLowerCase() === query.toLowerCase()
        ? <span key={idx} className="highlight">{part}</span>
        : part
    );
  };

  const clearFilters = () => {
    setSelectedTrekId('all');
    setSearchQuery('');
  };

  // --------- Save & Favorite Handlers with backend calls ----------

  const toggleSave = async (id) => {
    if (!userId) {
      alert('Please login to save journals.');
      return;
    }

    try {
      if (savedJournals.has(id)) {
        await removeSavedJournal(userId, id);
        setSavedJournals(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        await addSavedJournal(userId, id);
        setSavedJournals(prev => new Set(prev).add(id));
      }
    } catch (err) {
      console.error('Error toggling save:', err);
      alert('Failed to update saved journals.');
    }
  };

  const toggleFavorite = async (id) => {
    if (!userId) {
      alert('Please login to favorite journals.');
      return;
    }

    try {
      if (favoriteJournals.has(id)) {
        await removeFavoriteJournal(userId, id);
        setFavoriteJournals(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        await addFavoriteJournal(userId, id);
        setFavoriteJournals(prev => new Set(prev).add(id));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update favorite journals.');
    }
  };

  if (loading) return <div className="journals-loading">Loading journals...</div>;
  if (error) return <div className="journals-error">{error}</div>;

  return (
    <div className="journals-container">
      <h1 className="journals-title">Trek Journals</h1>

      <div className="journals-filters">
        {treks.length > 0 && (
          <select
            className="trek-filter"
            value={selectedTrekId}
            onChange={(e) => setSelectedTrekId(e.target.value)}
          >
            <option value="all">All Treks</option>
            {treks.map((trek) => (
              <option key={trek._id} value={trek._id}>{trek.name}</option>
            ))}
          </select>
        )}

        <input
          className="journal-search"
          type="text"
          placeholder="Search by username or text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button className="clear-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {filteredEntries.length === 0 ? (
        <p>No journal entries found.</p>
      ) : (
        <>
          <div className="journal-list">
            {currentEntries.map((entry) => (
              <div
                className="journal-card"
                key={entry._id}
                onClick={() => setSelectedJournal(entry)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <div className="journal-header">
                  <span className="journal-user">
                    User: {highlightText(entry.userId?.username || 'Unknown', searchQuery)}
                  </span>
                  <span className="journal-date">
                    {entry.date ? new Date(entry.date).toLocaleDateString() : 'No date'}
                  </span>
                </div>
                <div className="journal-trek">Trek: {entry.trekId?.name || 'Unknown'}</div>
                <p className="journal-text">
                  {highlightText(entry.text || 'No text provided.', searchQuery)}
                </p>
                {entry.photos && entry.photos.length > 0 && (
                  <div className="journal-photos">
                    {entry.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={`${BACKEND_URL}${photo}`}
                        alt={`journal-${idx}`}
                        className="journal-photo"
                      />
                    ))}
                  </div>
                )}

                {/* Save & Favorite Buttons */}
                <div
                  className="journal-card-buttons"
                  onClick={e => e.stopPropagation()} // Prevent modal open on button click
                >
                  <button
                    className={`btn-save ${savedJournals.has(entry._id) ? 'saved' : ''}`}
                    onClick={() => toggleSave(entry._id)}
                  >
                    {savedJournals.has(entry._id) ? 'Saved' : 'Save'}
                  </button>
                  <button
                    className={`btn-favorite ${favoriteJournals.has(entry._id) ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(entry._id)}
                  >
                    {favoriteJournals.has(entry._id) ? 'Favorited' : 'Favorite'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ◀
            </button>

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                className={currentPage === idx + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              ▶
            </button>
          </div>
        </>
      )}

      {/* Journal Detail Modal */}
      {selectedJournal && (
        <div className="modal-overlay" onClick={() => setSelectedJournal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Journal by {selectedJournal.userId?.username || 'Unknown'}</h2>
            <p><strong>Trek:</strong> {selectedJournal.trekId?.name || 'Unknown'}</p>
            <p><strong>Date:</strong> {new Date(selectedJournal.date).toLocaleDateString()}</p>
            <p>{selectedJournal.text}</p>
            <div className="modal-photos">
              {selectedJournal.photos?.map((photo, idx) => (
                <img
                  key={idx}
                  src={`${BACKEND_URL}${photo}`}
                  alt={`journal-${idx}`}
                  onClick={() => setSelectedPhoto(`${BACKEND_URL}${photo}`)}
                  className="modal-photo-thumb"
                />
              ))}
            </div>
            <button onClick={() => setSelectedJournal(null)} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-photo-view" onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto} alt="full view" />
            <button onClick={() => setSelectedPhoto(null)} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
