// hooks/Trek/useTreks.js
import { useState, useEffect } from 'react';
import * as api from '../../api/Trek/trekApi';

export default function useTreks() {
  const [treks, setTreks] = useState([]);

  const fetchTreks = async () => {
    try {
      const { data } = await api.getTreks();
      console.log('Fetched treks:', data);  // check shape: is it [{...}] or {data: [...]}
      setTreks(data); // adjust if needed
    } catch (error) {
      console.error('Failed to fetch treks:', error);
    }
  };

  useEffect(() => { fetchTreks(); }, []);

  return { treks, fetchTreks };
}
