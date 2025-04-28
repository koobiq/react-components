'use client';

import type { RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import { useHover, mergeProps, useFocusRing } from '@koobiq/react-core';
import type { LinkAria, AriaLinkOptions } from '@react-aria/link';
import { useLink as useLinkReactAria } from '@react-aria/link';

export type UseLinkProps = ExtendableProps<
  { disabled?: boolean },
  Omit<AriaLinkOptions, 'isDisabled'>
>;

export function useLink(
  props: UseLinkProps,
  ref: RefObject<HTMLElement | null>
) {
  const { disabled, ...otherProps } = props;

  const { hoverProps, isHovered } = useHover({
    ...otherProps,
    isDisabled: disabled,
  });

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const { linkProps: commonLinkProps, isPressed } = useLinkReactAria(
    {
      ...otherProps,
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
