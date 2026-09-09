'use client';

import { useRef, useState } from 'react';

import {
  mergeProps,
  polymorphicForwardRef,
  setRef,
  useElementOverflow,
  useEventListener,
  useIsomorphicEffect,
} from '@koobiq/react-core';

import { Tooltip } from '../../../Tooltip';
import { Typography } from '../../../Typography';
import type { TypographyBaseProps } from '../../../Typography';

type ListItemTextLineProps = TypographyBaseProps & {
  hideTooltip?: boolean;
};

export const ListItemTextLine = polymorphicForwardRef<
  'span',
  ListItemTextLineProps
>(({ children, hideTooltip, ...props }, forwardedRef) => {
  const { ref, isOverflowX } = useElementOverflow();
  const anchorRef = useRef<HTMLElement>(null);
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const canShow = isOverflowX && !hideTooltip && text.length > 0;

  useEventListener({
    eventName: 'pointerleave',
    element: anchorRef,
    handler: () => setIsOpen(false),
    active: isOpen,
  });

  useIsomorphicEffect(() => {
    setText(ref.current?.textContent ?? '');

    if (!canShow) setIsOpen(false);
  });

  return (
    <Tooltip
      // Keep this portal accessible while a menu or select popover is modal.
      data-react-aria-top-layer="true"
      anchorRef={anchorRef}
      style={{ pointerEvents: 'none' }}
      isDisabled={!canShow}
      isOpen={canShow && isOpen}
      onOpenChange={setIsOpen}
      control={({ ref: tooltipRef, ...tooltipProps }) => (
        <Typography
          as="span"
          {...mergeProps(props, tooltipProps)}
          ref={(element: HTMLElement | null) => {
            setRef(ref, element);
            setRef(forwardedRef, element);
            setRef(tooltipRef, element);

            anchorRef.current =
              element?.closest<HTMLElement>('[data-slot="list-item"]') ??
              element;
          }}
        >
          {children}
        </Typography>
      )}
    >
      {text}
    </Tooltip>
  );
});

ListItemTextLine.displayName = 'ListItemTextLine';
