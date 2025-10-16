import type {
  ComponentProps,
  ComponentRef,
  CSSProperties,
  ReactElement,
  Ref,
} from 'react';

import type { AriaTabListProps } from '@koobiq/react-primitives';

export type TabProps<T> = AriaTabListProps<T> & {
  /** Ref to the tabs. */
  ref?: Ref<HTMLDivElement>;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** If true, the component will take up the full width of its container. */
  fullWidth?: boolean;
  /** The props used for each slot inside. */
  slotProps?: {
    tabList?: ComponentProps<'div'>;
    tabPanel?: ComponentProps<'div'>;
  };
};

export type TabsComponent = <T>(props: TabProps<T>) => ReactElement | null;

export type TabsRef = ComponentRef<'div'>;
