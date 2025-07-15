import React, { useEffect } from 'react';
import '../../styles/UserProfile.css';

export default function PhotoModal({ photoUrl, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!photoUrl) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-photo-view" onClick={(e) => e.stopPropagation()}>
        <img src={photoUrl} alt="Full view" />
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
