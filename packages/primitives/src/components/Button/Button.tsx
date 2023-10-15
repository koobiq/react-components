'use client';

import type { ComponentRef } from 'react';

import { polymorphicForwardRef, useDOMRef } from '@koobiq/react-core';
import { mergeProps } from 'react-aria';

import { useButton } from '../../behaviors/index.js';
import { useRenderProps } from '../../utils/index.js';

import type { ButtonBaseProps } from './types.js';

export const Button = polymorphicForwardRef<'button', ButtonBaseProps>(
  (props, ref) => {
    const { as, loading, disabled } = props;

    const Tag = as || 'button';

    const domRef = useDOMRef<ComponentRef<'button'>>(ref);

    const { hovered, pressed, focused, focusVisible, buttonProps } = useButton(
      {
        ...props,
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
        {...mergeProps(buttonProps, renderProps)}
        aria-disabled={loading ? 'true' : buttonProps['aria-disabled']}
        aria-busy={loading}
        ref={ref}
      >
        {renderProps.children}
      </Tag>
    );
  }
);

Button.displayName = 'ButtonPrimitive';
