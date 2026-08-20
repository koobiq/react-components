'use client';

import {
  type ComponentPropsWithRef,
  forwardRef,
  type ReactElement,
  type Ref,
  useRef,
} from 'react';

import { clsx, mergeProps, mergeRefs } from '@koobiq/react-core';
import type { AriaTabPanelProps, TabListState } from '@koobiq/react-primitives';
import { useTabPanel } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';

import s from './TabPanel.module.css';

const textNormal = utilClasses.typography['text-normal'];

export type TabPanelProps<T> = AriaTabPanelProps &
  Omit<ComponentPropsWithRef<'div'>, 'children'> & {
    state: TabListState<T>;
  };

type TabPanelComponent = <T>(props: TabPanelProps<T>) => ReactElement | null;

function TabPanelRender<T>(
  { state, style, className, ...props }: Omit<TabPanelProps<T>, 'ref'>,
  ref: Ref<HTMLDivElement>
) {
  const innerRef = useRef<HTMLDivElement>(null);

  const { tabPanelProps } = useTabPanel(props, state, innerRef);

  return (
    <div
      {...mergeProps(props, tabPanelProps)}
      style={style}
      className={clsx(s.base, textNormal, className)}
      ref={mergeRefs(ref, innerRef)}
    >
      {state.selectedItem?.props.children}
    </div>
  );
}

export const TabPanel = forwardRef(TabPanelRender) as TabPanelComponent;
