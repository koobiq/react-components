'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import {
  useDOMRef,
  mergeProps,
  filterDOMProps,
  polymorphicForwardRef,
} from '@koobiq/react-core';
import {
  useContextProps,
  ButtonContext,
  useRenderProps,
} from 'react-aria-components';

import { useButton } from '../../behaviors';

import type { ButtonBaseProps } from './types';

/**
 * A button primitive allows a user to perform an action, supporting mouse,
 * touch, and keyboard interactions.
 */
export const Button = polymorphicForwardRef<'button', ButtonBaseProps>(
  (props, ref) => {
    const [ctxProps, ctxRef] = useContextProps(props, ref, ButtonContext);

    const {
      as,
      tabIndex,
      isLoading,
      isDisabled,
      value,
      name,
      form,
      formAction,
      formEncType,
      formMethod,
      formNoValidate,
      formTarget,
    } = ctxProps;

    const Tag = as || 'button';

    const domRef = useDOMRef(ctxRef);

    const { isHovered, isPressed, isFocused, isFocusVisible, buttonProps } =
      useButton(
        {
          ...ctxProps,
          ...((isLoading || isDisabled) && {
            onPress: undefined,
            onPressStart: undefined,
            onPressEnd: undefined,
            onPressChange: undefined,
            onPressUp: undefined,
            onKeyDown: undefined,
            onKeyUp: undefined,
            onClick: undefined,
            href: undefined,
          }),
          elementType: as,
        },
        domRef
      );

    const renderValues = {
      isHovered,
      isPressed,
      isFocused,
      isFocusVisible,
      isLoading: isLoading || false,
      isDisabled: isDisabled || false,
    };

    const renderProps = useRenderProps({
      ...props,
      values: renderValues,
    });

    const DOMProps = filterDOMProps(props, { global: true });
    delete DOMProps.onClick;

    return (
      <Tag
        {...{
          name,
          value,
          form,
          formAction,
          formEncType,
          formMethod,
          formTarget,
          formNoValidate,
        }}
        {...mergeProps(DOMProps, buttonProps)}
        {...renderProps}
        data-hovered={isHovered || undefined}
        data-pressed={isPressed || undefined}
        data-focused={isFocused || undefined}
        data-loading={isLoading || undefined}
        data-disabled={isDisabled || undefined}
        data-focus-visible={isFocusVisible || undefined}
        {...('tabIndex' in ctxProps && { tabIndex })}
        aria-hidden={ctxProps['aria-hidden']}
        aria-disabled={isLoading ? 'true' : buttonProps['aria-disabled']}
        aria-busy={isLoading}
        ref={domRef}
      >
        {renderProps.children}
      </Tag>
    );
  }
);

Button.displayName = 'Button';

export type ButtonProps<As extends ElementType = 'button'> =
  ComponentPropsWithRef<typeof Button<As>>;
