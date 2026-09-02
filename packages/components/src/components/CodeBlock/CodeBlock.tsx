'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { Ref } from 'react';

import { once } from '@koobiq/logger';
import {
  clsx,
  useControlledState,
  useLocalizedStringFormatter,
  useResizeObserver,
} from '@koobiq/react-core';

import s from './CodeBlock.module.css';
import {
  CodeBlockActionBar,
  CodeBlockCode,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTabs,
} from './components';
import { useHighlightedCode, useOverflowShadow } from './hooks';
import intlMessages from './intl.json';
import type {
  CodeBlockFile,
  CodeBlockProps,
  CodeBlockRef,
  CodeBlockScrollToOptions,
} from './types';

const EMPTY_FILE: CodeBlockFile = { content: '' };

function scrollElementTo(
  element: HTMLElement,
  options: CodeBlockScrollToOptions
): void {
  const { behavior, top, bottom, left, right, start, end } = options;
  const maxTop = element.scrollHeight - element.clientHeight;
  const maxLeft = element.scrollWidth - element.clientWidth;
  const isRtl = getComputedStyle(element).direction === 'rtl';

  const resolvedTop = top ?? (bottom == null ? undefined : maxTop - bottom);
  let resolvedLeft = left;

  if (resolvedLeft == null && right != null) {
    resolvedLeft = isRtl ? -right : maxLeft - right;
  }

  if (resolvedLeft == null && start != null) {
    resolvedLeft = isRtl ? -start : start;
  }

  if (resolvedLeft == null && end != null) {
    resolvedLeft = isRtl ? end - maxLeft : maxLeft - end;
  }

  element.scrollTo({ top: resolvedTop, left: resolvedLeft, behavior });
}

function CodeBlockRender(props: CodeBlockProps, ref: Ref<CodeBlockRef>) {
  const {
    files,
    hasLineNumbers = false,
    isFilled = false,
    hideBorder = false,
    canToggleSoftWrap = false,
    canDownload = false,
    hideCopyButton = false,
    alwaysShowActionBar = false,
    softWrap: softWrapProp,
    defaultSoftWrap,
    onSoftWrapChange,
    viewAll: viewAllProp,
    defaultViewAll,
    onViewAllChange,
    maxHeight,
    hideTabs: hideTabsProp,
    defaultHideTabs,
    onHideTabsChange,
    activeFileIndex: activeFileIndexProp,
    defaultActiveFileIndex,
    onActiveFileIndexChange,
    renderTabLabel,
    fallbackFileName = 'code',
    startFrom = 1,
    slotProps,
    className,
    style,
    'data-testid': dataTestId,
    ...other
  } = props;

  if (process.env.NODE_ENV !== 'production' && files.length === 0) {
    once.warn('CodeBlock: "files" should contain at least one file.');
  }

  const t = useLocalizedStringFormatter(intlMessages);

  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef<CodeBlockScrollToOptions | null>(null);
  const tabsHiddenAutomaticallyRef = useRef(false);
  const [isActionBarTooltipOpen, setIsActionBarTooltipOpen] = useState(false);

  const [softWrap, setSoftWrap] = useControlledState(
    softWrapProp,
    defaultSoftWrap ?? false,
    onSoftWrapChange
  );

  const [viewAll, setViewAll] = useControlledState(
    viewAllProp,
    defaultViewAll ?? false,
    onViewAllChange
  );

  const [hideTabs, setHideTabs] = useControlledState(
    hideTabsProp,
    defaultHideTabs ?? false,
    onHideTabsChange
  );

  const [activeFileIndexState, setActiveFileIndex] = useControlledState(
    activeFileIndexProp,
    defaultActiveFileIndex ?? 0,
    onActiveFileIndexChange
  );

  // Clamp against out-of-range indexes, e.g. after `files` shrinks.
  const normalizedActiveFileIndex = Number.isFinite(activeFileIndexState)
    ? Math.trunc(activeFileIndexState)
    : 0;

  const activeFileIndex = Math.max(
    0,
    Math.min(normalizedActiveFileIndex, files.length - 1)
  );

  const activeFile = files[activeFileIndex] ?? EMPTY_FILE;

  useEffect(() => {
    if (
      activeFileIndexProp === undefined &&
      activeFileIndexState !== activeFileIndex
    ) {
      setActiveFileIndex(activeFileIndex);
    }
  }, [
    activeFileIndex,
    activeFileIndexProp,
    activeFileIndexState,
    setActiveFileIndex,
  ]);

  // A single file without a name has nothing to switch between or label — hide the tabs, same as Angular.
  const isSingleUnnamedFile = files.length === 1 && !activeFile.filename;

  // A controlled `false` deliberately overrides the automatic single-file behavior so a custom
  // header can remain visible.
  const shouldAutoHideTabs = hideTabsProp === undefined && isSingleUnnamedFile;

  const isTabsHidden = hideTabs || shouldAutoHideTabs;

  useEffect(() => {
    if (hideTabsProp !== undefined) {
      tabsHiddenAutomaticallyRef.current = false;

      return;
    }

    if (shouldAutoHideTabs && !hideTabs) {
      tabsHiddenAutomaticallyRef.current = true;
      setHideTabs(true);
    } else if (!shouldAutoHideTabs && tabsHiddenAutomaticallyRef.current) {
      tabsHiddenAutomaticallyRef.current = false;
      setHideTabs(false);
    }
  }, [hideTabs, hideTabsProp, setHideTabs, shouldAutoHideTabs]);

  const { html, language, pending, failed } = useHighlightedCode(activeFile, {
    hasLineNumbers,
    startFrom,
  });

  const [preRef, preRect] = useResizeObserver<HTMLPreElement>();
  const hasMaxHeight = maxHeight != null && maxHeight > 0;
  const calculatedMaxHeight = hasMaxHeight && !viewAll ? maxHeight : undefined;

  const contentExceedsMaxHeight = hasMaxHeight && preRect.height > maxHeight;

  const mainElement = mainRef.current;

  const canFocusContent = Boolean(
    !calculatedMaxHeight &&
    mainElement &&
    (mainElement.scrollHeight > mainElement.clientHeight ||
      mainElement.scrollWidth > mainElement.clientWidth)
  );

  const { isScrolled, onScroll } = useOverflowShadow();

  const scrollTo = (options: CodeBlockScrollToOptions) => {
    if (pending) {
      pendingScrollRef.current = options;

      return;
    }

    if (mainRef.current) scrollElementTo(mainRef.current, options);
  };

  useEffect(() => {
    if (pending || !pendingScrollRef.current || !mainRef.current) return;

    scrollElementTo(mainRef.current, pendingScrollRef.current);
    pendingScrollRef.current = null;
  }, [pending]);

  useImperativeHandle(ref, () => ({
    element: rootRef.current,
    scrollTo,
  }));

  const scrollToTop = () =>
    mainRef.current &&
    scrollElementTo(mainRef.current, { top: 0, behavior: 'instant' });

  const onTabChange = (index: number) => {
    if (index === activeFileIndex) return;

    setActiveFileIndex(index);
    scrollToTop();
  };

  const toggleSoftWrap = () => setSoftWrap(!softWrap);

  const toggleViewAll = () => {
    const nextViewAll = !viewAll;

    setViewAll(nextViewAll);

    if (!nextViewAll) scrollToTop();
  };

  const actionBar = (
    <CodeBlockActionBar
      file={activeFile}
      fallbackFileName={fallbackFileName}
      canToggleSoftWrap={canToggleSoftWrap}
      canDownload={canDownload}
      canCopy={!hideCopyButton}
      softWrap={softWrap}
      onSoftWrapToggle={toggleSoftWrap}
      copyTooltip={t.format('copyTooltip')}
      copiedTooltip={t.format('copiedTooltip')}
      downloadTooltip={t.format('downloadTooltip')}
      softWrapOnTooltip={t.format('softWrapOnTooltip')}
      softWrapOffTooltip={t.format('softWrapOffTooltip')}
      openExternalSystemTooltip={t.format('openExternalSystemTooltip')}
      onTooltipOpenChange={setIsActionBarTooltipOpen}
    />
  );

  const code = (
    <CodeBlockCode
      preRef={preRef}
      html={html}
      language={language}
      source={activeFile.content}
      isHighlighted={!pending && !failed}
      canViewAll={contentExceedsMaxHeight}
      viewAll={viewAll}
      onViewAllToggle={toggleViewAll}
      viewAllText={t.format('viewAllText')}
      viewLessText={t.format('viewLessText')}
    />
  );

  return (
    <div
      {...other}
      ref={rootRef}
      data-testid={dataTestId}
      className={clsx(s.base, className)}
      data-filled={isFilled || undefined}
      data-border-hidden={hideBorder || undefined}
      data-line-numbers={hasLineNumbers || undefined}
      data-hide-tabs={isTabsHidden || undefined}
      data-always-show-action-bar={alwaysShowActionBar || undefined}
      data-action-bar-tooltip-open={isActionBarTooltipOpen || undefined}
      data-soft-wrap={softWrap || undefined}
      data-view-all={viewAll || undefined}
      style={style}
    >
      {isTabsHidden ? (
        <>
          <CodeBlockHeader
            isScrolled={isScrolled}
            slotProps={slotProps?.header}
          >
            {actionBar}
          </CodeBlockHeader>
          <CodeBlockContent
            contentRef={mainRef}
            aria-label={activeFile.filename || fallbackFileName}
            isFocusable={canFocusContent}
            maxHeight={calculatedMaxHeight}
            onScroll={onScroll}
            slotProps={slotProps?.content}
          >
            {code}
          </CodeBlockContent>
        </>
      ) : (
        <>
          <CodeBlockTabs
            files={files}
            activeFileIndex={activeFileIndex}
            onActiveFileIndexChange={onTabChange}
            fallbackFileName={fallbackFileName}
            renderTabLabel={renderTabLabel}
            panelRef={mainRef}
            panelContent={code}
            panelMaxHeight={calculatedMaxHeight}
            onPanelScroll={onScroll}
            isScrolled={isScrolled}
            aria-label={t.format('filesLabel')}
            slotProps={slotProps}
          />
          {actionBar}
        </>
      )}
    </div>
  );
}

/**
 * CodeBlock displays reformatted text content with syntax highlighting.
 *
 * Wrap it with `CodeBlockProvider` to control how `highlight.js` is loaded.
 */
export const CodeBlock = forwardRef(CodeBlockRender);

CodeBlock.displayName = 'CodeBlock';
