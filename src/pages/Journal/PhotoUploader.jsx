import React from 'react';
import '../../../styles/JournalStyles.css'; 

function PhotoUploader({ photos, setPhotos }) {
  const handleAddPhoto = () => {
    const url = prompt('Enter photo URL (placeholder)');
    if (url) {
      setPhotos([...photos, url]);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {photos.map((url, idx) => (
          <img key={idx} src={url} alt="Uploaded" className="h-16 w-16 object-cover rounded" />
        ))}
      </div>
      <button
        type="button"
        onClick={handleAddPhoto}
        className="border border-dashed rounded px-2 py-1 text-sm"
      >
        + Upload Photo
      </button>
    </div>
  );
}

export default PhotoUploader;
