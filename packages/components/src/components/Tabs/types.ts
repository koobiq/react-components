import type { ComponentRef, ReactElement, Ref } from 'react';

import type { AriaTabListProps } from '@koobiq/react-primitives';

export type TabProps<T> = AriaTabListProps<T> & {
  /** Ref to the tabs. */
  ref?: Ref<HTMLDivElement>;
};

export type TabsComponent = <T>(props: TabProps<T>) => ReactElement | null;

export type TabsRef = ComponentRef<'div'>;
