'use client';

import { forwardRef } from 'react';

import {
  mergeProps,
  useMultiRef,
  useHover,
  useFocusRing,
} from '@koobiq/react-core';

import { useRenderProps } from '../../utils';

import { type GroupProps, type GroupRef, useGroupContext } from './index';

export const Group = forwardRef<GroupRef, GroupProps>((props, ref) => {
  const defaultProps = useGroupContext();
  const commonProps = mergeProps(defaultProps, props);

  const { error = false, disabled = false, ...other } = commonProps;

  const { hoverProps, isHovered } = useHover({ isDisabled: disabled });

  const { isFocused, isFocusVisible, focusProps } = useFocusRing({
    within: true,
  });

  const renderProps = useRenderProps({
    ...props,
    values: {
      hovered: isHovered,
      focusWithin: isFocused,
      focusVisible: isFocusVisible,
      disabled,
      error,
    },
  });

  const innerRef = useMultiRef([
    ref,
    ...(defaultProps.ref ? [defaultProps.ref] : []),
  ]);

  return (
    <div
      {...mergeProps(other, focusProps, hoverProps)}
      {...renderProps}
      role={props.role ?? 'group'}
      ref={innerRef}
    >
      {renderProps.children}
    </div>
  );
});

Group.displayName = 'Group';
