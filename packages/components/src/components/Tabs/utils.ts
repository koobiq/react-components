import type { CSSProperties } from 'react';

export function getIndicatorCssVars(
  el: HTMLElement,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
): CSSProperties {
  const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = el;

  return {
    '--indicator-inline-size': `${offsetWidth}px`,
    '--indicator-block-size': `${offsetHeight}px`,
    '--indicator-transform':
      orientation === 'horizontal'
        ? `translateX(${offsetLeft}px)`
        : `translateY(${offsetTop}px)`,
  } as CSSProperties;
}

export function getActiveTab(root: HTMLElement | null): HTMLElement | null {
  return root
    ? root.querySelector<HTMLElement>('[role="tab"][data-selected="true"]')
    : null;
}

export function getVisibleTabsRange({
  tabsSizes,
  containerWidth,
  scrollX,
}: {
  tabsSizes: number[];
  scrollX: number;
  containerWidth: number;
}): [number, number] {
  let firstVisibleTabId = null;
  let lastVisibleTabId = null;

  const containerLeftSide = scrollX;

  const containerRightSide = containerLeftSide + containerWidth;

  for (let id = 0; id < tabsSizes.length; id++) {
    const previousTabsWidth = tabsSizes
      .slice(0, id)
      .reduce((acc, n) => acc + n, 0);

    const isTabLeftSideVisible = previousTabsWidth >= containerLeftSide;

    if (isTabLeftSideVisible && firstVisibleTabId === null) {
      firstVisibleTabId = id;
    }

    const tabElRightSide = previousTabsWidth + tabsSizes[id];

    const isTabRightSideVisible = tabElRightSide <= containerRightSide;

    if (isTabRightSideVisible) {
      lastVisibleTabId = id;
    }
  }

  firstVisibleTabId = firstVisibleTabId ?? 0;
  lastVisibleTabId = Math.max(firstVisibleTabId, lastVisibleTabId ?? 0);

  return [firstVisibleTabId, lastVisibleTabId];
}
