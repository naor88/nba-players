import { useEffect, useState } from "react";

export const useCounter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);
    return () => clearTimeout(handler);
  });

  return { counter };
};
