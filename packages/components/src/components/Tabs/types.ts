import type {
  ComponentProps,
  ComponentRef,
  CSSProperties,
  ReactElement,
  Ref,
} from 'react';

import type { Key } from '@koobiq/react-core';
import type { AriaTabListProps } from '@koobiq/react-primitives';

import type { IconButtonProps } from '../IconButton';

import type { TabAddButtonProps } from './components';

export type TabsProps<T> = AriaTabListProps<T> & {
  /** Ref to the tabs. */
  ref?: Ref<HTMLDivElement>;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /**
   * If true, the tabs will stretch to fill the width of their container.
   * @default false
   */
  isStretched?: boolean;
  /** Handler that is called when a user deletes a tab. */
  onRemove?: (keys: Set<Key>) => void;
  /** Handler that is called when the add button is pressed. */
  onAdd?: () => void;
  /** The props used for each slot inside. */
  slotProps?: {
    tabs?: ComponentProps<'div'>;
    tabList?: ComponentProps<'div'>;
    tabPanel?: ComponentProps<'div'>;
    scrollBox?: ComponentProps<'div'>;
    addButton?: TabAddButtonProps;
    closeButton?: IconButtonProps;
    /** @deprecated */
    indicator?: ComponentProps<'span'>;
  };
  /**
   * Enables underlined tabs. Note that vertical orientation is not supported for this variant.
   * @default false
   */
  isUnderlined?: boolean;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

export type TabsComponent = <T>(props: TabsProps<T>) => ReactElement | null;

export type TabsRef = ComponentRef<'div'>;
