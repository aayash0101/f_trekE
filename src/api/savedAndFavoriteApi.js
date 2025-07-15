import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/users';

// ---------- SAVED JOURNALS ----------

// Get all saved journals for a user
export const getSavedJournals = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}/${userId}/saved`);
  return res.data;
};

// Add a journal to saved list for a user
export const addSavedJournal = async (userId, journalId) => {
  const res = await axios.post(`${API_BASE_URL}/${userId}/saved/${journalId}`);
  return res.data;
};

// Remove a journal from saved list for a user
export const removeSavedJournal = async (userId, journalId) => {
  const res = await axios.delete(`${API_BASE_URL}/${userId}/saved/${journalId}`);
  return res.data;
};

// ---------- FAVORITE JOURNALS ----------

// Get all favorite journals for a user
export const getFavoriteJournals = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}/${userId}/favorites`);
  return res.data;
};

// Add a journal to favorite list for a user
export const addFavoriteJournal = async (userId, journalId) => {
  const res = await axios.post(`${API_BASE_URL}/${userId}/favorites/${journalId}`);
  return res.data;
};

// Remove a journal from favorite list for a user
export const removeFavoriteJournal = async (userId, journalId) => {
  const res = await axios.delete(`${API_BASE_URL}/${userId}/favorites/${journalId}`);
  return res.data;
};
