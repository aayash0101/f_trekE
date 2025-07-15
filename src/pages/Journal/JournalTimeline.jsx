import React from 'react';
import '../../../styles/JournalStyles.css'; 

function JournalTimeline({ entries }) {
  return (
    <div className="journal-timeline">
      {entries.length === 0 && <p>No journal entries yet.</p>}
      {entries.map((entry) => (
        <div key={entry._id} className="journal-card">
          <div className="journal-card-date">
            {new Date(entry.date).toLocaleDateString()}
          </div>
          <div className="journal-card-text">{entry.text}</div>
          {entry.photos && entry.photos.length > 0 && (
            <div className="photo-preview-container">
              {entry.photos.map((photoUrl, idx) => (
                <img
                  key={idx}
                  src={photoUrl}
                  alt="Entry photo"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default JournalTimeline;
