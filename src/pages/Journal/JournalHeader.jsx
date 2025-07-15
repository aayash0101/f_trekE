import React from 'react';
import '../../../styles/JournalStyles.css'; 

function JournalHeader({ trekName }) {
  return <h1 className="journal-header">{trekName} — Trek Journal</h1>;
}

export default JournalHeader;
