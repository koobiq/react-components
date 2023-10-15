'use client';

import type { ExtendableProps } from '@koobiq/react-core';
import type { FocusableElement, RefObject } from '@react-types/shared';
import {
  useHover,
  mergeProps,
  useFocusRing,
  useLink as useLinkReactAria,
} from 'react-aria';
import type { LinkAria, AriaLinkOptions } from 'react-aria';

type UseLinkProps = ExtendableProps<
  Omit<AriaLinkOptions, 'isDisabled'>,
  { disabled?: boolean; onClick?: AriaLinkOptions['onPress'] }
>;

export function useLink(
  props: UseLinkProps,
  ref: RefObject<FocusableElement | null>
) {
  const { disabled, onClick, ...otherProps } = props;

  const { hoverProps, isHovered } = useHover({
    ...otherProps,
    isDisabled: disabled,
  });

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const { linkProps: commonLinkProps, isPressed } = useLinkReactAria(
    {
      ...otherProps,
      onPress: onClick,
      isDisabled: disabled,
    },
    ref
  );

  const linkProps: LinkAria['linkProps'] = mergeProps(
    { disabled },
    focusProps,
    hoverProps,
    commonLinkProps
  );

  return {
    linkProps,
    pressed: isPressed,
    hovered: isHovered,
    focused: isFocused,
    focusVisible: isFocusVisible,
  };
}

export type UseLinkReturn = ReturnType<typeof useLink>;
