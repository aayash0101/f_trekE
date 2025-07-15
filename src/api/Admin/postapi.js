// src/api/postApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; // Update if your backend uses a different path

const postApi = {
  signup: (userData) => axios.post(`${BASE_URL}/users/signup`, userData),

  login: (credentials) => axios.post(`${BASE_URL}/users/login`, credentials),

  addTrek: (trekData) => axios.post(`${BASE_URL}/treks`, trekData),

  bookTrek: (bookingData) => axios.post(`${BASE_URL}/bookings`, bookingData),

  submitReview: (reviewData) => axios.post(`${BASE_URL}/reviews`, reviewData),

  assignExercise: (exerciseData) => axios.post(`${BASE_URL}/exercises`, exerciseData),
};

export default postApi;
