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
  mergeProps,
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
import { getRowsCount } from './utils';

type ContentStyle = CSSProperties & {
  '--clamped-text-rows': number;
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
      moreText,
      lessText,
      slotProps,
      className,
      ...other
    } = props;

    const rootRef = useObjectRef(ref);
    const [contentRef, contentRect] = useResizeObserver<HTMLDivElement>();
    const generatedContentId = useId();
    const contentId = slotProps?.content?.id ?? generatedContentId;
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

      const wasClamped = contentElement.classList.contains(s.clamped);

      if (wasClamped) {
        contentElement.classList.remove(s.clamped);

        // Flush the clamped layout before Range reads all line boxes.
        contentElement.getBoundingClientRect();
      }

      const nextRowsCount = getRowsCount(contentElement);

      contentElement.classList.toggle(s.clamped, wasClamped);

      setRowsCount(nextRowsCount);
    }, [children, rows, contentRect.width, contentRect.height, setRowsCount]);

    const isMeasured = rowsCount !== undefined;
    const hasToggle = isMeasured && rowsCount > rows + 1;

    const effectiveExpanded = isMeasured
      ? !hasToggle || preferredExpanded
      : preferredExpanded;

    const isClamped = isMeasured
      ? hasToggle && !effectiveExpanded
      : !preferredExpanded;

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
      ...slotProps?.content?.style,
      '--clamped-text-rows':
        !isMeasured && !preferredExpanded ? rows + 1 : rows,
    };

    const contentProps = mergeProps(
      {
        ref: contentRef,
        className: clsx(s.content, isClamped && s.clamped),
      },
      slotProps?.content,
      {
        id: contentId,
        style: contentStyle,
      }
    );

    const toggleProps = mergeProps(
      {
        className: s.toggle,
        onPress: onToggle,
      },
      slotProps?.toggle
    );

    return (
      <div
        {...other}
        ref={rootRef}
        className={clsx(s.base, className)}
        data-expanded={effectiveExpanded || undefined}
        data-overflowing={hasToggle || undefined}
        data-clamped={isClamped || undefined}
      >
        <div {...contentProps}>{children}</div>
        {hasToggle && (
          <Link
            {...toggleProps}
            as="button"
            type="button"
            aria-controls={contentId}
            aria-expanded={effectiveExpanded}
            startIcon={
              effectiveExpanded ? (
                <IconChevronUp16 aria-hidden />
              ) : (
                <IconChevronDown16 aria-hidden />
              )
            }
            isPseudo
          >
            {effectiveExpanded
              ? (lessText ?? strings.format('collapse'))
              : (moreText ?? strings.format('expand'))}
          </Link>
        )}
      </div>
    );
  }
);

ClampedText.displayName = 'ClampedText';
