import type { ReactNode } from 'react';

import type {
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';

export type ActionsPanelContainerProps = ExtendableComponentPropsWithRef<
  {
    children?: ReactNode;
  } & DataAttributeProps,
  'div'
>;
