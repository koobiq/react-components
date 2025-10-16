import { useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import type { AriaTabPanelProps, TabListState } from '@koobiq/react-primitives';
import { useTabPanel } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import s from '../../Tabs.module.css';

const textNormal = utilClasses.typography['text-normal'];

export type TabPanelProps<T> = AriaTabPanelProps & { state: TabListState<T> };

export function TabPanel<T>({ state, ...props }: TabPanelProps<T>) {
  const ref = useRef(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);

  return (
    <div {...tabPanelProps} className={clsx(s.panel, textNormal)} ref={ref}>
      {state.selectedItem?.props.children}
    </div>
  );
}
