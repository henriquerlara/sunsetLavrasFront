import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true // Importante para enviar cookies
});

export default axiosInstance;
