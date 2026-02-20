import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { TransitionProps } from 'react-transition-group/Transition';

import type { Key } from '../../index';

import type {
  ActionsPanelActionProps,
  ActionsPanelCounterProps,
} from './components';
import type { ActionsPanelMoreActionProps } from './components/ActionsPanelMoreAction';

export type ActionsPanelActionRenderItem = {
  /** React element. */
  element: ReactElement<ActionsPanelActionProps>;
  /** Index in the `children` list. */
  index: number;
  /** Key. */
  key: Key | null;
  /** Convenient access to the element's children. */
  children: ReactNode;
  /** Optional link target extracted from props. */
  href?: string;
  /** Element props shortcut. */
  props: ActionsPanelActionProps;
};

export type ActionsPanelProps = ExtendableComponentPropsWithRef<
  {
    /** If `true`, the content panel won't close when the ESC key is pressed. */
    disableExitOnEscapeKeyDown?: boolean;
    /** The number of selected items that the ActionsPanel is currently linked to. */
    selectedItemCount?: number | 'all';
    /** Optional secondary counter displayed next to `selectedItemCount`. */
    selectedExtraCount?: number;
    /** The contents of the collection. */
    children?:
      | ReactElement<ActionsPanelActionProps>
      | Array<ReactElement<ActionsPanelActionProps>>;
    /** Handler that is called when the ActionsPanel clear button is pressed. */
    onClearSelection?: () => void;
    /** Handler called when any breadcrumb item is pressed. It returns the item key. */
    onAction?: (key: Key) => void;
    /**
     * The container element in which the component portal will be placed.
     * @default document.body
     */
    portalContainer?: HTMLElement | null;
    /** The props used for each slot inside. */
    slotProps?: {
      transition?: Partial<TransitionProps<HTMLElement>>;
      container?: ComponentPropsWithRef<'div'>;
      actions?: ComponentPropsWithRef<'div'>;
      counter?: ActionsPanelCounterProps;
      more?: ActionsPanelMoreActionProps;
    };
  },
  'div'
>;
