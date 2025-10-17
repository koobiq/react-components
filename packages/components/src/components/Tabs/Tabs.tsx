'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import type { Ref, CSSProperties } from 'react';

import {
  clsx,
  useRefs,
  mergeProps,
  useResizeObserverRefs,
} from '@koobiq/react-core';
import { useTabList, useTabListState } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Item } from '../Collections';

import { TabPanel, Tab as TabItem } from './components';
import s from './Tabs.module.css';
import type { TabsProps, TabsComponent, TabsRef } from './types';
import { getActiveTab, getThumbCssVars } from './utils';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export function TabsRender<T extends object>(
  props: Omit<TabsProps<T>, 'ref'>,
  ref: Ref<TabsRef>
) {
  const {
    orientation = 'horizontal',
    style,
    className,
    fullWidth,
    slotProps,
    'data-testid': dataTestId,
  } = props;

  const state = useTabListState<T>(props);
  const { selectedKey, selectedItem } = state;
  const tabListRef = useRef(null);
  const { tabListProps } = useTabList(props, state, tabListRef);
  const [thumbStyle, setThumbStyle] = useState<CSSProperties>();

  // Track previous active tab
  const previous = useRef<HTMLElement | null>(null);

  const itemsRefs = useRefs<HTMLElement>(state.collection.size);

  const updateThumbSize = () => {
    const activeTab = getActiveTab(tabListRef.current);

    if (activeTab)
      setThumbStyle({
        ...getThumbCssVars(activeTab, orientation),
        ...(!previous.current && { transition: 'none' }),
      });

    return activeTab;
  };

  useResizeObserverRefs(itemsRefs, updateThumbSize);

  useEffect(() => {
    previous.current = updateThumbSize();
  }, [selectedKey]);

  const tabsProps = mergeProps(
    tabListProps,
    {
      className: clsx(s.tabList, textNormalMedium),
      ref: tabListRef,
    },
    slotProps?.tabList
  );

  return (
    <div
      ref={ref}
      style={style}
      data-testid={dataTestId}
      data-orientation={orientation}
      data-fullwidth={fullWidth || undefined}
      className={clsx(
        s.base,
        fullWidth && s.fullWidth,
        orientation && s[orientation],
        className
      )}
    >
      <div {...tabsProps}>
        <span className={s.thumb} style={thumbStyle} />
        {[...state.collection].map((item, i) => (
          <TabItem
            item={item}
            state={state}
            key={item.key}
            innerRef={itemsRefs[i]}
          />
        ))}
      </div>
      {selectedItem?.hasChildNodes && (
        <TabPanel
          key={selectedItem?.key}
          {...slotProps?.tabPanel}
          state={state}
        />
      )}
    </div>
  );
}

export const Tabs = forwardRef(TabsRender) as TabsComponent;

export const Tab = Item;
