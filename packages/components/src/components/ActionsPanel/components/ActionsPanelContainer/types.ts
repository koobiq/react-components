import type { ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

export type ActionsPanelContainerProps = ExtendableComponentPropsWithRef<
  {
    children?: ReactNode;
  },
  'div'
>;
