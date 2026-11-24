'use client';

import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactElement,
  Ref,
} from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
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

import { Popover } from '../Popover';

import s from './InlineEdit.module.css';
import { InlineEditPlaceholder } from './InlineEditPlaceholder';
import intlMessages from './intl.json';
import type { InlineEditProps, InlineEditPropMode } from './types';

type InlineEditComponent = <T>(
  props: InlineEditProps<T>
) => ReactElement | null;

const focusableSelector =
  'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]';

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
    renderView,
    renderEdit,
    isDisabled = false,
    editModeWidth,
    onSaved,
    onCanceled,
    className,
    onClick,
    'aria-label': ariaLabel,
    ...other
  } = props;

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

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
  const rootRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const initialValueRef = useRef(value);
  const previousModeRef = useRef(mode);
  const requestedModeRef = useRef<InlineEditPropMode | null>(null);
  const requestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logicalPanelTargetRef = useRef<Element | null>(null);
  const ignoreScrollCloseRef = useRef(false);

  const logicalTargetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const restoreFocusRef = useRef(false);

  const isEdit = mode === 'edit';
  const hasLabel = Boolean(label);

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

  useEffect(
    () => () => {
      if (requestTimerRef.current !== null) {
        clearTimeout(requestTimerRef.current);
      }

      if (logicalTargetTimerRef.current !== null) {
        clearTimeout(logicalTargetTimerRef.current);
      }
    },
    []
  );

  const open = useCallback(() => {
    if (isDisabled || mode === 'edit' || requestedModeRef.current === 'edit') {
      return;
    }

    initialValueRef.current = value;
    restoreFocusRef.current = false;
    changeMode('edit');
  }, [changeMode, isDisabled, mode, value]);

  const save = useCallback(() => {
    if (mode !== 'edit' || requestedModeRef.current === 'view') return;

    restoreFocusRef.current = true;
    changeMode('view');
    onSaved?.(value);
  }, [changeMode, mode, onSaved, value]);

  const cancel = useCallback(() => {
    if (mode !== 'edit' || requestedModeRef.current === 'view') return;

    setValue(initialValueRef.current);
    restoreFocusRef.current = true;
    changeMode('view');
    onCanceled?.();
  }, [changeMode, mode, onCanceled, setValue]);

  useEffect(() => {
    const wasEdit = previousModeRef.current === 'edit';

    if (isEdit && !wasEdit) initialValueRef.current = value;

    if (!isEdit && wasEdit && restoreFocusRef.current) {
      restoreFocusRef.current = false;

      const timer = setTimeout(() => {
        const activeElement = document.activeElement;

        if (
          activeElement === document.body ||
          (activeElement && panelRef.current?.contains(activeElement))
        ) {
          viewRef.current?.focus();
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
    if (!isEdit) return;

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
  }, [isEdit]);

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

  const handleRootClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || isDisabled) return;

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

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.nativeEvent.isComposing) return;

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

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- the keyboard path lives on the inner role="button" view; the host handler only delegates clicks from the label and panel chrome
    <div
      data-slot="inline-edit"
      data-mode={mode}
      data-disabled={isDisabled || undefined}
      className={clsx(s.base, label ? s.withLabel : undefined, className)}
      onClick={handleRootClick}
      {...other}
      ref={
        hasLabel ? mergeRefs(ref, rootRef) : mergeRefs(ref, rootRef, anchorRef)
      }
    >
      {label && <div className={s.label}>{label}</div>}
      <div
        className={s.viewContainer}
        data-slot="inline-edit-view-container"
        ref={hasLabel ? anchorRef : undefined}
      >
        <div
          className={s.viewContent}
          role="button"
          tabIndex={isEdit || isDisabled ? -1 : 0}
          aria-expanded={isEdit}
          aria-disabled={isDisabled || undefined}
          aria-label={ariaLabel || stringFormatter.format('edit')}
          onKeyDown={handleViewKeyDown}
          ref={viewRef}
        >
          {renderView(value)}
        </div>
      </div>
      <Popover
        ref={panelRef}
        data-slot="inline-edit-panel"
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
        <div className={s.controlContainer}>
          {renderEdit({ value, onChange: setValue })}
        </div>
      </Popover>
    </div>
  );
}

const InlineEditRoot = forwardRef(InlineEditRender) as InlineEditComponent;

export const InlineEdit = Object.assign(InlineEditRoot, {
  Placeholder: InlineEditPlaceholder,
});
