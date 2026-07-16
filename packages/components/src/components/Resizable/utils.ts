import type { CSSProperties } from 'react';

import type { ResizableHandleDirection } from './hooks';

const handleSize = 'var(--kbq-resizable-handle-size)';

export const getHandlePositionStyle = ([
  x,
  y,
]: ResizableHandleDirection): CSSProperties => {
  const style: CSSProperties = {
    width: x === 0 ? '100%' : handleSize,
    height: y === 0 ? '100%' : handleSize,
  };

  const translateX = x === -1 ? '-50%' : x === 1 ? '50%' : '0';
  const translateY = y === -1 ? '-50%' : y === 1 ? '50%' : '0';

  if (x === -1) style.left = 0;
  if (x === 0) style.left = 0;
  if (x === 1) style.right = 0;
  if (y === -1) style.top = 0;
  if (y === 0) style.top = 0;
  if (y === 1) style.bottom = 0;

  style.transform = `translate(${translateX}, ${translateY})`;

  return style;
};
