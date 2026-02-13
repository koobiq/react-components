import type { Key, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

export type ActionsPanelProps = ExtendableComponentPropsWithRef<
  {
    children?: ReactNode;
    selectedItemCount?: number | 'all';
    onClearSelection?: () => void;
    /** Handler called when any breadcrumb item is pressed. It returns the item key. */
    onAction?: (key: Key) => void;
  },
  'div'
>;
