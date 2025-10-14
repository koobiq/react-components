import { useRef } from 'react';

import type { AriaTabPanelProps, TabListState } from '@koobiq/react-primitives';
import { useTabPanel } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';

const textNormal = utilClasses.typography['text-normal'];

export type TabPanelProps<T> = AriaTabPanelProps & { state: TabListState<T> };

export function TabPanel<T>({ state, ...props }: TabPanelProps<T>) {
  const ref = useRef(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);

  return (
    <div {...tabPanelProps} className={textNormal} ref={ref}>
      {state.selectedItem?.props.children}
    </div>
  );
}
