'use client';

import { forwardRef, useEffect, useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';

import { once } from '@koobiq/logger';
import {
  clsx,
  mergeProps,
  useFocusRing,
  useHover,
  useId,
  useLocalizedStringFormatter,
  useMove,
  useObjectRef,
} from '@koobiq/react-core';

import intlMessages from './intl.json';
import s from './Splitter.module.css';
import {
  SplitterPanelContext,
  useSplitterPanelContext,
} from './SplitterContext';
import type { SplitterPanelBaseProps, SplitterPropSize } from './types';
import { resolveSplitterSize } from './utils';

export const SplitterPanel = forwardRef<HTMLDivElement, SplitterPanelBaseProps>(
  (props, ref) => {
    const {
      id: idProp,
      size,
      minSize,
      maxSize,
      snapSizes,
      collapsedSize,
      /* eslint-disable @typescript-eslint/no-unused-vars -- read by the splitter from the element, kept off the DOM */
      snapTolerance,
      isCollapsible,
      isCollapsed,
      defaultCollapsed,
      onCollapsedChange,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      slotProps,
      className,
      children,
      ...other
    } = props;

    const generatedId = useId();
    const id = idProp ?? generatedId;
    const context = useSplitterPanelContext();
    const separatorSlotProps = slotProps?.separator;
    const separatorRef = useObjectRef(separatorSlotProps?.ref);
    const t = useLocalizedStringFormatter(intlMessages);

    const isDisabled = context?.isDisabled ?? true;
    // A panel outside a splitter, or wrapped in another element, has no boundary of its own.
    const hasSeparator = context !== null && !context.isLast;

    // Set by the gesture itself, before the splitter renders the drag.
    const isMovingRef = useRef(false);

    const { moveProps } = useMove({
      onMoveStart: () => {
        isMovingRef.current = true;
        context?.onResizeStart();
      },
      onMove: (event) => context?.onResize(event),
      onMoveEnd: () => {
        isMovingRef.current = false;
        context?.onResizeEnd();
      },
    });

    const isResizing = context?.isResizing ?? false;
    const onResizeCancel = context?.onResizeCancel;

    // Unmounting mid-drag drops the listeners of `useMove` without a move end.
    useEffect(() => {
      const moving = isMovingRef;

      return () => {
        if (moving.current) onResizeCancel?.();
      };
    }, [onResizeCancel]);

    // A size in another unit would otherwise leave the panel without its limit and nothing to say why.
    useEffect(() => {
      if (process.env.NODE_ENV === 'production') return;

      const sizes: [string, SplitterPropSize | undefined][] = [
        ['size', size],
        ['minSize', minSize],
        ['maxSize', maxSize],
        ['collapsedSize', collapsedSize],
        ...(snapSizes ?? []).map((item): [string, SplitterPropSize] => [
          'snapSizes',
          item,
        ]),
      ];

      sizes.forEach(([name, value]) => {
        if (value === undefined || resolveSplitterSize(value, 0) !== null) {
          return;
        }

        once.warn(
          `Splitter.Panel: \`${name}\` "${value}" is ignored. A size is a number of pixels, ` +
            'a "<number>px" string, a "<number>%" share of the splitter ' +
            'or a "<number>vw" / "<number>vh" share of the viewport.'
        );
      });
    }, [size, minSize, maxSize, collapsedSize, snapSizes]);

    const { hoverProps, isHovered } = useHover({ isDisabled });

    const { focusProps, isFocusVisible } = useFocusRing();

    // Pressing focuses the separator, so the arrows work after a drag.
    // `preventScroll`: once the panel beyond collapses to nothing, half of the
    // hit area hangs outside the splitter, and revealing it would shift the box
    // the splitter sits in.
    const focusSeparator = () =>
      separatorRef.current?.focus({ preventScroll: true });

    // `useMove` moves by a pixel per arrow; the splitter has keys of its own.
    const pointerMoveProps = { ...moveProps, onKeyDown: undefined };

    const interactionProps = isDisabled
      ? {}
      : mergeProps(pointerMoveProps, hoverProps, {
          onPointerDown: (event: PointerEvent<HTMLElement>) => {
            // Uncaptured, a release over an iframe never reaches the window, and the drag goes on.
            if (event.button === 0) {
              event.currentTarget.setPointerCapture?.(event.pointerId);
            }

            focusSeparator();
          },
          onMouseDown: focusSeparator,
          onKeyDown: context?.onSeparatorKeyDown,
          onDoubleClick: (event: MouseEvent) => {
            event.preventDefault();
            context?.onSeparatorDoubleClick();
          },
        });

    const separator = hasSeparator && (
      <div
        {...mergeProps(separatorSlotProps, interactionProps, focusProps)}
        ref={separatorRef}
        role="separator"
        aria-controls={id}
        aria-disabled={isDisabled || undefined}
        aria-label={
          separatorSlotProps?.['aria-label'] ?? t.format('resize panels')
        }
        aria-orientation={
          context.orientation === 'horizontal' ? 'vertical' : 'horizontal'
        }
        aria-valuenow={context.separatorValues.now}
        aria-valuemin={context.separatorValues.min}
        aria-valuemax={context.separatorValues.max}
        tabIndex={isDisabled ? -1 : 0}
        data-slot="splitter-separator"
        data-hovered={isHovered || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-resizing={isResizing || undefined}
        className={clsx(
          s.separator,
          isHovered && s.hovered,
          isResizing && s.active,
          isFocusVisible && s.focusVisible,
          separatorSlotProps?.className
        )}
        style={{
          cursor: context.separatorCursor,
          ...separatorSlotProps?.style,
        }}
      />
    );

    return (
      <div
        {...other}
        ref={ref}
        id={id}
        // Focusable for `F6` only.
        tabIndex={-1}
        data-slot="splitter-panel"
        data-collapsed={context?.isCollapsed || undefined}
        className={clsx(s.panel, className)}
      >
        <div
          {...slotProps?.content}
          className={clsx(s.content, slotProps?.content?.className)}
        >
          {/* A nested panel belongs to a nested splitter, not to this one. */}
          <SplitterPanelContext.Provider value={null}>
            {children}
          </SplitterPanelContext.Provider>
        </div>
        {separator}
      </div>
    );
  }
);

SplitterPanel.displayName = 'Splitter.Panel';
