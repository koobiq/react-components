'use client';

import type { ReactNode, Ref, UIEventHandler } from 'react';

import { mergeProps, mergeRefs } from '@koobiq/react-core';

import { Tab, Tabs } from '../../Tabs';
import s from '../CodeBlock.module.css';
import type { CodeBlockFile, CodeBlockProps } from '../types';

import { getCodeBlockHeaderProps } from './CodeBlockHeader';

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
  'aria-label': string;
  slotProps?: CodeBlockProps['slotProps'];
};

/**
 * The header of a `CodeBlock` with tabs, along with the tab panel holding the code: `Tabs` renders
 * both of them, and the code block lays them out next to the action bar.
 */
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
    'aria-label': ariaLabel,
    slotProps,
  } = props;

  const {
    ref: contentRef,
    style: contentStyle,
    ...contentProps
  } = slotProps?.content ?? {};

  return (
    <Tabs
      aria-label={ariaLabel}
      className={s.tabsContainer}
      selectedKey={String(activeFileIndex)}
      onSelectionChange={(key) => {
        if (files.length > 1) onActiveFileIndexChange(Number(key));
      }}
      slotProps={{
        tabs: getCodeBlockHeaderProps(isScrolled, slotProps?.header),
        tabPanel: {
          ...mergeProps(
            { className: s.main, onScroll: onPanelScroll },
            contentProps
          ),
          ref: mergeRefs(panelRef, contentRef),
          style: { maxHeight: panelMaxHeight, ...contentStyle },
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
          {/* `Tabs` renders the children of the selected tab only, so the others need no copy. */}
          {index === activeFileIndex ? panelContent : null}
        </Tab>
      ))}
    </Tabs>
  );
}
