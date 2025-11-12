'use client';

import { forwardRef, useEffect, useRef, useState, useMemo } from 'react';
import type { Ref, CSSProperties } from 'react';

import { once } from '@koobiq/logger';
import {
  clsx,
  useRefs,
  isNotNil,
  mergeProps,
  useDebounceCallback,
  useResizeObserverRefs,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconChevronLeft16, IconChevronRight16 } from '@koobiq/react-icons';
import { useTabList, useTabListState } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Item } from '../Collections';
import { IconButton } from '../IconButton';

import { TabPanel, Tab as TabItem } from './components';
import intlMessages from './intl.json';
import s from './Tabs.module.css';
import type { TabsProps, TabsComponent, TabsRef } from './types';
import { getIndicatorCssVars, getTabsMeta } from './utils';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export function TabsRender<T extends object>(
  props: Omit<TabsProps<T>, 'ref'>,
  ref: Ref<TabsRef>
) {
  const {
    orientation: orientationProp = 'horizontal',
    'data-testid': dataTestId,
    isUnderlined = false,
    isStretched = false,
    style,
    className,
    slotProps,
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  const state = useTabListState<T>(props);
  const { selectedItem } = state;

  const [isMounted, setIsMounted] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>();

  const [scrollButtonsVisibility, setScrollButtonsVisibility] = useState({
    prev: false,
    next: false,
  });

  const orientation = isUnderlined ? 'horizontal' : orientationProp;
  const isHorizontal = orientation === 'horizontal';
  const selectedItemIdx = selectedItem?.index;

  if (
    process.env.NODE_ENV !== 'production' &&
    orientationProp === 'vertical' &&
    isUnderlined
  ) {
    once.warn(
      `Tabs: the tabs with isUnderlined do not support vertical orientation.`
    );
  }

  /** To calculate the size of the prev/next buttons. */
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const { tabListProps } = useTabList(props, state, tabListRef);
  const itemsRefs = useRefs<HTMLElement>(state.collection.size);

  /** Scrolls the container to the specified position. */
  const scroll = (
    value: number,
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ) => {
    const el = scrollBoxRef.current;
    if (!el) return;

    if (orientation === 'horizontal') {
      el.scrollTo({ left: value, behavior: 'smooth' });
    } else {
      el.scrollTo({ top: value, behavior: 'smooth' });
    }
  };

  /** Syncs prev/next button visibility with current scroll position. */
  const updateScrollButtonsVisibility = () => {
    if (!isHorizontal) return;

    if (!isNotNil(selectedItemIdx)) return;

    if (!itemsRefs[selectedItemIdx]) return;

    const { scrollBoxMeta, tabsListMeta } = getTabsMeta(
      tabListRef,
      scrollBoxRef,
      itemsRefs[selectedItemIdx]
    );

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

  const hasHScroll =
    isHorizontal &&
    tabListRef.current &&
    scrollBoxRef.current &&
    tabListRef.current?.clientWidth > scrollBoxRef.current?.clientWidth;

  const hasVScroll =
    !isHorizontal &&
    tabListRef.current &&
    scrollBoxRef.current &&
    tabListRef.current.clientHeight > scrollBoxRef.current.clientHeight;

  const updateIndicatorSize = (isAnimated = true) => {
    if (!isNotNil(selectedItemIdx)) return;

    const activeTab = itemsRefs[selectedItemIdx].current;

    if (activeTab)
      setIndicatorStyle({
        ...getIndicatorCssVars(
          activeTab,
          isUnderlined ? 'horizontal' : orientation
        ),
        ...(!isAnimated && { transition: 'none' }),
      });
  };

  /** Adjusts the scroll position based on the selected tab's position and orientation. */
  const scrollCorrection = (orientation: 'horizontal' | 'vertical') => {
    if (!isNotNil(selectedItemIdx)) return;

    const selectedEl = itemsRefs[selectedItemIdx];
    if (!selectedEl) return;

    const { scrollBoxMeta, activeTabMeta } = getTabsMeta(
      tabListRef,
      scrollBoxRef,
      selectedEl
    );

    if (!scrollBoxMeta || !activeTabMeta) return;

    const buttonWidth = scrollButtonRef.current?.clientWidth || 0;

    if (orientation === 'horizontal') {
      if (activeTabMeta.left - buttonWidth < scrollBoxMeta.left) {
        const nextScrollLeft =
          scrollBoxMeta.scrollLeft + (activeTabMeta.left - scrollBoxMeta.left);

        scroll(nextScrollLeft - buttonWidth, 'horizontal');
      } else if (activeTabMeta.right + buttonWidth > scrollBoxMeta.right) {
        const nextScrollLeft =
          scrollBoxMeta.scrollLeft +
          (activeTabMeta.right - scrollBoxMeta.right);

        scroll(nextScrollLeft + buttonWidth, 'horizontal');
      }
    }

    if (orientation === 'vertical') {
      if (activeTabMeta.top < scrollBoxMeta.top) {
        const nextScrollTop =
          scrollBoxMeta.scrollTop + (activeTabMeta.top - scrollBoxMeta.top);

        scroll(nextScrollTop, 'vertical');
      } else if (activeTabMeta.bottom > scrollBoxMeta.bottom) {
        const nextScrollTop =
          scrollBoxMeta.scrollTop +
          (activeTabMeta.bottom - scrollBoxMeta.bottom);

        scroll(nextScrollTop, 'vertical');
      }
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
    useMemo(() => [scrollBoxRef], [scrollBoxRef]),
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
    if (!isNotNil(selectedItemIdx)) return;

    if (isMounted) {
      updateIndicatorSize();
      debouncedScrollCorrection(orientation);
    } else {
      updateScrollButtonsVisibility();
      setIsMounted(true);
      // Update indicator styles without animation on the initial render.
      updateIndicatorSize(false);
    }
  }, [selectedItemIdx, isMounted]);

  /** PROPS */
  const tabsProps = mergeProps(
    { className: clsx(s.base, isUnderlined && s.underlined) },
    slotProps?.tabs
  );

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

  const scrollBoxProps = mergeProps(
    {
      ref: scrollBoxRef,
      className: s.scrollBox,
      onScroll: updateScrollButtonsVisibility,
    },
    slotProps?.scrollBox
  );

  const indicatorProps = mergeProps(
    {
      className: clsx(
        s.indicator,
        isUnderlined ? s.underlinedIndicator : s.defaultIndicator
      ),
      style: indicatorStyle,
    },
    slotProps?.indicator
  );

  return (
    <div
      ref={ref}
      style={style}
      data-testid={dataTestId}
      data-orientation={orientation}
      data-horizontal-scrollable={hasHScroll || undefined}
      data-vertical-scrollable={hasVScroll || undefined}
      data-stretched={isStretched || undefined}
      data-underlined={isUnderlined || undefined}
      className={clsx(
        s.root,
        isStretched && s.stretched,
        isUnderlined && s.underlined,
        orientation && s[orientation],
        className
      )}
    >
      <div {...tabsProps}>
        {hasHScroll && (
          <>
            <IconButton
              key="prev"
              tabIndex={-1}
              type="button"
              aria-label={t.format('prev')}
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
              aria-label={t.format('next')}
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
        <div {...scrollBoxProps}>
          <div {...tabsListProps}>
            {[...state.collection].map((item, i) => (
              <TabItem
                item={item}
                state={state}
                key={item.key}
                innerRef={itemsRefs[i]}
              />
            ))}
            {isMounted && <span {...indicatorProps} />}
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
