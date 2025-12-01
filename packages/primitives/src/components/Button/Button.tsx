'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import {
  useDOMRef,
  mergeProps,
  filterDOMProps,
  polymorphicForwardRef,
} from '@koobiq/react-core';

import { useButton } from '../../behaviors';
import { useRenderProps } from '../../utils';
import { useSlottedContext } from '../../utils/useSlottedContext';

import { ButtonContext } from './ButtonContext';
import type { ButtonBaseProps } from './types.js';

export const Button = polymorphicForwardRef<'button', ButtonBaseProps>(
  (props, ref) => {
    const { as, slot, tabIndex } = props;

    const Tag = as || 'button';

    const commonProps = useSlottedContext(props, ButtonContext, slot);

    const {
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
    } = commonProps;

    const domRef = useDOMRef(ref);

    const { isHovered, isPressed, isFocused, isFocusVisible, buttonProps } =
      useButton(
        {
          ...commonProps,
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
        data-disabled={isDisabled || undefined}
        data-focus-visible={isFocusVisible || undefined}
        tabIndex={buttonProps.tabIndex}
        {...('tabIndex' in props && { tabIndex })}
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
