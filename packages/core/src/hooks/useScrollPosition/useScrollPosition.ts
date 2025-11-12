import { useState, useEffect, useCallback } from 'react';

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
): [ScrollPosition, (params: Partial<ScrollPosition>) => void] {
  const [currentPosition, setCurrentPosition] = useState<ScrollPosition>(
    el
      ? getCurrentPosition(el)
      : {
          x: 0,
          y: 0,
        }
  );

  const setPosition = useCallback(
    ({ x, y }: Partial<ScrollPosition>) => {
      if (el) {
        const scrollOptions: ScrollToOptions = { behavior: 'smooth' };

        if (typeof x === 'number') scrollOptions.left = x;
        if (typeof y === 'number') scrollOptions.top = y;

        el.scrollTo(scrollOptions);
      }
    },
    [el]
  );

  useEffect(() => {
    if (!el) return undefined;

    const handleScroll = () => setCurrentPosition(getCurrentPosition(el));
    el.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => el.removeEventListener('scroll', handleScroll);
  }, [el]);

  return [currentPosition, setPosition];
}
