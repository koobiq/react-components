'use client';

import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { once } from '@koobiq/logger';
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

import s from './ClampedText.module.css';
import { ClampedTextTrigger } from './components';
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

    const normalizedRows = Number.isFinite(rows)
      ? Math.max(1, Math.trunc(rows))
      : 1;

    if (
      process.env.NODE_ENV !== 'production' &&
      (!Number.isInteger(rows) || rows < 1)
    ) {
      once.warn(
        'ClampedText: the "rows" prop must be a positive integer. The received value was normalized.'
      );
    }

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

    const scrollTimeoutRef = useRef<number | undefined>(undefined);

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
    }, [
      children,
      normalizedRows,
      contentRect.width,
      contentRect.height,
      setRowsCount,
    ]);

    const isMeasured = rowsCount !== undefined;

    // A single additional row is shown in full because a toggle would occupy
    // the same vertical space without revealing more content.
    const hasToggle = isMeasured && rowsCount > normalizedRows + 1;

    const effectiveExpanded = isMeasured
      ? !hasToggle || preferredExpanded
      : preferredExpanded;

    const isClamped = isMeasured
      ? hasToggle && !effectiveExpanded
      : !preferredExpanded;

    useEffect(() => {
      return () => window.clearTimeout(scrollTimeoutRef.current);
    }, []);

    const onToggle = () => {
      const nextExpanded = !preferredExpanded;

      window.clearTimeout(scrollTimeoutRef.current);

      setPreferredExpanded(nextExpanded);

      if (!nextExpanded) {
        scrollTimeoutRef.current = window.setTimeout(() => {
          const rootElement = rootRef.current;

          if (!rootElement?.hasAttribute('data-clamped')) return;

          rootElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        });
      }
    };

    const contentStyle: ContentStyle = {
      ...slotProps?.content?.style,
      '--clamped-text-rows':
        !isMeasured && !preferredExpanded ? normalizedRows + 1 : normalizedRows,
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

    const { icon: iconProp, ...toggleSlotProps } = slotProps?.toggle ?? {};

    let toggleIcon: ReactNode;

    if (iconProp === undefined) {
      toggleIcon = effectiveExpanded ? (
        <IconChevronUp16 />
      ) : (
        <IconChevronDown16 />
      );
    } else if (typeof iconProp === 'function') {
      toggleIcon = iconProp(effectiveExpanded);
    } else {
      toggleIcon = iconProp;
    }

    const toggleProps = mergeProps(
      {
        'aria-controls': contentId,
        'aria-expanded': effectiveExpanded,
        onPress: onToggle,
      },
      toggleSlotProps,
      {
        children: effectiveExpanded
          ? (lessText ?? strings.format('collapse'))
          : (moreText ?? strings.format('expand')),
        icon: toggleIcon,
      }
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
        {hasToggle && <ClampedTextTrigger {...toggleProps} />}
      </div>
    );
  }
);

ClampedText.displayName = 'ClampedText';
