'use client';

import { useRef } from 'react';

import { useIsomorphicEffect } from '@koobiq/react-core';

const DEFAULT_INLINE_SIZE_VARIABLE = '--kbq-autosize-inline-size';
const DEFAULT_FALLBACK_ATTRIBUTE = 'data-field-sizing-fallback';

const supportsFieldSizingContent = () =>
  typeof CSS !== 'undefined' && CSS.supports?.('field-sizing', 'content');

type UseFieldSizingFallbackOptions = {
  text: string;
  fallbackText?: string;
  inlineSizeVariable?: `--${string}`;
  fallbackAttribute?: `data-${string}`;
};

export const useFieldSizingFallback = (
  elementRef: { current: HTMLElement | null },
  options: UseFieldSizingFallbackOptions
) => {
  const mirrorRef = useRef<HTMLSpanElement | null>(null);

  const {
    fallbackAttribute = DEFAULT_FALLBACK_ATTRIBUTE,
    fallbackText,
    inlineSizeVariable = DEFAULT_INLINE_SIZE_VARIABLE,
    text,
  } = options;

  useIsomorphicEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    if (supportsFieldSizingContent()) {
      element.removeAttribute(fallbackAttribute);
      element.style.removeProperty(inlineSizeVariable);

      return;
    }

    let mirror = mirrorRef.current;

    if (!mirror) {
      mirror = document.createElement('span');
      mirrorRef.current = mirror;
      mirror.setAttribute('aria-hidden', 'true');

      Object.assign(mirror.style, {
        inset: '0 auto auto 0',
        overflow: 'hidden',
        pointerEvents: 'none',
        position: 'fixed',
        visibility: 'hidden',
        whiteSpace: 'pre',
      });

      document.body.append(mirror);
    }

    const styles = getComputedStyle(element);

    mirror.style.fontFamily = styles.fontFamily;
    mirror.style.fontFeatureSettings = styles.fontFeatureSettings;
    mirror.style.fontKerning = styles.fontKerning;
    mirror.style.fontSize = styles.fontSize;
    mirror.style.fontStretch = styles.fontStretch;
    mirror.style.fontStyle = styles.fontStyle;
    mirror.style.fontVariant = styles.fontVariant;
    mirror.style.fontWeight = styles.fontWeight;
    mirror.style.letterSpacing = styles.letterSpacing;
    mirror.style.lineHeight = styles.lineHeight;
    mirror.style.paddingInlineStart = styles.paddingInlineStart;
    mirror.style.paddingInlineEnd = styles.paddingInlineEnd;
    mirror.style.textTransform = styles.textTransform;
    mirror.style.wordSpacing = styles.wordSpacing;
    mirror.textContent = text || fallbackText || '';

    const width = Math.ceil(mirror.getBoundingClientRect().width) + 2;

    element.setAttribute(fallbackAttribute, '');
    element.style.setProperty(inlineSizeVariable, `${width}px`);
  }, [elementRef, text, fallbackText, fallbackAttribute, inlineSizeVariable]);

  useIsomorphicEffect(
    () => () => {
      mirrorRef.current?.remove();
      mirrorRef.current = null;
    },
    []
  );
};
