import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/journals';

/**
 * Get journal entries for a specific trek and user
 * @param {string} trekId 
 * @param {string} userId 
 */
export async function getJournalEntries(trekId, userId) {
  const res = await axios.get(`${BASE_URL}/${trekId}/${userId}`);
  return res.data;
}

/**
 * Get all journal entries (public feed)
 */
export async function getAllJournals() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

/**
 * Get all journal entries by a specific user (for profile page)
 * @param {string} userId
 */
export async function getUserJournals(userId) {
  const res = await axios.get(`${BASE_URL}/user/${userId}`);
  return res.data;
}

/**
 * Add a new journal entry (with optional photos)
 * @param {object} entryData - includes userId, trekId, date, text, etc.
 * @param {File[]} photoFiles - array of File objects
 */
export async function addJournalEntry(entryData, photoFiles = []) {
  if (photoFiles.length > 0) {
    const formData = new FormData();
    formData.append('userId', entryData.userId);
    formData.append('trekId', entryData.trekId);
    formData.append('date', entryData.date);
    formData.append('text', entryData.text);

    // append existing photo URLs if editing
    entryData.photos?.forEach(url => formData.append('photos', url));

    // append new uploaded files
    photoFiles.forEach(file => formData.append('photos', file));

    const res = await axios.post(BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } else {
    const res = await axios.post(BASE_URL, entryData);
    return res.data;
  }
}

/**
 * Update a journal entry by ID (with optional new photos)
 * @param {string} entryId 
 * @param {object} updatedData 
 * @param {File[]} newPhotoFiles 
 */
export async function updateJournalEntry(entryId, updatedData, newPhotoFiles = []) {
  if (newPhotoFiles.length > 0) {
    const formData = new FormData();
    formData.append('date', updatedData.date);
    formData.append('text', updatedData.text);

    updatedData.photos?.forEach(url => formData.append('photos', url));
    newPhotoFiles.forEach(file => formData.append('photos', file));

    const res = await axios.put(`${BASE_URL}/${entryId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } else {
    const res = await axios.put(`${BASE_URL}/${entryId}`, updatedData);
    return res.data;
  }
}

/**
 * Delete a journal entry by ID
 * @param {string} entryId 
 */
export async function deleteJournalEntry(entryId) {
  const res = await axios.delete(`${BASE_URL}/${entryId}`);
  return res.data;
}
