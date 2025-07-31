import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTrek } from '../../api/Trek/trekApi'; // your api call function
import '../../../styles/AddTrek.css';

export default function AddTrek() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    location: '',
    smallDescription: '',
    description: '',
    difficulty: 'EASY',
    distance: '',
    bestSeason: '',
    highlights: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle text input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare form data
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await addTrek(formData);
      navigate('/trek'); // redirect after add, adjust route if needed
    } catch (err) {
      console.error('Error adding trek:', err);
    }
  };

  return (
    <div className="add-trek-container">
      <h2>Add New Trek</h2>
      <form onSubmit={handleSubmit} className="add-trek-form">

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <textarea
          name="smallDescription"
          placeholder="Short Description"
          value={form.smallDescription}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Full Description"
          value={form.description}
          onChange={handleChange}
        />

        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
        >
          <option value="EASY">Easy</option>
          <option value="MODERATE">Moderate</option>
          <option value="HARD">Hard</option>
        </select>

        <input
          type="number"
          name="distance"
          placeholder="Distance (km)"
          value={form.distance}
          onChange={handleChange}
        />

        <input
          type="text"
          name="bestSeason"
          placeholder="Best Season (e.g. Spring, Autumn)"
          value={form.bestSeason}
          onChange={handleChange}
        />

        <input
          type="text"
          name="highlights"
          placeholder="Highlights (comma-separated)"
          value={form.highlights}
          onChange={handleChange}
        />

        <div className="image-upload">
          <label htmlFor="trekImage">Upload Trek Image:</label>
          <input id="trekImage" type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
        </div>

        <button type="submit">Add Trek</button>
      </form>
    </div>
  );
}
