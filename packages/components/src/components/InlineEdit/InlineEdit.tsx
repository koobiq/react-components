'use client';

import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  clsx,
  mergeRefs,
  useControlledState,
  useLocalizedStringFormatter,
  useResizeObserver,
} from '@koobiq/react-core';
import type { DataAttributeProps } from '@koobiq/react-core';
import { IconCheck16, IconXmark16 } from '@koobiq/react-icons';

import { utilClasses } from '../../styles/utility';
import { IconButton } from '../IconButton';
import { Popover } from '../Popover';
import type { PopoverProps } from '../Popover';
import { SelectNext } from '../SelectNext';
import { Tooltip } from '../Tooltip';

import { focusAdjacentTabStop, getTabStops } from './focus';
import s from './InlineEdit.module.css';
import { InlineEditPlaceholder } from './InlineEditPlaceholder';
import { InlineEditSaveErrorHandlerContext } from './InlineEditSaveErrorContext';
import intlMessages from './intl.json';
import type {
  InlineEditProps,
  InlineEditPropMode,
  InlineEditPropSaveStatus,
  InlineEditSaveErrorContext as InlineEditSaveErrorContextType,
} from './types';
import { isElementFullyVisible } from './validation';

type InlineEditComponent = <T>(
  props: InlineEditProps<T>
) => ReactElement | null;

const focusableSelector =
  'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]';

const defaultInteractiveSelectors = ['a', 'button'];

const inlineEditRegistry = new WeakMap<HTMLElement, () => void>();

type SelectEditorProps = {
  selectionMode?: 'single' | 'multiple';
  selectedTagsOverflow?: 'responsive' | 'multiline';
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  dropdownFooter?: unknown;
  slotProps?: { popover?: PopoverProps };
};

const hasValidationError = (error: ReactNode) =>
  error !== null && error !== undefined && error !== false;

function InlineEditRender<T>(
  props: Omit<InlineEditProps<T>, 'ref'>,
  ref: Ref<ComponentRef<'div'>>
) {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    mode: modeProp,
    defaultMode = 'view',
    onModeChange,
    label,
    menu,
    menuAriaLabel,
    interactiveSelectors = defaultInteractiveSelectors,
    renderView,
    renderEdit,
    isDisabled = false,
    editModeWidth,
    showActions = false,
    validate,
    showTooltipOnError = true,
    validationTooltipPlacement = 'top start',
    onSave,
    compareWith = Object.is,
    onSaveError,
    renderSaveError,
    onSaved,
    onCanceled,
    className,
    onClick,
    'aria-label': ariaLabel,
    ...other
  } = props;

  const stringFormatter = useLocalizedStringFormatter(intlMessages);
  const contextSaveErrorHandler = useContext(InlineEditSaveErrorHandlerContext);

  const [value, setValue] = useControlledState<T, T>(
    valueProp as Exclude<T, undefined> | undefined,
    defaultValue as Exclude<T, undefined>,
    onChange
  );

  const [mode, setMode] = useControlledState<InlineEditPropMode>(
    modeProp,
    defaultMode,
    onModeChange
  );

  const [anchorRef, rect] = useResizeObserver<HTMLDivElement>();
  const [anchorSize, setAnchorSize] = useState({ width: 0, height: 0 });
  const [panelShadow, setPanelShadow] = useState<string>();
  const [selectOpen, setSelectOpen] = useState(true);
  const [validationAttempted, setValidationAttempted] = useState(false);

  const [validationTooltipVisible, setValidationTooltipVisible] =
    useState(false);

  const [saveStatus, setSaveStatus] =
    useState<InlineEditPropSaveStatus>('idle');

  const [saveErrorContext, setSaveErrorContext] =
    useState<InlineEditSaveErrorContextType | null>(null);

  const [hasInteractiveContent, setHasInteractiveContent] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const focusAnchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const controlContainerRef = useRef<HTMLDivElement>(null);
  const initialValueRef = useRef(value);
  const previousModeRef = useRef(mode);
  const requestedModeRef = useRef<InlineEditPropMode | null>(null);
  const requestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logicalPanelTargetRef = useRef<Element | null>(null);
  const ignoreScrollCloseRef = useRef(false);
  const selectOpenRef = useRef(true);
  const validationErrorRef = useRef<ReactNode>(null);
  const validationCleanupRef = useRef<(() => void) | null>(null);
  const saveStatusRef = useRef<InlineEditPropSaveStatus>('idle');
  const mountedRef = useRef(true);
  const saveTimersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const lastSavedValueRef = useRef(value);
  const submittedValueRef = useRef(value);

  const saveActionsRef = useRef<{
    retrySave(): void;
    rollback(): void;
    toggleMode(): void;
  } | null>(null);

  const selectTabTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logicalTargetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const restoreFocusRef = useRef(false);
  const chainingRef = useRef(false);
  const tabTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusFrameRef = useRef<number | null>(null);
  const openRef = useRef<() => void>(() => undefined);

  const isEdit = mode === 'edit';
  const hasLabel = Boolean(label);

  const rootMergedRef = useMemo(
    () =>
      hasLabel ? mergeRefs(ref, rootRef) : mergeRefs(ref, rootRef, anchorRef),
    [anchorRef, hasLabel, ref]
  );

  const interactiveSelector = interactiveSelectors.join(',');
  const currentValidationError = validate?.(value);

  const validationError =
    validationAttempted && hasValidationError(currentValidationError)
      ? currentValidationError
      : null;

  const isInvalid = hasValidationError(validationError);
  validationErrorRef.current = validationError;

  const changeMode = useCallback(
    (nextMode: InlineEditPropMode) => {
      requestedModeRef.current = nextMode;

      if (modeProp !== undefined) {
        onModeChange?.(nextMode);
      } else {
        setMode(nextMode);
      }

      if (requestTimerRef.current !== null) {
        clearTimeout(requestTimerRef.current);
      }

      requestTimerRef.current = setTimeout(() => {
        requestedModeRef.current = null;
        requestTimerRef.current = null;
      }, 0);
    },
    [modeProp, onModeChange, setMode]
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      saveTimersRef.current.forEach((timer) => clearTimeout(timer));
      saveTimersRef.current.clear();
    };
  }, []);

  useEffect(
    () => () => {
      if (requestTimerRef.current !== null) {
        clearTimeout(requestTimerRef.current);
      }

      if (logicalTargetTimerRef.current !== null) {
        clearTimeout(logicalTargetTimerRef.current);
      }

      if (tabTimerRef.current !== null) {
        clearTimeout(tabTimerRef.current);
      }

      if (focusFrameRef.current !== null) {
        cancelAnimationFrame(focusFrameRef.current);
      }

      if (selectTabTimerRef.current !== null) {
        clearTimeout(selectTabTimerRef.current);
      }

      validationCleanupRef.current?.();
    },
    []
  );

  const updateSaveStatus = useCallback((status: InlineEditPropSaveStatus) => {
    saveStatusRef.current = status;

    if (mountedRef.current) setSaveStatus(status);
  }, []);

  const scheduleSaveCallback = useCallback(
    (callback: () => void, delay: number) => {
      const timer = setTimeout(() => {
        saveTimersRef.current.delete(timer);

        if (mountedRef.current) callback();
      }, delay);

      saveTimersRef.current.add(timer);

      return timer;
    },
    []
  );

  const startSave = useCallback(
    (request: Promise<unknown>, submittedValue: T) => {
      submittedValueRef.current = submittedValue;
      setSaveErrorContext(null);
      updateSaveStatus('pending');

      let progressStarted: number | null = null;

      const progressTimer = scheduleSaveCallback(() => {
        progressStarted = Date.now();
        updateSaveStatus('progress');
      }, 100);

      const complete = (callback: () => void) => {
        const remaining =
          progressStarted === null
            ? 0
            : Math.max(0, 300 - (Date.now() - progressStarted));

        if (remaining === 0) {
          callback();
        } else {
          scheduleSaveCallback(callback, remaining);
        }
      };

      const succeed = () => {
        if (!mountedRef.current) return;

        clearTimeout(progressTimer);
        saveTimersRef.current.delete(progressTimer);

        complete(() => {
          lastSavedValueRef.current = submittedValue;
          setSaveErrorContext(null);
          updateSaveStatus('idle');
          onSaved?.(submittedValue);
        });
      };

      const fail = (error: unknown) => {
        if (!mountedRef.current) return;

        clearTimeout(progressTimer);
        saveTimersRef.current.delete(progressTimer);

        complete(() => {
          const context: InlineEditSaveErrorContextType = {
            error,
            retrySave: () => saveActionsRef.current?.retrySave(),
            open: () => openRef.current(),
            toggleMode: () => saveActionsRef.current?.toggleMode(),
            rollback: () => saveActionsRef.current?.rollback(),
          };

          setSaveErrorContext(context);
          updateSaveStatus('error');
          onSaveError?.(context);
          contextSaveErrorHandler?.(context);
        });
      };

      request.then(succeed, fail);
    },
    [
      contextSaveErrorHandler,
      onSaveError,
      onSaved,
      scheduleSaveCallback,
      updateSaveStatus,
    ]
  );

  const retrySave = useCallback(() => {
    if (saveStatusRef.current !== 'error' || !onSave) return;

    const value = submittedValueRef.current;
    startSave(onSave(value), value);
  }, [onSave, startSave]);

  const rollback = useCallback(() => {
    if (saveStatusRef.current !== 'error') return;

    const lastSavedValue = lastSavedValueRef.current;
    setValue(lastSavedValue);
    initialValueRef.current = lastSavedValue;
    setSaveErrorContext(null);
    updateSaveStatus('idle');

    if (rootRef.current?.dataset.mode === 'edit') {
      restoreFocusRef.current = true;
      changeMode('view');
    }
  }, [changeMode, setValue, updateSaveStatus]);

  const toggleMode = useCallback(() => {
    if (rootRef.current?.dataset.mode === 'edit') {
      restoreFocusRef.current = true;
      changeMode('view');
    } else {
      openRef.current();
    }
  }, [changeMode]);

  saveActionsRef.current = { retrySave, rollback, toggleMode };

  const hideValidationTooltip = useCallback(() => {
    validationCleanupRef.current?.();
    validationCleanupRef.current = null;
    setValidationTooltipVisible(false);
  }, []);

  const showValidationTooltip = useCallback(
    (error: ReactNode) => {
      hideValidationTooltip();

      if (!showTooltipOnError || !hasValidationError(error)) return;

      const anchor = anchorRef.current;
      const window = anchor?.ownerDocument.defaultView;
      if (!anchor || !window) return;

      const finish = () => {
        if (
          rootRef.current?.dataset.mode !== 'edit' ||
          !hasValidationError(validationErrorRef.current)
        ) {
          return;
        }

        setValidationTooltipVisible(true);
      };

      if (isElementFullyVisible(anchor)) {
        finish();

        return;
      }

      let timer: ReturnType<typeof setTimeout> | null = null;

      const cleanup = () => {
        window.removeEventListener('scrollend', onScrollEnd, true);

        if (timer !== null) clearTimeout(timer);

        validationCleanupRef.current = null;
      };

      const onScrollEnd = () => {
        cleanup();
        finish();
      };

      window.addEventListener('scrollend', onScrollEnd, true);

      timer = setTimeout(() => {
        cleanup();
        finish();
      }, 800);

      validationCleanupRef.current = cleanup;

      anchor.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth',
      });
    },
    [anchorRef, hideValidationTooltip, showTooltipOnError]
  );

  const open = useCallback(() => {
    if (
      isDisabled ||
      mode === 'edit' ||
      requestedModeRef.current === 'edit' ||
      saveStatusRef.current === 'pending' ||
      saveStatusRef.current === 'progress'
    ) {
      return;
    }

    initialValueRef.current = value;

    if (saveStatusRef.current !== 'error') {
      lastSavedValueRef.current = value;
    }

    restoreFocusRef.current = false;
    setValidationAttempted(false);
    validationErrorRef.current = null;
    hideValidationTooltip();
    selectOpenRef.current = true;
    setSelectOpen(true);
    changeMode('edit');
  }, [changeMode, hideValidationTooltip, isDisabled, mode, value]);

  openRef.current = open;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const openFromKeyboard = () => openRef.current();
    inlineEditRegistry.set(root, openFromKeyboard);

    return () => {
      inlineEditRegistry.delete(root);
    };
  }, []);

  const save = useCallback(
    (nextValue: T = value) => {
      if (mode !== 'edit' || requestedModeRef.current === 'view') return false;

      const error = validate?.(nextValue);

      if (hasValidationError(error)) {
        restoreFocusRef.current = false;
        setValidationAttempted(true);
        validationErrorRef.current = error;
        showValidationTooltip(error);

        return false;
      }

      let request: Promise<unknown> | null = null;

      if (onSave) {
        const unchanged =
          saveStatusRef.current !== 'error' &&
          compareWith(nextValue, initialValueRef.current);

        if (!unchanged) request = onSave(nextValue);
      }

      setValidationAttempted(false);
      validationErrorRef.current = null;
      hideValidationTooltip();
      restoreFocusRef.current = true;
      changeMode('view');

      if (request) {
        startSave(request, nextValue);
      } else if (!onSave) {
        onSaved?.(nextValue);
      }

      return true;
    },
    [
      changeMode,
      compareWith,
      hideValidationTooltip,
      mode,
      onSave,
      onSaved,
      showValidationTooltip,
      startSave,
      validate,
      value,
    ]
  );

  const cancel = useCallback(() => {
    if (mode !== 'edit' || requestedModeRef.current === 'view') return;

    setValue(initialValueRef.current);
    setValidationAttempted(false);
    validationErrorRef.current = null;
    hideValidationTooltip();
    restoreFocusRef.current = true;
    changeMode('view');
    onCanceled?.();
  }, [changeMode, hideValidationTooltip, mode, onCanceled, setValue]);

  const commit = useCallback(
    (nextValue?: T) => {
      if (nextValue === undefined) {
        save();

        return;
      }

      setValue(nextValue);
      save(nextValue);
    },
    [save, setValue]
  );

  const renderedEditor = renderEdit({
    value,
    onChange: setValue,
    commit,
    isInvalid,
    validationError,
  });

  const selectElement =
    isValidElement<SelectEditorProps>(renderedEditor) &&
    renderedEditor.type === SelectNext
      ? renderedEditor
      : null;

  const isSingleSelect = Boolean(
    selectElement &&
    selectElement.props.selectionMode !== 'multiple' &&
    selectElement.props.selectedTagsOverflow !== 'multiline'
  );

  const hasSelectFooter = Boolean(selectElement?.props.dropdownFooter);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const detect = () => {
      setHasInteractiveContent(
        Boolean(interactiveSelector && view.querySelector(interactiveSelector))
      );
    };

    detect();

    const observer = new MutationObserver(detect);
    observer.observe(view, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [interactiveSelector]);

  useEffect(() => {
    if (isInvalid && isEdit) return;

    hideValidationTooltip();

    if (!isEdit) {
      setValidationAttempted(false);
      validationErrorRef.current = null;
    }
  }, [hideValidationTooltip, isEdit, isInvalid]);

  useEffect(() => {
    const wasEdit = previousModeRef.current === 'edit';

    if (isEdit && !wasEdit) initialValueRef.current = value;

    if (!isEdit && wasEdit && restoreFocusRef.current) {
      restoreFocusRef.current = false;

      if (chainingRef.current) {
        previousModeRef.current = mode;

        return;
      }

      const timer = setTimeout(() => {
        const activeElement = document.activeElement;

        if (
          activeElement === document.body ||
          (activeElement && panelRef.current?.contains(activeElement))
        ) {
          (focusAnchorRef.current ?? viewRef.current)?.focus();
        }
      }, 0);

      previousModeRef.current = mode;

      return () => clearTimeout(timer);
    }

    previousModeRef.current = mode;
  }, [isEdit, mode, value]);

  useEffect(() => {
    if (!isEdit || !rootRef.current) return;

    const shadow = rootRef.current.ownerDocument.defaultView
      ?.getComputedStyle(rootRef.current)
      .getPropertyValue('--kbq-inline-edit-panel-shadow')
      .trim();

    setPanelShadow(shadow || undefined);
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit || !isSingleSelect) return;

    selectOpenRef.current = true;
    setSelectOpen(true);
  }, [isEdit, isSingleSelect]);

  useEffect(() => {
    if (!isEdit || !isSingleSelect || !selectOpen) return;

    const timer = setTimeout(() => {
      const dropdown = Array.from(
        document.querySelectorAll<HTMLElement>('[data-slot="dropdown"]')
      ).find((element) => element.getClientRects().length > 0);

      const target = dropdown?.querySelector<HTMLElement>(
        '[role="option"][aria-selected="true"], [role="option"], [tabindex="0"]'
      );

      target?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [isEdit, isSingleSelect, selectOpen]);

  useEffect(() => {
    if (!isEdit || isSingleSelect) return;

    const timer = setTimeout(() => {
      const panel = panelRef.current;

      const input = panel?.querySelector<
        HTMLInputElement | HTMLTextAreaElement
      >('input:not([type="file"]), textarea');

      const target =
        input ?? panel?.querySelector<HTMLElement>(focusableSelector);

      target?.focus();
      if (input?.value) input.select();
    }, 0);

    return () => clearTimeout(timer);
  }, [isEdit, isSingleSelect]);

  useLayoutEffect(() => {
    if (!isEdit || !anchorRef.current) return;

    setAnchorSize({
      width: anchorRef.current.offsetWidth,
      height: anchorRef.current.offsetHeight,
    });
  }, [anchorRef, hasLabel, isEdit, rect.height, rect.width]);

  useLayoutEffect(() => {
    if (!isEdit) return;

    const handleScroll = (event: Event) => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      const target = event.target;

      if (!anchor || !panel) return;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (target instanceof Node && !target.contains(anchor)) return;

      ignoreScrollCloseRef.current = true;

      const anchorRect = anchor.getBoundingClientRect();
      panel.style.left = `${anchorRect.left + window.scrollX}px`;
      panel.style.top = `${anchorRect.top + window.scrollY}px`;

      setTimeout(() => {
        ignoreScrollCloseRef.current = false;
      }, 0);
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [anchorRef, isEdit]);

  // React events from a portal bubble through the editor's logical tree. The
  // capture handler below records those targets before this native document
  // listener runs, so a nested popup is not mistaken for an outside click.
  useEffect(() => {
    if (!isEdit) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      if (logicalPanelTargetRef.current === target) return;

      save();
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isEdit, save]);

  const handlePanelPointerDownCapture = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    logicalPanelTargetRef.current =
      event.target instanceof Element ? event.target : null;

    if (logicalTargetTimerRef.current !== null) {
      clearTimeout(logicalTargetTimerRef.current);
    }

    logicalTargetTimerRef.current = setTimeout(() => {
      logicalPanelTargetRef.current = null;
      logicalTargetTimerRef.current = null;
    }, 0);
  };

  const shouldCloseOnInteractOutside = useCallback((element: Element) => {
    const target = logicalPanelTargetRef.current;

    return !(
      target &&
      (target === element ||
        target.contains(element) ||
        element.contains(target))
    );
  }, []);

  const isInteractiveViewTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element) || !interactiveSelector) return false;

    const match = target.closest(interactiveSelector);
    const view = viewRef.current;

    return Boolean(match && match !== view && view?.contains(match));
  };

  const handleRootClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || isDisabled) return;
    if (isInteractiveViewTarget(event.target)) return;

    if (mode === 'edit') {
      // The panel is portaled, so a click bubbling from inside it is not
      // hosted by the root element. Only a real click on the host saves.
      if (event.currentTarget.contains(event.target as Node)) save();

      return;
    }

    event.preventDefault();
    event.stopPropagation();
    open();
  };

  const handleViewKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.nativeEvent.isComposing) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    event.stopPropagation();
    open();
  };

  const saveAndFocusAdjacent = useCallback(
    (backwards: boolean, waitForSelect = false) => {
      chainingRef.current = true;

      try {
        save();
      } catch (error) {
        chainingRef.current = false;

        throw error;
      }

      tabTimerRef.current = setTimeout(() => {
        tabTimerRef.current = null;

        const root = rootRef.current;
        restoreFocusRef.current = false;
        chainingRef.current = false;

        if (!root || root.dataset.mode === 'edit') return;

        const focusWhenReady = () => {
          focusFrameRef.current = null;

          const adjacent = focusAdjacentTabStop(root, backwards);

          if (
            !adjacent &&
            waitForSelect &&
            document.querySelector('[data-slot="dropdown"]')
          ) {
            focusFrameRef.current = requestAnimationFrame(focusWhenReady);

            return;
          }

          if (!adjacent) {
            (focusAnchorRef.current ?? viewRef.current)?.focus();

            return;
          }

          const nextRoot = adjacent.closest<HTMLElement>(
            '[data-slot="inline-edit"]'
          );

          if (
            nextRoot &&
            nextRoot !== root &&
            nextRoot.dataset.mode === 'view' &&
            nextRoot.dataset.disabled !== 'true'
          ) {
            inlineEditRegistry.get(nextRoot)?.();
          }
        };

        focusWhenReady();
      }, 0);
    },
    [save]
  );

  const handlePanelTab = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const panel = panelRef.current;
    const target = event.target;
    if (!panel || !(target instanceof HTMLElement)) return;

    const tabStops = getTabStops(panel);
    const boundary = event.shiftKey ? tabStops.at(0) : tabStops.at(-1);
    if (!boundary || boundary !== target) return;

    if (event.defaultPrevented && document.activeElement !== boundary) return;

    event.preventDefault();
    event.stopPropagation();
    saveAndFocusAdjacent(event.shiftKey);
  };

  useEffect(() => {
    if (!isEdit || !isSingleSelect) return;

    const handleSelectTab = (event: globalThis.KeyboardEvent) => {
      if (
        event.key !== 'Tab' ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      const backwards = event.shiftKey;

      if (!hasSelectFooter) {
        event.preventDefault();
        saveAndFocusAdjacent(backwards, true);

        return;
      }

      selectTabTimerRef.current = setTimeout(() => {
        selectTabTimerRef.current = setTimeout(() => {
          selectTabTimerRef.current = null;

          if (
            selectOpenRef.current ||
            rootRef.current?.dataset.mode !== 'edit'
          ) {
            return;
          }

          saveAndFocusAdjacent(backwards, true);
        }, 0);
      }, 0);
    };

    document.addEventListener('keydown', handleSelectTab, true);

    return () => {
      document.removeEventListener('keydown', handleSelectTab, true);

      if (selectTabTimerRef.current !== null) {
        clearTimeout(selectTabTimerRef.current);
        selectTabTimerRef.current = null;
      }
    };
  }, [hasSelectFooter, isEdit, isSingleSelect, saveAndFocusAdjacent]);

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === 'Tab') {
      handlePanelTab(event);

      return;
    }

    if (event.defaultPrevented) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      cancel();

      return;
    }

    if (event.key !== 'Enter') return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (
      target.closest(
        'button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"]'
      )
    ) {
      return;
    }

    if (
      target instanceof HTMLTextAreaElement &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    save();
  };

  const editor =
    selectElement && isSingleSelect
      ? cloneElement(selectElement, {
          isOpen: selectOpen,
          onOpenChange: (nextOpen) => {
            selectElement.props.onOpenChange?.(nextOpen);
            selectOpenRef.current = nextOpen;
            setSelectOpen(nextOpen);
          },
          slotProps: {
            ...selectElement.props.slotProps,
            popover: {
              ...selectElement.props.slotProps?.popover,
              anchorRef: rootRef,
              size:
                editModeWidth ??
                (rootRef.current?.offsetWidth || anchorSize.width || 'auto'),
            },
          },
        })
      : renderedEditor;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- the keyboard path lives on the inner role="button" view; the host handler only delegates clicks from the label and panel chrome
    <div
      data-slot="inline-edit"
      data-mode={mode}
      data-save-status={saveStatus}
      data-interactive={hasInteractiveContent || undefined}
      data-editor={isSingleSelect ? 'select' : undefined}
      data-disabled={isDisabled || undefined}
      className={clsx(s.base, label ? s.withLabel : undefined, className)}
      onClick={handleRootClick}
      {...other}
      ref={rootMergedRef}
    >
      <span
        className={utilClasses.hideVisually}
        role="status"
        aria-live="polite"
      >
        {saveStatus === 'pending' || saveStatus === 'progress'
          ? stringFormatter.format('saving')
          : saveStatus === 'error'
            ? stringFormatter.format('saveFailed')
            : ''}
      </span>
      {label && <div className={s.label}>{label}</div>}
      <div
        className={s.viewContainer}
        data-slot="inline-edit-view-container"
        ref={hasLabel ? anchorRef : undefined}
      >
        <div
          className={s.viewContent}
          role={hasInteractiveContent ? undefined : 'button'}
          tabIndex={
            hasInteractiveContent ? undefined : isEdit || isDisabled ? -1 : 0
          }
          aria-expanded={hasInteractiveContent ? undefined : isEdit}
          aria-disabled={!hasInteractiveContent && (isDisabled || undefined)}
          aria-label={
            hasInteractiveContent
              ? undefined
              : ariaLabel || stringFormatter.format('edit')
          }
          onKeyDown={hasInteractiveContent ? undefined : handleViewKeyDown}
          ref={viewRef}
        >
          {renderView(value)}
        </div>
        {hasInteractiveContent && !isEdit && !isDisabled && (
          <div
            aria-expanded="false"
            aria-label={ariaLabel || stringFormatter.format('edit')}
            className={clsx(s.focusAnchor, utilClasses.hideVisually)}
            data-slot="inline-edit-focus-anchor"
            role="button"
            tabIndex={0}
            onKeyDown={handleViewKeyDown}
            ref={focusAnchorRef}
          />
        )}
        {menu && !isEdit && (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- the group only isolates nested menu events from the root click delegate
          <div
            aria-label={menuAriaLabel}
            className={s.menuMask}
            data-slot="inline-edit-menu"
            role="group"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <div className={s.menuFade} />
            <div className={s.menuContainer}>{menu}</div>
          </div>
        )}
      </div>
      {saveStatus === 'progress' && (
        <span
          aria-label={stringFormatter.format('saving')}
          className={utilClasses.hideVisually}
          data-slot="inline-edit-save-progress"
          role="progressbar"
        />
      )}
      {saveStatus === 'error' && saveErrorContext && renderSaveError && (
        <div className={s.saveError} data-slot="inline-edit-save-error">
          {renderSaveError(saveErrorContext)}
        </div>
      )}
      <Popover
        ref={panelRef}
        data-slot="inline-edit-panel"
        data-editor={isSingleSelect ? 'select' : undefined}
        isOpen={isEdit}
        onOpenChange={(open) => {
          if (!open && !ignoreScrollCloseRef.current) save();
        }}
        anchorRef={anchorRef}
        className={s.panel}
        style={
          {
            '--kbq-inline-edit-panel-shadow': panelShadow,
          } as CSSProperties
        }
        shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
        size={editModeWidth ?? (anchorSize.width || 'auto')}
        offset={-anchorSize.height}
        placement="bottom start"
        shouldFlip={false}
        containerPadding={0}
        hideArrow
        hideCloseButton
        isNonModal
        disableFocusManagement
        disableExitOnEscapeKeyDown
        slotProps={{
          backdrop: { hidden: true },
          container: {
            'data-slot': 'inline-edit-panel-container',
            className: s.panelContainer,
          } as ComponentPropsWithRef<'div'> & DataAttributeProps,
          dialog: {
            'data-slot': 'inline-edit-dialog',
            className: s.panelDialog,
            onKeyDown: handlePanelKeyDown,
            onPointerDownCapture: handlePanelPointerDownCapture,
          },
        }}
      >
        <div
          className={s.controlContainer}
          data-slot="inline-edit-control"
          data-invalid={isInvalid || undefined}
          ref={controlContainerRef}
        >
          {editor}
        </div>
        {showActions && (
          <div
            className={s.actionButtons}
            data-slot="inline-edit-action-buttons"
            role="group"
          >
            <div
              className={s.actionButton}
              data-slot="inline-edit-action-button"
            >
              <IconButton
                aria-label={stringFormatter.format('save')}
                variant="theme-contrast"
                isCompact
                onPress={() => save()}
              >
                <IconCheck16 />
              </IconButton>
            </div>
            <div
              className={s.actionButton}
              data-slot="inline-edit-action-button"
            >
              <IconButton
                aria-label={stringFormatter.format('cancel')}
                variant="fade-contrast"
                isCompact
                onPress={cancel}
              >
                <IconXmark16 />
              </IconButton>
            </div>
          </div>
        )}
      </Popover>
      {isEdit && isInvalid && showTooltipOnError && (
        <Tooltip
          data-slot="inline-edit-validation-tooltip"
          anchorRef={controlContainerRef}
          isOpen={validationTooltipVisible}
          placement={validationTooltipPlacement}
          variant="error"
          hideArrow
        >
          {validationError}
        </Tooltip>
      )}
    </div>
  );
}

const InlineEditRoot = forwardRef(InlineEditRender) as InlineEditComponent;

export const InlineEdit = Object.assign(InlineEditRoot, {
  Placeholder: InlineEditPlaceholder,
});
