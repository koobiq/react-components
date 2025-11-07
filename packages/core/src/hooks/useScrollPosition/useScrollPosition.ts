import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';

export type ScrollPosition = {
  x: number;
  y: number;
};

const getCurrentPosition = (el: HTMLElement): ScrollPosition => ({
  x: el.scrollLeft,
  y: el.scrollTop,
});

export function useScrollPosition(
  el: HTMLElement | null
): [ScrollPosition, Dispatch<SetStateAction<ScrollPosition>>] {
  const [currentPosition, setCurrentPosition] = useState<ScrollPosition>(
    el
      ? getCurrentPosition(el)
      : {
          x: 0,
          y: 0,
        }
  );

  useEffect(() => {
    if (!el) return undefined;

    const handleScroll = () => setCurrentPosition(getCurrentPosition(el));
    el.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => el.removeEventListener('scroll', handleScroll);
  }, [el]);

  return [currentPosition, setCurrentPosition];
}
