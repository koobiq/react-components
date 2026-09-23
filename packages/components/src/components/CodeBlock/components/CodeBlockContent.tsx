'use client';

import type {
  ComponentPropsWithRef,
  ReactNode,
  Ref,
  UIEventHandler,
} from 'react';

import { clsx, mergeProps, mergeRefs } from '@koobiq/react-core';

import { utilClasses } from '../../../styles/utility';
import s from '../CodeBlock.module.css';

const { nativeScrollbar } = utilClasses;

export type CodeBlockContentProps = {
  contentRef: Ref<HTMLDivElement>;
  /** Accessible name of the region, taken from the file name. */
  'aria-label': string;
  /** Whether the content overflows and therefore has to be reachable by keyboard. */
  isFocusable: boolean;
  maxHeight?: number;
  onScroll: UIEventHandler<HTMLDivElement>;
  children?: ReactNode;
  slotProps?: Omit<ComponentPropsWithRef<'div'>, 'children'>;
};

/**
 * The scrollable region with the code of a `CodeBlock` without tabs. With tabs, that region is the
 * tab panel rendered by `CodeBlockTabs`.
 */
export function CodeBlockContent(props: CodeBlockContentProps) {
  const {
    contentRef,
    'aria-label': ariaLabel,
    isFocusable,
    maxHeight,
    onScroll,
    children,
    slotProps,
  } = props;

  const { ref: slotRef, style: slotStyle, ...restSlotProps } = slotProps ?? {};

  return (
    <div
      {...mergeProps(
        {
          className: clsx(s.main, nativeScrollbar),
          role: 'region',
          'aria-label': ariaLabel,
          // A scrollable region has to be keyboard-focusable when its content overflows.
          tabIndex: isFocusable ? 0 : -1,
          onScroll,
        },
        restSlotProps
      )}
      ref={mergeRefs(contentRef, slotRef)}
      style={{ maxHeight, ...slotStyle }}
    >
      {children}
    </div>
  );
}
