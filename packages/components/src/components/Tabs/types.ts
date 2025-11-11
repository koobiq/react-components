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
  /**
   * If true, the tabs will stretch to fill the width of their container.
   * @default false
   */
  isStretched?: boolean;
  /** The props used for each slot inside. */
  slotProps?: {
    tabs?: ComponentProps<'div'>;
    tabList?: ComponentProps<'div'>;
    tabPanel?: ComponentProps<'div'>;
    scrollBox?: ComponentProps<'div'>;
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
