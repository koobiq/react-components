import type {
  ComponentProps,
  ComponentRef,
  CSSProperties,
  ReactElement,
  Ref,
} from 'react';

import type { AriaTabListProps } from '@koobiq/react-primitives';

export type TabsProps<T> = AriaTabListProps<T> & {
  /** Ref to the tabs. */
  ref?: Ref<HTMLDivElement>;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Whether the tabs should take the full width of its parent. */
  fullWidth?: boolean;
  /** The props used for each slot inside. */
  slotProps?: {
    tabList?: ComponentProps<'div'>;
    tabPanel?: ComponentProps<'div'>;
  };
  isUnderlined?: boolean;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

export type TabsComponent = <T>(props: TabsProps<T>) => ReactElement | null;

export type TabsRef = ComponentRef<'div'>;
