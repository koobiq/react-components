import type { ComponentRef, ReactNode } from 'react';

import type {
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';

export type ListItemAddonRef = ComponentRef<'div'>;

export type ListItemAddonProps = ExtendableComponentPropsWithRef<
  {
    /** The content of the component. */
    children?: ReactNode;
    /** If `true`, removes the margin around the root element. */
    disableMargin?: boolean;
  } & DataAttributeProps,
  'div'
>;
