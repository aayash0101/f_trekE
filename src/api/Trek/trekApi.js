import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/treks' });

export const getTreks = () => API.get('/');
export const getTrek = (id) => API.get(`/${id}`);
export const addTrek = (formData) => {
  return API.post('/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const updateTrek = (id, trek) => API.put(`/${id}`, trek);
export const deleteTrek = (id) => API.delete(`/${id}`);
