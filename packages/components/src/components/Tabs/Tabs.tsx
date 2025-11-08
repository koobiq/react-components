'use client';

import { forwardRef, useEffect, useRef, useState, useMemo } from 'react';
import type { Ref, CSSProperties } from 'react';

import {
  clsx,
  useRefs,
  mergeProps,
  useResizeObserverRefs,
  useScrollPosition,
} from '@koobiq/react-core';
import { IconChevronLeft16, IconChevronRight16 } from '@koobiq/react-icons';
import { useTabList, useTabListState } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Item } from '../Collections';
import { IconButton } from '../IconButton';

import { TabPanel, Tab as TabItem } from './components';
import s from './Tabs.module.css';
import type { TabsProps, TabsComponent, TabsRef } from './types';
import {
  getActiveTab,
  getIndicatorCssVars,
  getVisibleTabsRange,
} from './utils';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export function TabsRender<T extends object>(
  props: Omit<TabsProps<T>, 'ref'>,
  ref: Ref<TabsRef>
) {
  const {
    orientation = 'horizontal',
    'data-testid': dataTestId,
    isUnderlined,
    style,
    className,
    fullWidth,
    slotProps,
  } = props;

  const state = useTabListState<T>(props);
  const { selectedKey, selectedItem } = state;
  const tabListRef = useRef<HTMLDivElement>(null);
  const { tabListProps } = useTabList(props, state, tabListRef);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>();

  const isHorizontal = orientation === 'horizontal';

  const selectedItemId = state.selectedItem?.index;
  // Track previous active tab
  const previousActiveTabRef = useRef<HTMLElement | null>(null);

  const itemsRefs = useRefs<HTMLElement>(state.collection.size);

  // Scroll detection
  const [{ isScrollable, width: containerWidth }] = useResizeObserverRefs(
    useMemo(() => [tabListRef], [tabListRef, state.collection]),
    (el) => ({
      isScrollable: el && el.scrollWidth > el.offsetWidth,
      width: el?.offsetWidth ?? 0,
    })
  );

  const [{ x: scrollX }, setPosition] = useScrollPosition(tabListRef.current);

  const updateIndicatorSize = () => {
    const activeTab = getActiveTab(tabListRef.current);

    if (activeTab)
      setIndicatorStyle({
        ...getIndicatorCssVars(
          activeTab,
          isUnderlined ? 'horizontal' : orientation
        ),
        ...(!previousActiveTabRef.current && { transition: 'none' }),
      });

    return activeTab;
  };

  useResizeObserverRefs(itemsRefs, updateIndicatorSize);

  const tabsSizes = useResizeObserverRefs(
    itemsRefs,
    (el) => el?.offsetWidth ?? 0
  );

  const [firstVisibleTabId, lastVisibleTabId] = getVisibleTabsRange({
    tabsSizes,
    scrollX,
    containerWidth,
  });

  const scrollTabIntoView = (id: number) => {
    const tabIsVisible = id >= firstVisibleTabId && id <= lastVisibleTabId;

    if (!tabIsVisible) {
      const previousTabsWidth = tabsSizes
        .slice(0, id)
        .reduce((acc, n) => acc + n, 0);

      setPosition({ x: previousTabsWidth });
    }
  };

  const scrollPrev = () => {
    scrollTabIntoView(firstVisibleTabId - 1);
  };

  const scrollNext = () => {
    scrollTabIntoView(lastVisibleTabId + 1);
  };

  // Save the previous selected tab
  useEffect(() => {
    previousActiveTabRef.current = updateIndicatorSize();
  }, [selectedKey]);

  // Scroll to the selected tab
  useEffect(() => {
    if (isScrollable && selectedItemId) {
      scrollTabIntoView(selectedItemId);
    }
  }, [selectedItemId, isScrollable]);

  const tabsProps = mergeProps(
    tabListProps,
    {
      className: clsx(
        s.tabList,
        textNormalMedium,
        isUnderlined && s.underlined
      ),
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
      data-underlined={isUnderlined || undefined}
      className={clsx(
        s.base,
        fullWidth && s.fullWidth,
        isUnderlined && s.underlined,
        orientation && s[orientation],
        className
      )}
    >
      <div className={clsx(s.tabListWrapper, isUnderlined && s.underlined)}>
        {isScrollable && isHorizontal && (
          <>
            {(['prev', 'next'] as const).map((buttonTo) => (
              <IconButton
                type="button"
                key={buttonTo}
                variant="theme-contrast"
                className={clsx(s.button, s[buttonTo])}
                onPress={buttonTo === 'prev' ? scrollPrev : scrollNext}
                isDisabled={
                  buttonTo === 'prev'
                    ? firstVisibleTabId === 0
                    : lastVisibleTabId === state.collection.size - 1
                }
              >
                {buttonTo === 'prev' ? (
                  <IconChevronLeft16 />
                ) : (
                  <IconChevronRight16 />
                )}
              </IconButton>
            ))}
          </>
        )}
        <div {...tabsProps}>
          <span
            className={clsx(
              s.selectionIndicator,
              isUnderlined ? s.underlinedIndicator : s.defaultIndicator
            )}
            style={indicatorStyle}
          />
          {[...state.collection].map((item, i) => (
            <TabItem
              item={item}
              state={state}
              key={item.key}
              innerRef={itemsRefs[i]}
            />
          ))}
        </div>
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
