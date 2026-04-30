import { Children } from 'react';
import type { ReactNode, RefObject } from 'react';

export type TabsMeta = {
  tabsListMeta: null | DOMRect;
  scrollBoxMeta: null | {
    scrollLeft: number;
    scrollTop: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  activeTabMeta: null | DOMRect;
};

export const getTabsMeta = (
  tabListRef: RefObject<HTMLElement | null>,
  scrollBoxRef: RefObject<HTMLElement | null>,
  activeTabRef: RefObject<HTMLElement | null>
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
      scrollTop: scrollBoxNode.scrollTop,
      top: scrollBoxRect.top,
      bottom: scrollBoxRect.bottom,
      left: scrollBoxRect.left,
      right: scrollBoxRect.right,
    };
  }

  return { tabsListMeta, activeTabMeta, scrollBoxMeta };
};

type IconOnlyTabPanelProps = {
  children?: ReactNode;
  onlyIcon?: boolean;
};

export const hasIconOnlyTabPanel = (props?: IconOnlyTabPanelProps): boolean =>
  Boolean(props?.onlyIcon) && Children.count(props?.children) > 0;
