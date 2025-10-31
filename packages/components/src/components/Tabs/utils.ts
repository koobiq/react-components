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
