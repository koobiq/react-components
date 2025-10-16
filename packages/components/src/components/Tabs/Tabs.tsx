import { forwardRef, useEffect, useRef, useState } from 'react';
import type { Ref, CSSProperties } from 'react';

import {
  clsx,
  useRefs,
  useDOMRef,
  mergeProps,
  useResizeObserverRefs,
} from '@koobiq/react-core';
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
  const { orientation, style, className, fullWidth, slotProps } = props;
  const state = useTabListState<T>(props);
  const { selectedKey, selectedItem } = state;
  const domRef = useDOMRef(ref);
  const { tabListProps } = useTabList(props, state, domRef);
  const [thumbStyle, setThumbStyle] = useState<CSSProperties>();

  // Track previous active tab
  const previous = useRef<HTMLElement | null>(null);

  const itemsRefs = useRefs<HTMLElement>(state.collection.size);

  const updateThumbSize = () => {
    const activeTab = getActiveTab(domRef.current);

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
      ref: domRef,
    },
    slotProps?.tabList
  );

  return (
    <div
      style={style}
      data-orientation={orientation}
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
