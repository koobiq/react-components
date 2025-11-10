'use client';

import { forwardRef, useEffect, useRef, useState, useMemo } from 'react';
import type { Ref, CSSProperties } from 'react';

import {
  clsx,
  useRefs,
  isNotNil,
  mergeProps,
  useDebounceCallback,
  useResizeObserverRefs,
} from '@koobiq/react-core';
import { IconChevronLeft16, IconChevronRight16 } from '@koobiq/react-icons';
import { useTabList, useTabListState } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Item } from '../Collections';
import { IconButton } from '../IconButton';

import { TabPanel, Tab as TabItem } from './components';
import s from './Tabs.module.css';
import type { TabsProps, TabsComponent, TabsRef, TabsMeta } from './types';
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
  const { selectedItem } = state;

  const [isMounted, setIsMounted] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>();

  const [scrollButtonsVisibility, setScrollButtonsVisibility] = useState({
    prev: false,
    next: false,
  });

  const isHorizontal = orientation === 'horizontal';
  const selectedItemId = selectedItem?.index;

  /** To calculate the size of the prev/next buttons. */
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const { tabListProps } = useTabList(props, state, tabListRef);
  const itemsRefs = useRefs<HTMLElement>(state.collection.size);

  const getTabsMeta = (): TabsMeta => {
    const scrollBoxNode = scrollBoxRef.current;
    const tabsListNode = tabListRef.current;
    const activeTabNode = getActiveTab(tabListRef.current);

    let tabsListMeta: TabsMeta['tabsListMeta'] = null;
    let scrollBoxMeta: TabsMeta['scrollBoxMeta'] = null;
    let activeTabMeta: TabsMeta['activeTabMeta'] = null;

    if (tabsListNode) tabsListMeta = tabsListNode.getBoundingClientRect();

    if (activeTabNode) activeTabMeta = activeTabNode.getBoundingClientRect();

    if (scrollBoxNode) {
      const scrollBoxRect = scrollBoxNode.getBoundingClientRect();

      scrollBoxMeta = {
        scrollLeft: scrollBoxNode.scrollLeft,
        left: scrollBoxRect.left,
        right: scrollBoxRect.right,
      };
    }

    return { tabsListMeta, activeTabMeta, scrollBoxMeta };
  };

  /** Scrolls the container to the specified position. */
  const scroll = (value: number) => {
    if (!scrollBoxRef.current) return;

    scrollBoxRef.current?.scrollTo({
      left: value,
      behavior: 'smooth',
    });
  };

  /** Syncs prev/next button visibility with current scroll position. */
  const updateScrollButtonsVisibility = () => {
    const { scrollBoxMeta, tabsListMeta } = getTabsMeta();

    if (!scrollBoxMeta || !tabsListMeta) return;

    const { scrollLeft } = scrollBoxMeta;

    const isPrevButtonActive = scrollLeft > 0;
    const isNextButtonActive = tabsListMeta.right - scrollBoxMeta.right > 1;

    setScrollButtonsVisibility((prevState) => {
      const { prev, next } = prevState;

      if (isPrevButtonActive !== prev || isNextButtonActive !== next) {
        return { prev: isPrevButtonActive, next: isNextButtonActive };
      }

      return prevState;
    });
  };

  const isScrollable =
    isHorizontal &&
    tabListRef.current &&
    scrollBoxRef.current &&
    tabListRef.current?.clientWidth > scrollBoxRef.current?.clientWidth;

  const updateIndicatorSize = (isAnimated = true) => {
    const activeTab = getActiveTab(tabListRef.current);

    if (activeTab)
      setIndicatorStyle({
        ...getIndicatorCssVars(
          activeTab,
          isUnderlined ? 'horizontal' : orientation
        ),
        ...(!isAnimated && { transition: 'none' }),
      });
  };

  /** Adjusts the scroll position based on the selected tab's position. */
  const scrollCorrection = () => {
    const { scrollBoxMeta, activeTabMeta } = getTabsMeta();
    const buttonWidth = scrollButtonRef.current?.clientWidth || 0;

    if (!scrollBoxMeta || !activeTabMeta) return;

    if (activeTabMeta.left - buttonWidth < scrollBoxMeta.left) {
      const nextScrollLeft =
        scrollBoxMeta.scrollLeft + (activeTabMeta.left - scrollBoxMeta.left);

      scroll(nextScrollLeft - buttonWidth);
    } else if (activeTabMeta.right + buttonWidth > scrollBoxMeta.right) {
      const nextScrollLeft =
        scrollBoxMeta.scrollLeft + (activeTabMeta.right - scrollBoxMeta.right);

      scroll(nextScrollLeft + buttonWidth);
    }
  };

  const [debouncedUpdateIndicatorSize] = useDebounceCallback({
    callback: updateIndicatorSize,
    delay: 100,
  });

  const [debouncedUpdateScrollButtonsActivity] = useDebounceCallback({
    callback: updateScrollButtonsVisibility,
    delay: 100,
  });

  const [debouncedScrollCorrection] = useDebounceCallback({
    callback: scrollCorrection,
    delay: 100,
  });

  useResizeObserverRefs(itemsRefs, () => debouncedUpdateIndicatorSize());

  useResizeObserverRefs(
    useMemo(() => [scrollBoxRef], [scrollBoxRef, state.collection]),
    () => debouncedUpdateScrollButtonsActivity()
  );

  const scrollPrev = () => {
    const scrollBoxNode = scrollBoxRef.current;

    if (!scrollBoxNode) return;

    scroll(scrollBoxNode.scrollLeft - scrollBoxNode.clientWidth);
  };

  const scrollNext = () => {
    const scrollBoxNode = scrollBoxRef.current;

    if (!scrollBoxNode) return;

    scroll(scrollBoxNode.scrollLeft + scrollBoxNode.clientWidth);
  };

  useEffect(() => {
    if (!isNotNil(selectedItemId)) return;

    if (isMounted) {
      updateIndicatorSize();
      debouncedScrollCorrection();
    } else {
      setIsMounted(true);
      // Update indicator styles without animation on the initial render.
      updateIndicatorSize(false);
    }
  }, [selectedItemId, isMounted]);

  useEffect(() => {
    updateScrollButtonsVisibility();
  }, []);

  const tabsListProps = mergeProps(
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
        s.container,
        fullWidth && s.fullWidth,
        isUnderlined && s.underlined,
        orientation && s[orientation],
        className
      )}
    >
      <div className={clsx(s.base, isUnderlined && s.underlined)}>
        {isScrollable && (
          <>
            <IconButton
              key="prev"
              tabIndex={-1}
              type="button"
              ref={scrollButtonRef}
              onPress={scrollPrev}
              variant="theme-contrast"
              className={clsx(
                s.button,
                s.prev,
                !scrollButtonsVisibility.prev && s.invisible
              )}
            >
              <IconChevronLeft16 />
            </IconButton>
            <IconButton
              key="next"
              type="button"
              tabIndex={-1}
              onPress={scrollNext}
              variant="theme-contrast"
              className={clsx(
                s.button,
                s.next,
                !scrollButtonsVisibility.next && s.invisible
              )}
            >
              <IconChevronRight16 />
            </IconButton>
          </>
        )}
        <div
          ref={scrollBoxRef}
          className={s.scrollBox}
          onScroll={updateScrollButtonsVisibility}
        >
          <div className={s.indicatorBox}>
            <div {...tabsListProps}>
              {[...state.collection].map((item, i) => (
                <TabItem
                  item={item}
                  state={state}
                  key={item.key}
                  innerRef={itemsRefs[i]}
                />
              ))}
            </div>
            {isMounted && (
              <span
                className={clsx(
                  s.indicator,
                  isUnderlined ? s.underlinedIndicator : s.defaultIndicator
                )}
                style={indicatorStyle}
              />
            )}
          </div>
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
