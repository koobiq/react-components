'use client';

import { useEffect, useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

import { useResizeObserver } from '@koobiq/react-core';
import type { ExtraProps } from 'react-markdown';

export type MarkdownTableProps = ComponentPropsWithoutRef<'table'> & ExtraProps;

/**
 * A table wider than the content area scrolls, and a scroll region has to be
 * keyboard-focusable. Chrome and Firefox focus such a region on their own,
 * Safari does not, so the table takes a tab stop while it has something to
 * scroll.
 */
export const MarkdownTable = ({
  // The mdast node react-markdown passes in; it must not reach the DOM.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  node,
  children,
  ...other
}: MarkdownTableProps) => {
  const [ref, { width }] = useResizeObserver<HTMLTableElement>();
  const [isScrollable, setIsScrollable] = useState(false);

  // Measured after the commit: the overflow is known only once the table is in the DOM.
  useEffect(() => {
    const element = ref.current;

    setIsScrollable(
      element != null && element.scrollWidth > element.clientWidth
    );
  }, [ref, width, children]);

  return (
    <table
      {...other}
      ref={ref}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the table is the scroll region itself, and a role would drop its table semantics
      tabIndex={isScrollable ? 0 : undefined}
    >
      {children}
    </table>
  );
};

MarkdownTable.displayName = 'MarkdownTable';
