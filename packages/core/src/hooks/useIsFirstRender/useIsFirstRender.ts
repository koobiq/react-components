'use client';

import { useRef } from 'react';

export function useIsFirstRender() {
  const renderRef = useRef(true);

  if (renderRef.current) {
    renderRef.current = false;

    return true;
  }

  return renderRef.current;
}
