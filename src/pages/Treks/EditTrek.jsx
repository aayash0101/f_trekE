import React, { useState, useEffect } from 'react';
import { getTrekById, updateTrek } from '../../api/Trek/trekApi';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditTrek() {
  const { id } = useParams(); // get trek id from route
  const navigate = useNavigate();
  const [trek, setTrek] = useState({
    name: '',
    location: '',
    description: '',
    difficulty: 'MODERATE',
    distance: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrek() {
      try {
        const res = await getTrekById(id);
        setTrek(res.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTrek(id, trek);
    navigate('/'); // redirect to home or trek list
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Edit Trek</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          name="name"
          value={trek.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="location"
          value={trek.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <textarea
          name="description"
          value={trek.description}
          onChange={handleChange}
          placeholder="Description"
          rows="3"
        />
        <select
          name="difficulty"
          value={trek.difficulty}
          onChange={handleChange}
        >
          <option value="EASY">EASY</option>
          <option value="MODERATE">MODERATE</option>
          <option value="HARD">HARD</option>
        </select>
        <input
          name="distance"
          type="number"
          value={trek.distance}
          onChange={handleChange}
          placeholder="Distance (km)"
        />
        <button type="submit">Update Trek</button>
      </form>
    </div>
  );
}
