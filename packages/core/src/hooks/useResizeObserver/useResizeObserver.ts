'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type ObserverRect = Omit<DOMRectReadOnly, 'toJSON'>;

const defaultState: ObserverRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useResizeObserver<T extends HTMLElement = any>(
  options?: ResizeObserverOptions
) {
  const frameID = useRef(0);
  const ref = useRef<T>(null);

  const [rect, setRect] = useState<ObserverRect>(defaultState);

  const observer = useMemo(
    () =>
      typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined'
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          new ResizeObserver((entries: any) => {
            const entry = entries[0];

            if (entry) {
              cancelAnimationFrame(frameID.current);

              frameID.current = requestAnimationFrame(() => {
                if (ref.current) {
                  setRect(entry.contentRect);
                }
              });
            }
          })
        : null,
    []
  );

  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current, options);
    }

    return () => {
      observer?.disconnect();

      if (frameID.current) {
        cancelAnimationFrame(frameID.current);
      }
    };
  }, [ref.current]);

  return [ref, rect] as const;
}
