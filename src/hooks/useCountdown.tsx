import { useState, useEffect } from "react";

export const useCountdown = (initialTimer: number) => {
  const [timer, setTimer] = useState(initialTimer);

  const reset = () => {
    setTimer(initialTimer);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [timer]);

  return { timer, reset };
};
