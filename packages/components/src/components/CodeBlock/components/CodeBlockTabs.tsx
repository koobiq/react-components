'use client';

import type {
  ComponentProps,
  CSSProperties,
  ReactNode,
  Ref,
  UIEventHandler,
} from 'react';

import { clsx } from '@koobiq/react-core';
import type { DataAttributeProps } from '@koobiq/react-core';

import { Tab, Tabs } from '../../Tabs';
import s from '../CodeBlock.module.css';
import type { CodeBlockFile } from '../types';

export type CodeBlockTabsProps = {
  files: CodeBlockFile[];
  activeFileIndex: number;
  onActiveFileIndexChange: (index: number) => void;
  fallbackFileName: string;
  renderTabLabel?: (file: CodeBlockFile, fallbackFileName: string) => ReactNode;
  panelRef: Ref<HTMLDivElement>;
  panelContent: ReactNode;
  panelMaxHeight?: number;
  onPanelScroll: UIEventHandler<HTMLDivElement>;
  isScrolled: boolean;
  actionCount: number;
  'aria-label': string;
};

export function CodeBlockTabs(props: CodeBlockTabsProps) {
  const {
    files,
    activeFileIndex,
    onActiveFileIndexChange,
    fallbackFileName,
    renderTabLabel,
    panelRef,
    panelContent,
    panelMaxHeight,
    onPanelScroll,
    isScrolled,
    actionCount,
    'aria-label': ariaLabel,
  } = props;

  const actionBarInlineSize =
    actionCount > 0
      ? `calc(${actionCount} * var(--kbq-size-3xl) + ${Math.max(
          actionCount - 1,
          0
        )} * var(--kbq-size-3xs))`
      : '0px';

  const headerStyle = {
    '--code-block-actionbar-inline-size': actionBarInlineSize,
  } as CSSProperties;

  const headerProps = {
    className: clsx(s.header, isScrolled && s.headerScrolled),
    style: headerStyle,
    'data-testid': 'code-block-header',
    'data-scrolled': isScrolled || undefined,
  } satisfies ComponentProps<'div'> & DataAttributeProps;

  return (
    <Tabs
      aria-label={ariaLabel}
      className={s.tabsContainer}
      selectedKey={String(activeFileIndex)}
      onSelectionChange={(key) => {
        if (files.length > 1) onActiveFileIndexChange(Number(key));
      }}
      slotProps={{
        tabs: {
          ...headerProps,
        },
        tabPanel: {
          ref: panelRef,
          className: s.main,
          style: { maxHeight: panelMaxHeight },
          onScroll: onPanelScroll,
        },
      }}
    >
      {files.map((file, index) => (
        <Tab
          key={String(index)}
          title={
            renderTabLabel
              ? renderTabLabel(file, fallbackFileName)
              : file.filename || fallbackFileName
          }
        >
          {panelContent}
        </Tab>
      ))}
    </Tabs>
  );
}
