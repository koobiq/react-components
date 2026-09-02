'use client';

import { useCallback, useState } from 'react';
import type { UIEvent } from 'react';

/** Tracks whether a scrollable element is scrolled away from its top, to drive a header shadow. */
export function useOverflowShadow() {
  const [isScrolled, setIsScrolled] = useState(false);

  const onScroll = useCallback((event: UIEvent<HTMLElement>) => {
    setIsScrolled(event.currentTarget.scrollTop > 0);
  }, []);

  // A remounted scroll container (`Tabs` re-creates the panel on tab change) starts at the top
  // without firing a scroll event, so the shadow has to be dropped explicitly.
  const resetShadow = useCallback(() => setIsScrolled(false), []);

  return { isScrolled, onScroll, resetShadow };
}
