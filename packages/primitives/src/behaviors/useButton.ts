'use client';

import type { ElementType, RefObject } from 'react';

import {
  useHover,
  mergeProps,
  useFocusRing,
  handleLinkClick,
  useLinkProps,
  useRouter,
} from '@koobiq/react-core';
import type {
  DOMAttributes,
  HoverEvents,
  RouterOptions,
} from '@koobiq/react-core';
import { useButton as useButtonReactAria } from '@react-aria/button';
import type { AriaButtonOptions, ButtonAria } from '@react-aria/button';

export type UseButtonProps<E extends ElementType> = AriaButtonOptions<E> &
  HoverEvents & { routerOptions?: RouterOptions };

export type ButtonOptions = AriaButtonOptions<ElementType>;

export type UseButtonReturn = {
  isPressed: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isDisabled?: boolean;
  isFocusVisible: boolean;
  buttonProps: ButtonAria<DOMAttributes>['buttonProps'];
};

export function useButton<E extends ElementType>(
  props: UseButtonProps<E>,
  ref: RefObject<Element | null>
): UseButtonReturn {
  const { isDisabled } = props;

  const isLink =
    (props.elementType === 'a' || (!props.elementType && !!props.href)) &&
    !props.isDisabled;

  const { focusProps, isFocused, isFocusVisible } = useFocusRing({
    within: true,
  });

  const { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: props.isDisabled,
  });

  const { buttonProps: buttonPropsAria, isPressed } = useButtonReactAria(
    props,
    ref
  );

  const router = useRouter();
  const routerLinkProps = useLinkProps(props);

  const buttonProps = mergeProps(
    buttonPropsAria,
    focusProps,
    hoverProps,
    isLink ? routerLinkProps : undefined
  );

  const { onClick } = buttonProps;

  buttonProps.onClick = (e) => {
    onClick?.(e);

    if (isLink) {
      handleLinkClick(e, router, props.href, props.routerOptions);
    }
  };

  return {
    isPressed,
    isHovered,
    isFocused,
    isDisabled,
    buttonProps,
    isFocusVisible,
  };
}
