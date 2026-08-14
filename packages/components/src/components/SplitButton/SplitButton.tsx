'use client';

import { Children, cloneElement, isValidElement, useMemo } from 'react';
import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ReactElement,
} from 'react';

import {
  clsx,
  polymorphicForwardRef,
  useElementSize,
  useMultiRef,
} from '@koobiq/react-core';

import { ButtonGroup } from '../ButtonGroup/index.js';

import s from './SplitButton.module.css';
import type { SplitButtonBaseProps } from './types.js';

type MenuElement = ReactElement<{
  slotProps?: {
    popover?: { size?: string; style?: CSSProperties } & Record<
      string,
      unknown
    >;
  } & Record<string, unknown>;
}>;

/** The SplitButton combines a primary action with a menu of related actions. */
export const SplitButton = polymorphicForwardRef<'div', SplitButtonBaseProps>(
  (props, ref) => {
    const {
      as = 'div',
      variant = 'fade-contrast-filled',
      isDisabled,
      panelAutoWidth = false,
      className,
      children,
      ...other
    } = props;

    const { ref: sizeRef, width } = useElementSize<HTMLDivElement>();
    const mergedRef = useMultiRef([ref, sizeRef]);

    const content = useMemo(() => {
      // Always resolve through Children.toArray, even when the menu isn't
      // cloned below, so the menu keeps the same React key across renders —
      // otherwise it would remount (losing its open state) the moment
      // `width` first goes from 0 to a real measurement.
      const [primary, menu] = Children.toArray(children);

      if (!panelAutoWidth || !width || !isValidElement(menu)) {
        return [primary, menu];
      }

      const menuElement = menu as MenuElement;

      return [
        primary,
        cloneElement(menuElement, {
          slotProps: {
            ...menuElement.props.slotProps,
            popover: {
              size: `${width}px`,
              ...menuElement.props.slotProps?.popover,
              // Menu's own popover has a 200px min-inline-size floor
              // (Menu.module.css), which otherwise silently defeats
              // matching for any split button narrower than that.
              style: {
                minInlineSize: 0,
                ...menuElement.props.slotProps?.popover?.style,
              },
            },
          },
        }),
      ];
    }, [children, panelAutoWidth, width]);

    return (
      <ButtonGroup
        as={as}
        variant={variant}
        isDisabled={isDisabled}
        className={clsx(s.base, className)}
        data-panel-auto-width={panelAutoWidth || undefined}
        {...other}
        ref={mergedRef}
      >
        {content}
      </ButtonGroup>
    );
  }
);

SplitButton.displayName = 'SplitButton';

export type SplitButtonProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof SplitButton<As>>;
