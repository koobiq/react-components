import { useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { useTabList, useTabListState } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Item } from '../Collections';

import { Tab as TabItem } from './Tab';
import { TabPanel } from './TabPanel';
import s from './Tabs.module.css';
import type { TabProps } from './types';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export function Tabs<T extends object>(props: TabProps<T>) {
  const state = useTabListState<T>(props);
  const ref = useRef(null);
  const { orientation } = props;
  const { tabListProps } = useTabList(props, state, ref);

  return (
    <div className={clsx(orientation && s[orientation])}>
      <div
        {...tabListProps}
        className={clsx(s.base, textNormalMedium)}
        ref={ref}
      >
        {[...state.collection].map((item) => (
          <TabItem key={item.key} item={item} state={state} />
        ))}
      </div>
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
}

Tabs.displayName = 'Tabs';

export const Tab = Item;
