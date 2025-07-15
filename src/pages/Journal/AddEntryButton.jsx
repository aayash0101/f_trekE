import React from 'react';
import '../../../styles/JournalStyles.css'; 

function AddEntryButton({ onClick }) {
  return (
    <button
      className="btn btn-primary add-entry-btn"
      onClick={onClick}
      type="button"
    >
      + Add New Entry
    </button>
  );
}

export default AddEntryButton;
