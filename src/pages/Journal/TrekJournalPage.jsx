import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import JournalHeader from './JournalHeader';
import AddEntryButton from './AddEntryButton';
import JournalTimeline from './JournalTimeline';
import JournalEntryForm from './JournalEntryForm';
import { getJournalEntries, addJournalEntry } from '../../api/journalApi'; 
import '../../../styles/JournalStyles.css'; 

function TrekJournalPage() {
  const { trekId } = useParams();
  const location = useLocation();
  const userId = location.state?.userId;

  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(null);  // store draft locally

  useEffect(() => {
    async function fetchEntries() {
      if (!trekId || !userId) return;
      const data = await getJournalEntries(trekId, userId);
      setEntries(data);
    }
    fetchEntries();
  }, [trekId, userId]);

  // Save draft locally (does NOT send to backend)
  const handleSaveDraft = (entryData, photoFiles) => {
    setDraft({ ...entryData, photos: photoFiles });
    alert('Draft saved locally.');
  };

  // Post entry (send to backend, then clear draft)
  const handlePost = async (entryData, photoFiles) => {
    if (!trekId || !userId) return;

    const newEntryData = { ...entryData, trekId, userId };

    try {
      const savedEntry = await addJournalEntry(newEntryData, photoFiles);
      setEntries([savedEntry, ...entries]);
      setDraft(null);
      setShowForm(false);
      alert('Entry posted successfully!');
    } catch (error) {
      console.error('Error posting entry:', error);
      alert('Failed to post entry.');
    }
  };

  if (!userId) return <p>Error: User ID missing, please access journal via trek details.</p>;

  return (
    <div className="journal-container">
      <JournalHeader trekName="Trek Journal" />
      {showForm ? (
        <JournalEntryForm
          draft={draft}
          onSaveDraft={handleSaveDraft}
          onPost={handlePost}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <AddEntryButton onClick={() => setShowForm(true)} />
      )}
      <JournalTimeline entries={entries} />
    </div>
  );
}

export default TrekJournalPage;
