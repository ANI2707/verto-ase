import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
};

// Quiz API
export const quizApi = {
  getCategories: () => apiClient.get('/quiz/categories'),
  startQuiz: (data) => apiClient.post('/quiz/start', data),
  submitQuiz: (data) => apiClient.post('/quiz/submit', data),
};

// Leaderboard API
export const leaderboardApi = {
  getLeaderboard: (categoryId) => {
    const params = categoryId ? { categoryId } : {};
    return apiClient.get('/leaderboard', { params });
  },
  getUserStats: (userId) => apiClient.get(`/leaderboard/user/${userId}`),
};
