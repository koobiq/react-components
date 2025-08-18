'use client';

import type { RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';

import { useMutableRef } from '../useMutableRef';

export const useResizeObserverRefs = <
  Element extends HTMLElement | SVGGraphicsElement,
  ReturnType,
>(
  refs: Array<RefObject<Element>>,
  mapper: (el: Element | null) => ReturnType
): ReturnType[] => {
  const calculateDimensionsRef = useMutableRef(() =>
    refs.map((ref) => mapper(ref.current))
  );

  const [dimensions, setDimensions] = useState<ReturnType[]>(
    calculateDimensionsRef.current
  );

  useLayoutEffect(() => {
    setDimensions(calculateDimensionsRef.current);
  }, [refs]);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setDimensions(calculateDimensionsRef.current);
    });

    for (const ref of refs) {
      if (ref.current) resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [refs]);

  return dimensions;
};
