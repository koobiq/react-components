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
import { IconChevronDown16, IconChevronUp16 } from '@koobiq/react-icons';

import { utilClasses } from '../../styles/utility';
import { Button } from '../Button';

import s from './CodeBlock.module.css';
import { CodeBlockActionBar, CodeBlockTabs } from './components';
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
  const [actionBarSession, setActionBarSession] = useState(0);

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
    const root = rootRef.current;

    if (!root) return;

    const onMouseLeave = () => {
      const actionBarRemainsVisible =
        !isTabsHidden ||
        alwaysShowActionBar ||
        root.contains(document.activeElement);

      if (!actionBarRemainsVisible) {
        // React treats a portal as part of the component tree, so its synthetic mouseleave does not fire
        // when the pointer enters a tooltip. A native listener follows the DOM tree and closes it correctly.
        setActionBarSession((session) => session + 1);
      }
    };

    root.addEventListener('mouseleave', onMouseLeave);

    return () => root.removeEventListener('mouseleave', onMouseLeave);
  }, [alwaysShowActionBar, isTabsHidden]);

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

  const actionCount =
    Number(canToggleSoftWrap) +
    Number(canDownload) +
    Number(!hideCopyButton) +
    Number(Boolean(activeFile.link));

  const actionBar = (
    <CodeBlockActionBar
      key={actionBarSession}
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
    />
  );

  const panelContent = (
    <>
      <pre ref={preRef} className={s.pre}>
        <code
          className={clsx(
            'hljs',
            s.code,
            utilClasses.typography['mono-codeblock']
          )}
          data-language={pending || failed ? undefined : language}
          // `highlight.js` escapes the raw source before wrapping tokens in spans — see useHighlightedCode.
          dangerouslySetInnerHTML={
            pending || failed ? undefined : { __html: html }
          }
        >
          {pending || failed ? activeFile.content : undefined}
        </code>
      </pre>

      {contentExceedsMaxHeight && (
        <div
          className={s.viewAll}
          data-state={viewAll ? 'expanded' : 'collapsed'}
        >
          <div className={s.viewAllWrapper}>
            <Button
              variant="theme-transparent"
              startIcon={viewAll ? <IconChevronUp16 /> : <IconChevronDown16 />}
              onPress={toggleViewAll}
            >
              {viewAll ? t.format('viewLessText') : t.format('viewAllText')}
            </Button>
          </div>
        </div>
      )}
    </>
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
      data-soft-wrap={softWrap || undefined}
      data-view-all={viewAll || undefined}
      style={style}
    >
      {isTabsHidden ? (
        <>
          <div
            className={clsx(s.header, isScrolled && s.headerScrolled)}
            data-testid="code-block-header"
            data-scrolled={isScrolled || undefined}
          >
            {actionBar}
          </div>
          <div
            ref={mainRef}
            className={s.main}
            style={{ maxHeight: calculatedMaxHeight }}
            role="region"
            aria-label={activeFile.filename || fallbackFileName}
            // A scrollable region must be keyboard-focusable when its content overflows.
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={canFocusContent ? 0 : -1}
            onScroll={onScroll}
          >
            {panelContent}
          </div>
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
            panelContent={panelContent}
            panelMaxHeight={calculatedMaxHeight}
            onPanelScroll={onScroll}
            isScrolled={isScrolled}
            actionCount={actionCount}
            aria-label={t.format('filesLabel')}
          />
          {actionBar}
        </>
      )}
    </div>
  );
}

export const CodeBlock = forwardRef(CodeBlockRender);

CodeBlock.displayName = 'CodeBlock';
