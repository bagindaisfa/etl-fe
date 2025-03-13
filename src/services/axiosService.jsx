import axios from 'axios';
import { message } from 'antd';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Allows sending cookies
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error('Session expired. Redirecting to login...');

        // Redirect to login page
        window.location.href = '/login'; // or use react-router navigate if inside a component
      } else {
        console.error(error.response.data.message || 'Something went wrong');
      }
    } else {
      console.error('Network error. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default api;
