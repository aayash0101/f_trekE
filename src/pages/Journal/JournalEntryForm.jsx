import React, { useState, useEffect } from 'react';
import '../../../styles/JournalStyles.css'; 

function JournalEntryForm({ onSaveDraft, onPost, onCancel, draft }) {
  const [date, setDate] = useState(draft?.date || '');
  const [text, setText] = useState(draft?.text || '');
  const [photoFiles, setPhotoFiles] = useState([]);

  useEffect(() => {
    if (draft) {
      setDate(draft.date || '');
      setText(draft.text || '');
      // If you want to show preview of draft photos (if any URLs), you may add support here
    }
  }, [draft]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles(files);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="journal-form">
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        Entry:
        <textarea
          placeholder="Write about your day..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          required
        />
      </label>

      <label>
        Upload Photos:
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoChange}
        />
      </label>

      <div className="photo-preview-container">
        {photoFiles.map((file, idx) => (
          <img
            key={idx}
            src={URL.createObjectURL(file)}
            alt="Preview"
            loading="lazy"
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onSaveDraft({ date, text }, photoFiles)}
        >
          Save Draft
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onPost({ date, text }, photoFiles)}
        >
          Post
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="btn btn-cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default JournalEntryForm;
