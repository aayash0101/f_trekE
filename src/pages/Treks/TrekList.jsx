import React from 'react';
import useTreks from '../../hooks/Trek/useTreks';
import { deleteTrek } from '../../api/Trek/trekApi';
import { Link } from 'react-router-dom';
import '../../../styles/TrekList.css'; 

export default function TrekList() {
  const { treks, fetchTreks } = useTreks();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trek?')) {
      await deleteTrek(id);
      fetchTreks();
    }
  };

  return (
    <div className="trek-list-container">
      <div className="trek-list-header">
        <h1 className="trek-list-title">Treks</h1>
        <Link to="/add" className="trek-add-button">
          + Add Trek
        </Link>
      </div>

      {treks.length === 0 ? (
        <p className="trek-no-treks">No treks found. Add a new trek to get started.</p>
      ) : (
        <div className="trek-grid">
          {treks.map((trek) => (
            <div key={trek._id} className="trek-card">
              <div className="trek-info">
                <h2 className="trek-name">{trek.name}</h2>
                <p className="trek-location">{trek.location}</p>
                {trek.description && <p className="trek-description">{trek.description}</p>}
                <p className="trek-meta">
                  Difficulty: {trek.difficulty} | Distance: {trek.distance} km
                </p>
              </div>

              <div className="trek-actions">
                <Link to={`/edit/${trek._id}`} className="trek-edit-button">
                  Edit
                </Link>
                <button onClick={() => handleDelete(trek._id)} className="trek-delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
