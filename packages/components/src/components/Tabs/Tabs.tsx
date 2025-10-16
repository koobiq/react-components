import { forwardRef, useEffect, useState } from 'react';
import type { Ref, CSSProperties } from 'react';

import { clsx, useDOMRef } from '@koobiq/react-core';
import { useTabList, useTabListState } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Item } from '../Collections';

import { TabPanel, Tab as TabItem } from './components';
import s from './Tabs.module.css';
import type { TabProps, TabsComponent, TabsRef } from './types';
import { getActiveTab, getThumbCssVars } from './utils';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export function TabsRender<T extends object>(
  props: Omit<TabProps<T>, 'ref'>,
  ref: Ref<TabsRef>
) {
  const { orientation } = props;
  const state = useTabListState<T>(props);
  const { selectedKey, selectedItem } = state;
  const domRef = useDOMRef(ref);
  const { tabListProps } = useTabList(props, state, domRef);
  const [thumbStyle, setThumbStyle] = useState<CSSProperties>();

  useEffect(() => {
    const activeTab = getActiveTab(domRef.current);

    if (activeTab) setThumbStyle(getThumbCssVars(activeTab, orientation));
  }, [selectedKey]);

  return (
    <div
      data-orientation={orientation}
      className={clsx(s.container, orientation && s[orientation])}
    >
      <div
        {...tabListProps}
        className={clsx(s.base, textNormalMedium)}
        ref={domRef}
      >
        <span className={s.thumb} style={thumbStyle} />
        {[...state.collection].map((item) => (
          <TabItem key={item.key} item={item} state={state} />
        ))}
      </div>
      {selectedItem?.hasChildNodes && (
        <TabPanel key={selectedItem?.key} state={state} />
      )}
    </div>
  );
}

export const Tabs = forwardRef(TabsRender) as TabsComponent;

export const Tab = Item;
