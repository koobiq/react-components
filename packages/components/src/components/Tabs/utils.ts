import type { CSSProperties, RefObject } from 'react';

export function getIndicatorCssVars(
  el: HTMLElement,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
): CSSProperties {
  const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = el;

  return {
    '--indicator-inline-size': `${offsetWidth}px`,
    '--indicator-block-size': `${offsetHeight}px`,
    '--indicator-transform':
      orientation === 'horizontal'
        ? `translateX(${offsetLeft}px)`
        : `translateY(${offsetTop}px)`,
  } as CSSProperties;
}

export type TabsMeta = {
  tabsListMeta: null | DOMRect;
  scrollBoxMeta: null | {
    scrollLeft: number;
    left: number;
    right: number;
  };
  activeTabMeta: null | DOMRect;
};

export const getTabsMeta = (
  tabListRef: RefObject<HTMLElement>,
  scrollBoxRef: RefObject<HTMLElement>,
  activeTabRef: RefObject<HTMLElement>
): TabsMeta => {
  const scrollBoxNode = scrollBoxRef.current;
  const tabsListNode = tabListRef.current;
  const activeTabNode = activeTabRef.current;

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
