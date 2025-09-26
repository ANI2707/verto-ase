import { PERFORMANCE_LEVELS, DIFFICULTY_LEVELS } from './constants';

// Format time from seconds to MM:SS
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Get performance level based on percentage
export const getPerformanceLevel = (percentage) => {
  for (const level of Object.values(PERFORMANCE_LEVELS)) {
    if (percentage >= level.min) {
      return level;
    }
  }
  return PERFORMANCE_LEVELS.NEEDS_IMPROVEMENT;
};

// Get difficulty level information
export const getDifficultyInfo = (level) => {
  return DIFFICULTY_LEVELS[level] || { label: 'Unknown', color: 'default' };
};

// Calculate quiz statistics
export const calculateQuizStats = (attempts) => {
  if (!attempts || attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      averageTime: 0,
    };
  }

  const totalAttempts = attempts.length;
  const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.total_questions) * 100, 0);
  const bestScore = Math.max(...attempts.map(attempt => (attempt.score / attempt.total_questions) * 100));
  const totalTime = attempts.reduce((sum, attempt) => sum + attempt.time_taken, 0);

  return {
    totalAttempts,
    averageScore: Math.round(totalScore / totalAttempts),
    bestScore: Math.round(bestScore),
    averageTime: Math.round(totalTime / totalAttempts),
  };
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random color
export const generateRandomColor = () => {
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Local storage helpers
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} to localStorage:`, error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// Array shuffle function
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Generate unique ID
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Get relative time
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};
