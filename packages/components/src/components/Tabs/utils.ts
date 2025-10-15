import type { CSSProperties } from 'react';

export function getThumbCssVars(
  el: HTMLElement,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
): CSSProperties {
  const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = el;

  return {
    '--thumb-inline-size': `${offsetWidth}px`,
    '--thumb-block-size': `${offsetHeight}px`,
    '--thumb-transform':
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
