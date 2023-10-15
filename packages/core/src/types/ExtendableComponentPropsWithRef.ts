import type { ComponentPropsWithRef, ElementType } from 'react';

import type { ExtendableProps } from './ExtendableProps.js';

export type ExtendableComponentPropsWithRef<
  Props,
  Element extends ElementType,
> = ExtendableProps<Props, ComponentPropsWithRef<Element>>;
