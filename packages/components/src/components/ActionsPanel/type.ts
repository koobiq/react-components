import type { Key, ReactElement } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import type { ActionsPanelActionProps } from './components';

export type ActionsPanelProps = ExtendableComponentPropsWithRef<
  {
    /** If `true`, the content panel won't close when the ESC key is pressed. */
    disableExitOnEscapeKeyDown?: boolean;
    /** The number of selected items that the ActionsPanel is currently linked to. */
    selectedItemCount?: number | 'all';
    /** The contents of the collection. */
    children?: Array<ReactElement<ActionsPanelActionProps>>;
    /** Handler that is called when the ActionsPanel clear button is pressed. */
    onClearSelection?: () => void;
    /** Handler called when any breadcrumb item is pressed. It returns the item key. */
    onAction?: (key: Key) => void;
  },
  'div'
>;
