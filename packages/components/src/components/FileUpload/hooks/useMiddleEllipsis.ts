'use client';

import { useMemo } from 'react';

import { useResizeObserver } from '@koobiq/react-core';

const ELLIPSIS = '…';
const contexts = new WeakMap<Document, CanvasRenderingContext2D>();

const getContext = (document: Document): CanvasRenderingContext2D | null => {
  const cached = contexts.get(document);

  if (cached) return cached;

  const context = document.createElement('canvas').getContext('2d');

  if (context) contexts.set(document, context);

  return context;
};

const truncateMiddle = (
  value: string,
  availableWidth: number,
  measure: (text: string) => number
): string => {
  const characters = Array.from(value);
  const ellipsisWidth = measure(ELLIPSIS);
  const partWidth = Math.max(0, (availableWidth - ellipsisWidth) / 2);

  const findLength = (fromEnd: boolean): number => {
    let min = 0;
    let max = characters.length;

    while (min < max) {
      const length = Math.ceil((min + max) / 2);

      const part = fromEnd
        ? characters.slice(-length).join('')
        : characters.slice(0, length).join('');

      if (measure(part) <= partWidth) {
        min = length;
      } else {
        max = length - 1;
      }
    }

    return min;
  };

  const startLength = findLength(false);
  const endLength = findLength(true);

  if (startLength + endLength >= characters.length) return value;

  const start = characters.slice(0, startLength).join('');
  const end = endLength > 0 ? characters.slice(-endLength).join('') : '';

  return `${start}${ELLIPSIS}${end}`;
};

export function useMiddleEllipsis<T extends HTMLElement = HTMLElement>(
  value: string
) {
  const [ref, rect] = useResizeObserver<T>();
  const element = ref.current;

  const result = useMemo(() => {
    const availableWidth = element?.clientWidth || rect.width;

    if (!element || availableWidth <= 0 || value.length === 0) {
      return { text: value, isOverflow: false };
    }

    const context = getContext(element.ownerDocument);
    const view = element.ownerDocument.defaultView;

    if (!context || !view) {
      return { text: value, isOverflow: false };
    }

    const style = view.getComputedStyle(element);

    context.font =
      style.font || `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

    const measure = (text: string) => context.measureText(text).width;
    const isOverflow = measure(value) > availableWidth;

    const text = isOverflow
      ? truncateMiddle(value, availableWidth, measure)
      : value;

    return { text, isOverflow };
  }, [element, rect.width, value]);

  return { ref, ...result };
}
