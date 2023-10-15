'use client';

import type { ElementType, RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaButtonOptions } from '@react-aria/button';
import {
  mergeProps,
  useFocusRing,
  useHover,
  usePress,
  useButton as useButtonReactAria,
  type AriaLinkOptions,
  type LinkAria,
} from 'react-aria';

type UseButtonProps = ExtendableProps<
  Omit<AriaButtonOptions<ElementType>, 'isDisabled'>,
  {
    disabled?: boolean;
    onClick?: AriaLinkOptions['onPress'];
  }
>;

export function useButton(
  props: UseButtonProps,
  ref: RefObject<Element | null>
) {
  const { onClick, disabled, ...otherProps } = props;

  const {
    focusProps,
    isFocused: focused,
    isFocusVisible: focusVisible,
  } = useFocusRing();

  const { hoverProps, isHovered: hovered } = useHover({
    ...props,
    isDisabled: disabled,
  });

  const { pressProps, isPressed: pressed } = usePress({
    ref,
    isDisabled: disabled,
    preventFocusOnPress: true,
  });

  const { buttonProps: commonButtonProps } = useButtonReactAria(
    {
      ...otherProps,
      onPress: onClick,
      isDisabled: disabled,
    },
    ref
  );

  const buttonProps: LinkAria['linkProps'] = mergeProps(
    focusProps,
    hoverProps,
    pressProps,
    commonButtonProps
  );

  return {
    buttonProps,
    pressed,
    disabled,
    hovered,
    focused,
    focusVisible,
  };
}
