import type { CSSProperties } from 'react';

export function getToggleButtonStyle(
  start: [number, number] = [0, 0],
  end: [number, number] = [0, 0]
): CSSProperties {
  const [startX, startSize] = start;
  const [endX, endSize] = end;

  return {
    '--thumb-inline-size-start': `${startSize}px`,
    '--thumb-inline-size-end': `${endSize}px`,
    '--thumb-transform-start': `translateX(${startX}px)`,
    '--thumb-transform-end': `translateX(${endX}px)`,
  } as CSSProperties;
}

export function getSelectedToggleButton(
  root: HTMLElement | null
): HTMLElement | null {
  return root
    ? root.querySelector<HTMLElement>(
        '[role="radio"][data-selected="true"] > span'
      )
    : null;
}
