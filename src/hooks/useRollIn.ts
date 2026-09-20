import { useEffect, useState } from 'react';

export function useRollIn(value: string, delay = 300) {
  const zeroed = value.replace(/\d/g, '0');
  const [display, setDisplay] = useState(zeroed);

  useEffect(() => {
    setDisplay(zeroed);

    let timeoutId: ReturnType<typeof setTimeout>;

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timeoutId = setTimeout(() => setDisplay(value), delay);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);

  return display;
}