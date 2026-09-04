'use client';

import type {
  ComponentPropsWithRef,
  ComponentRef,
  ElementType,
  ForwardedRef,
} from 'react';

import {
  useObjectRef,
  mergeProps,
  polymorphicForwardRef,
  filterDOMProps,
} from '@koobiq/react-core';
import { useRenderProps } from 'react-aria-components';

import { useButton, useLink } from '../../behaviors';

import type { LinkBaseProps, LinkRenderProps } from './types.js';

type LinkInnerProps<E extends HTMLElement> = LinkBaseProps & {
  elementRef: ForwardedRef<E>;
};

const useCommonProps = (props: LinkBaseProps, values: LinkRenderProps) => {
  const renderProps = useRenderProps({ ...props, values });

  const DOMProps = filterDOMProps(props, { global: true });

  delete DOMProps.onClick;

  return {
    DOMProps,
    renderProps,
    stateProps: {
      'data-hovered': values.isHovered || undefined,
      'data-pressed': values.isPressed || undefined,
      'data-focused': values.isFocused || undefined,
      'data-disabled': values.isDisabled || undefined,
      'data-focus-visible': values.isFocusVisible || undefined,
    },
  };
};

const LinkAsButton = ({
  elementRef,
  ...props
}: LinkInnerProps<HTMLButtonElement>) => {
  const domRef = useObjectRef<ComponentRef<'button'>>(elementRef);

  const { isHovered, isPressed, isFocused, isFocusVisible, buttonProps } =
    useButton<'button'>({ ...props, elementType: 'button' }, domRef);

  const { DOMProps, renderProps, stateProps } = useCommonProps(props, {
    isHovered,
    isPressed,
    isFocused,
    isFocusVisible,
    isDisabled: props.isDisabled || false,
  });

  return (
    <button
      {...stateProps}
      {...mergeProps(DOMProps, renderProps, buttonProps)}
      {...('tabIndex' in props && { tabIndex: props.tabIndex })}
      ref={domRef}
    >
      {renderProps.children}
    </button>
  );
};

const LinkAsAnchor = ({
  as: Tag = 'a',
  elementRef,
  ...props
}: LinkInnerProps<HTMLAnchorElement> & { as?: ElementType }) => {
  const domRef = useObjectRef<ComponentRef<'a'>>(elementRef);

  const { isHovered, isPressed, isFocusVisible, isFocused, linkProps } =
    useLink(
      {
        ...props,
        elementType: `${Tag}`,
        ...(props.isDisabled && {
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
      },
      domRef
    );

  const { DOMProps, renderProps, stateProps } = useCommonProps(props, {
    isHovered,
    isPressed,
    isFocused,
    isFocusVisible,
    isDisabled: props.isDisabled || false,
  });

  return (
    <Tag
      {...stateProps}
      {...mergeProps(DOMProps, renderProps, linkProps)}
      {...('tabIndex' in props && { tabIndex: props.tabIndex })}
      ref={domRef}
    >
      {renderProps.children}
    </Tag>
  );
};

/**
 * A link primitive allows a user to navigate to another page or resource within
 * a web page or application. With `as="button"` it switches to button semantics
 * instead of a button driven by link interactions.
 */
export const Link = polymorphicForwardRef<'a', LinkBaseProps>(
  ({ as, ...props }, ref) =>
    as === 'button' ? (
      <LinkAsButton {...props} elementRef={ref} />
    ) : (
      <LinkAsAnchor {...props} as={as} elementRef={ref} />
    )
);

export type LinkProps<As extends ElementType = 'a'> = ComponentPropsWithRef<
  typeof Link<As>
>;

Link.displayName = 'Link';
