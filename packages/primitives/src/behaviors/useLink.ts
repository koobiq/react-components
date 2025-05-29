'use client';

import type { RefObject } from 'react';

import { useHover, mergeProps, useFocusRing } from '@koobiq/react-core';
import type { LinkAria, AriaLinkOptions } from '@react-aria/link';
import { useLink as useLinkReactAria } from '@react-aria/link';

export type UseLinkProps = AriaLinkOptions;

export function useLink(
  props: UseLinkProps,
  ref: RefObject<HTMLElement | null>
) {
  const { hoverProps, isHovered } = useHover(props);

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const { linkProps: commonLinkProps, isPressed } = useLinkReactAria(
    props,
    ref
  );

  const linkProps: LinkAria['linkProps'] = mergeProps(
    commonLinkProps,
    focusProps,
    hoverProps
  );

  return {
    linkProps,
    isPressed,
    isHovered,
    isFocused,
    isFocusVisible,
  };
}

export type UseLinkReturn = ReturnType<typeof useLink>;
