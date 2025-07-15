import React from 'react';
import '../../../styles/JournalStyles.css'; 

function JournalCard({ entry }) {
  return (
    <div className="bg-white rounded shadow p-4 hover:bg-gray-50">
      <div className="text-gray-500 text-sm">{entry.date}</div>
      <div className="font-medium mt-1">{entry.text.substring(0, 80)}...</div>
      {entry.photos.length > 0 && (
        <img
          src={entry.photos[0]}
          alt="Journal thumbnail"
          className="h-24 w-24 object-cover rounded mt-2"
        />
      )}
    </div>
  );
}

export default JournalCard;
