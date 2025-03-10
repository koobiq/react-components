import type {
  ElementType,
  ReactElement,
  ComponentPropsWithRef,
  ForwardRefRenderFunction,
  ForwardRefExoticComponent,
} from 'react';
import { forwardRef } from 'react';

import type { DistributiveMerge, Merge } from '../types';

export type AsProps<
  Component extends ElementType,
  PermanentProps extends object,
  ComponentProps extends object,
> = DistributiveMerge<ComponentProps, PermanentProps & { as?: Component }>;

export type PolymorphicWithRef<
  // eslint-disable-next-line no-use-before-define
  Default extends OnlyAs,
  Props extends object = object,
  OnlyAs extends ElementType = ElementType,
> = <T extends OnlyAs = Default>(
  props: AsProps<T, Props, ComponentPropsWithRef<T>>
) => ReactElement | null;

export type PolyForwardComponent<
  // eslint-disable-next-line no-use-before-define
  Default extends OnlyAs,
  Props extends object = object,
  OnlyAs extends ElementType = ElementType,
> = Merge<
  ForwardRefExoticComponent<
    Merge<ComponentPropsWithRef<Default>, Props & { as?: Default }>
  >,
  PolymorphicWithRef<Default, Props, OnlyAs>
>;

export type PolyRefFunction = <
  // eslint-disable-next-line no-use-before-define
  Default extends OnlyAs,
  Props extends object = object,
  OnlyAs extends ElementType = ElementType,
>(
  Component: ForwardRefRenderFunction<any, Props & { as?: OnlyAs }>
) => PolyForwardComponent<Default, Props, OnlyAs>;

export const polymorphicForwardRef = forwardRef as PolyRefFunction;
