import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Points to your Express backend
  withCredentials: true,              // Ensures HTTP-only cookies (auth) pass correctly
});

export default API;