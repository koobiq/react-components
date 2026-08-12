'use client';

import {
  forwardRef,
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  clsx,
  useControlledState,
  useId,
  useIsomorphicEffect,
  useLocalizedStringFormatter,
  useObjectRef,
  useResizeObserver,
} from '@koobiq/react-core';
import { IconChevronDown16, IconChevronUp16 } from '@koobiq/react-icons';

import { Link } from '../Link';

import s from './ClampedText.module.css';
import intlMessages from './intl.json';
import type { ClampedTextProps, ClampedTextRef } from './types';

type ContentStyle = CSSProperties & {
  '--clamped-text-rows': number;
};

const getRowsCount = (element: HTMLElement) => {
  const range = document.createRange();
  const textNodes = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const rowTops = new Set<number>();
  let textNode = textNodes.nextNode();

  while (textNode) {
    if (textNode.textContent?.trim()) {
      range.selectNodeContents(textNode);

      Array.from(range.getClientRects()).forEach(({ top }) => {
        rowTops.add(top);
      });
    }

    textNode = textNodes.nextNode();
  }

  return rowTops.size;
};

/**
 * ClampedText truncates long text to a configurable number of rows and lets
 * the user expand or collapse it.
 */
export const ClampedText = forwardRef<ClampedTextRef, ClampedTextProps>(
  (props, ref) => {
    const {
      children,
      rows = 5,
      isExpanded,
      defaultExpanded,
      onExpandedChange,
      className,
      ...other
    } = props;

    const rootRef = useObjectRef(ref);
    const [contentRef, contentRect] = useResizeObserver<HTMLDivElement>();
    const contentId = useId();
    const strings = useLocalizedStringFormatter(intlMessages);

    const [preferredExpanded, setPreferredExpanded] = useControlledState(
      isExpanded,
      defaultExpanded ?? false,
      onExpandedChange
    );

    const [rowsCount, setRowsCount] = useState<number>();

    const shouldScrollOnCollapseRef = useRef(false);

    useIsomorphicEffect(() => {
      const contentElement = contentRef.current;

      if (!contentElement) return;

      setRowsCount(getRowsCount(contentElement));
    }, [children, rows, contentRect.width, contentRect.height, setRowsCount]);

    const isMeasured = rowsCount !== undefined;
    const hasToggle = isMeasured && rowsCount > rows + 1;

    const effectiveExpanded = isMeasured
      ? !hasToggle || preferredExpanded
      : true;

    const isClamped = hasToggle && !effectiveExpanded;

    useEffect(() => {
      if (!isClamped || !shouldScrollOnCollapseRef.current) return;

      shouldScrollOnCollapseRef.current = false;

      const timeoutId = window.setTimeout(() => {
        rootRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      });

      return () => window.clearTimeout(timeoutId);
    }, [isClamped, rootRef]);

    const onToggle = () => {
      const nextExpanded = !preferredExpanded;

      shouldScrollOnCollapseRef.current = !nextExpanded;
      setPreferredExpanded(nextExpanded);
    };

    const contentStyle: ContentStyle = {
      '--clamped-text-rows': rows,
    };

    return (
      <div
        {...other}
        ref={rootRef}
        className={clsx(s.base, className)}
        data-expanded={effectiveExpanded || undefined}
        data-overflowing={hasToggle || undefined}
        data-clamped={isClamped || undefined}
      >
        <div
          ref={contentRef}
          id={contentId}
          className={clsx(s.content, isClamped && s.clamped)}
          style={contentStyle}
        >
          {children}
        </div>

        {hasToggle && (
          <Link
            as="button"
            type="button"
            isPseudo
            className={s.toggle}
            aria-controls={contentId}
            aria-expanded={effectiveExpanded}
            onPress={onToggle}
            startIcon={
              effectiveExpanded ? (
                <IconChevronUp16 aria-hidden />
              ) : (
                <IconChevronDown16 aria-hidden />
              )
            }
          >
            {strings.format(effectiveExpanded ? 'collapse' : 'expand')}
          </Link>
        )}
      </div>
    );
  }
);

ClampedText.displayName = 'ClampedText';
