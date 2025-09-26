import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setTimeRemaining } from '../store/slices/quizSlice';

export const useTimer = (initialTime, onTimeUp) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let intervalId;

    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          dispatch(setTimeRemaining(newTime));
          
          if (newTime === 0) {
            onTimeUp?.();
            setIsRunning(false);
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, time, onTimeUp, dispatch]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newTime = initialTime) => {
    setTime(newTime);
    setIsRunning(false);
    dispatch(setTimeRemaining(newTime));
  }, [initialTime, dispatch]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    formatTime: () => formatTime(time),
  };
};
