import { useState, useEffect } from 'react';

// Helper function to format the remaining time
const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const useCooldown = (cooldownEndTimestamp: string | null) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!cooldownEndTimestamp) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(cooldownEndTimestamp).getTime();
      const secondsRemaining = Math.round((endTime - now) / 1000);

      if (secondsRemaining <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
      } else {
        setTimeLeft(secondsRemaining);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [cooldownEndTimestamp]);

  return {
    isOnCooldown: timeLeft !== null && timeLeft > 0,
    timeLeftFormatted: timeLeft ? formatTime(timeLeft) : '',
  };
};