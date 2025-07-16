import React, { useState, useEffect } from 'react';
import { getTrek, updateTrek } from '../../api/Trek/trekApi';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // make sure to install axios
import '../../../styles/EditTrek.css';

const BACKEND_URL = 'http://localhost:5000'; // change to your backend URL

export default function EditTrek() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trek, setTrek] = useState({
    name: '',
    location: '',
    smallDescription: '',
    description: '',
    difficulty: 'EASY',
    distance: '',
    bestSeason: '',
    imageUrl: '',
    highlights: ['']
  });
  const [loading, setLoading] = useState(true);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    async function fetchTrek() {
      try {
        const res = await getTrek(id);
        setTrek({
          ...res.data,
          highlights: res.data.highlights?.length ? res.data.highlights : ['']
        });
        if (res.data.imageUrl) {
          setPreviewUrl(`${BACKEND_URL}${res.data.imageUrl}`);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTrek();
  }, [id]);

  const handleChange = (e) => {
    setTrek({ ...trek, [e.target.name]: e.target.value });
  };

  const handleHighlightChange = (index, value) => {
    const updated = [...trek.highlights];
    updated[index] = value;
    setTrek({ ...trek, highlights: updated });
  };

  const addHighlight = () => {
    setTrek({ ...trek, highlights: [...trek.highlights, ''] });
  };

  const removeHighlight = (index) => {
    const updated = trek.highlights.filter((_, i) => i !== index);
    setTrek({ ...trek, highlights: updated });
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = trek.imageUrl;

      // if user selected new image, upload to backend
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append('image', selectedImageFile);

        const uploadRes = await axios.post(`${BACKEND_URL}/api/treks/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        uploadedImageUrl = uploadRes.data.imageUrl; // e.g., "/uploads/everest.jpg"
      }

      // update trek with new data and uploadedImageUrl
      await updateTrek(id, { ...trek, imageUrl: uploadedImageUrl });
      navigate('/trek');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Edit Trek</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input name="name" value={trek.name} onChange={handleChange} placeholder="Name" required />
        <input name="location" value={trek.location} onChange={handleChange} placeholder="Location" />
        <input name="smallDescription" value={trek.smallDescription} onChange={handleChange} placeholder="Short Description" />
        <textarea name="description" value={trek.description} onChange={handleChange} placeholder="Full Description" rows="4" />
        <select name="difficulty" value={trek.difficulty} onChange={handleChange}>
          <option value="EASY">EASY</option>
          <option value="MODERATE">MODERATE</option>
          <option value="HARD">HARD</option>
        </select>
        <input name="distance" type="number" value={trek.distance} onChange={handleChange} placeholder="Distance (km)" />
        <input name="bestSeason" value={trek.bestSeason} onChange={handleChange} placeholder="Best Season" />

        <input type="file" accept="image/*" onChange={handleImageFileChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" className="image-preview" />}

        <div className="highlights-section">
          <label>Highlights:</label>
          {trek.highlights.map((highlight, index) => (
            <div key={index} className="highlight-item">
              <input value={highlight} onChange={(e) => handleHighlightChange(index, e.target.value)} placeholder={`Highlight ${index + 1}`} />
              <button type="button" onClick={() => removeHighlight(index)} className="remove-btn">✕</button>
            </div>
          ))}
          <button type="button" onClick={addHighlight} className="add-btn">+ Add Highlight</button>
        </div>

        <button type="submit">Update Trek</button>
        <button type="button" onClick={() => navigate(-1)} className="cancel-button">Cancel</button>
      </form>
    </div>
  );
}
