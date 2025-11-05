'use client';

import { forwardRef, useEffect, useRef, useState, useMemo } from 'react';
import type { Ref, CSSProperties } from 'react';

import {
  clsx,
  useRefs,
  mergeProps,
  useResizeObserverRefs,
} from '@koobiq/react-core';
import { IconChevronLeft16, IconChevronRight16 } from '@koobiq/react-icons';
import { useTabList, useTabListState } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Item } from '../Collections';
import { IconButton } from '../IconButton';

import { TabPanel, Tab as TabItem } from './components';
import s from './Tabs.module.css';
import type { TabsProps, TabsComponent, TabsRef } from './types';
import { getActiveTab, getIndicatorCssVars } from './utils';

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

  // Track previous active tab
  const previous = useRef<HTMLElement | null>(null);

  const itemsRefs = useRefs<HTMLElement>(state.collection.size);

  // Scroll detection
  const [{ isScrollable, width: containerWidth }] = useResizeObserverRefs(
    useMemo(() => [tabListRef], [tabListRef, state.collection]),
    (el) => ({
      isScrollable: el && el.scrollWidth > el.offsetWidth,
      width: el?.offsetWidth ?? 0,
    })
  );

  const updateIndicatorSize = () => {
    const activeTab = getActiveTab(tabListRef.current);

    if (activeTab)
      setIndicatorStyle({
        ...getIndicatorCssVars(
          activeTab,
          isUnderlined ? 'horizontal' : orientation
        ),
        ...(!previous.current && { transition: 'none' }),
      });

    return activeTab;
  };

  useResizeObserverRefs(itemsRefs, updateIndicatorSize);

  // debug
  console.log(isScrollable, containerWidth);

  useEffect(() => {
    previous.current = updateIndicatorSize();
  }, [selectedKey]);

  const scrollPrev = () => {};

  const scrollNext = () => {};

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
        {isScrollable && (
          <>
            {(['prev', 'next'] as const).map((buttonTo) => (
              <IconButton
                type="button"
                key={buttonTo}
                variant="theme-contrast"
                className={clsx(s.button, s[buttonTo])}
                onPress={buttonTo === 'prev' ? scrollPrev : scrollNext}
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
