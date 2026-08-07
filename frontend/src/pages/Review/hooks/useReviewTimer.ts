import { useState, useEffect } from 'react';

export function useReviewTimer(isLoading: boolean, error: string | null, isFinished: boolean, isPaused: boolean) {
  const [reviewStats, setReviewStats] = useState({ correct: 0, dueNext: 0 });
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isLoading || error || isFinished || isPaused) return;
    
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, error, isFinished, isPaused]);

  return { reviewStats, setReviewStats, elapsedTime, setElapsedTime };
}