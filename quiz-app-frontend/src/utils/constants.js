// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Quiz Configuration
export const QUIZ_CONFIG = {
  DEFAULT_TIME_LIMIT: 600, // 10 minutes in seconds
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 20,
  PASSING_SCORE: 60, // percentage
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'QuizMaster',
  VERSION: '1.0.0',
  DESCRIPTION: 'Test Your Knowledge, Track Your Progress',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  QUIZ: '/quiz',
  RESULTS: '/results',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  QUIZ_STATE: 'quizState',
  THEME: 'theme',
  SETTINGS: 'settings',
};

// Quiz States
export const QUIZ_STATES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SUBMITTED: 'submitted',
};

// Performance Levels
export const PERFORMANCE_LEVELS = {
  EXCELLENT: { min: 90, label: 'Excellent', color: '#52c41a', emoji: '🏆' },
  VERY_GOOD: { min: 80, label: 'Very Good', color: '#1890ff', emoji: '⭐' },
  GOOD: { min: 70, label: 'Good', color: '#722ed1', emoji: '👍' },
  AVERAGE: { min: 60, label: 'Average', color: '#faad14', emoji: '👌' },
  NEEDS_IMPROVEMENT: { min: 0, label: 'Needs Improvement', color: '#ff4d4f', emoji: '💪' },
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  1: { label: 'Easy', color: 'green' },
  2: { label: 'Medium', color: 'blue' },
  3: { label: 'Hard', color: 'orange' },
  4: { label: 'Very Hard', color: 'red' },
  5: { label: 'Expert', color: 'purple' },
};

// Message Types
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
