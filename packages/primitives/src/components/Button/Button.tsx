'use client';

import type { ComponentPropsWithRef, ComponentRef, ElementType } from 'react';

import { polymorphicForwardRef, useDOMRef } from '@koobiq/react-core';

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
      loading,
      disabled,
      value,
      name,
      form,
      formAction,
      formEncType,
      formMethod,
      formNoValidate,
      formTarget,
    } = commonProps;

    const domRef = useDOMRef<ComponentRef<'button'>>(ref);

    const { hovered, pressed, focused, focusVisible, buttonProps } = useButton(
      {
        ...commonProps,
        ...(loading && {
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
        disabled,
        elementType: as,
      },
      domRef
    );

    const renderValues = {
      hovered,
      pressed,
      focused,
      focusVisible,
      loading: loading || false,
      disabled: disabled || false,
    };

    const renderProps = useRenderProps({
      ...props,
      values: renderValues,
    });

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
        {...buttonProps}
        {...renderProps}
        tabIndex={tabIndex || buttonProps.tabIndex}
        aria-disabled={loading ? 'true' : buttonProps['aria-disabled']}
        aria-busy={loading}
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
