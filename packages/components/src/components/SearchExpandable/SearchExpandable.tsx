'use client';

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import {
  clsx,
  mergeProps,
  useControlledState,
  useIsomorphicEffect,
  useLocalizedStringFormatter,
  useMutableRef,
} from '@koobiq/react-core';
import type { PressEvent } from '@koobiq/react-core';
import { IconMagnifyingGlass16 } from '@koobiq/react-icons';

import { useForm } from '../Form';
import { IconButton } from '../IconButton';
import { SearchInput } from '../SearchInput';
import { Tooltip } from '../Tooltip';

import intlMessages from './intl.json';
import s from './SearchExpandable.module.css';
import { searchExpandableDefaultValue } from './types';
import type { SearchExpandableProps, SearchExpandableRef } from './types';
import { useSearchExpandableValue } from './useSearchExpandableValue';
import {
  normalizeSearchExpandableValue,
  omitSearchExpandableOwnedButtonSlotProps,
  omitSearchExpandableOwnedCloseButtonSlotProps,
  omitSearchExpandableOwnedInputSlotProps,
  resolveSearchExpandableText,
} from './utils';

type SearchExpandableFocusCause = 'user' | 'external' | 'model';

type SearchExpandableTriggerKeyDownEvent = KeyboardEvent<HTMLButtonElement> & {
  continuePropagation?: () => void;
};

function normalizeTabIndex(
  tabIndex: number | null | undefined,
  isDisabled: boolean
): number {
  if (isDisabled) return -1;

  return typeof tabIndex === 'number' && Number.isInteger(tabIndex)
    ? tabIndex
    : 0;
}

function propagateTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
  if (event.key !== 'Escape') return;

  // The Tooltip control wraps keydown in a focusable handler that stops
  // propagation by default; let an enclosing dialog still handle Escape.
  (event as SearchExpandableTriggerKeyDownEvent).continuePropagation?.();
}

/** SearchExpandable is an icon-only search button that expands into a search field. */
export const SearchExpandable = forwardRef<
  SearchExpandableRef,
  SearchExpandableProps
>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    emitValueTimeout,
    isEmitValueByEnterEnabled,
    ...restProps
  } = props;

  const {
    isOpen: isOpenProp,
    defaultOpen = false,
    onOpenChange,
    tooltipText,
    placeholder,
    isDisabled: isDisabledProp,
    fullWidth,
    tabIndex,
    slotProps,
    className,
    style,
    'data-testid': testId,
    ...other
  } = restProps;

  const t = useLocalizedStringFormatter(intlMessages);

  const { isDisabled: formIsDisabled } = useForm();

  const isDisabled = isDisabledProp ?? formIsDisabled ?? false;

  const initialValue =
    normalizeSearchExpandableValue(value) ??
    defaultValue ??
    searchExpandableDefaultValue;

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusCauseRef = useRef<SearchExpandableFocusCause>('external');
  const modelOpenHadFocusRef = useRef(false);
  const [isTooltipRestoring, setIsTooltipRestoring] = useState(false);

  const [isOpen, setOpen] = useControlledState(
    isOpenProp,
    defaultOpen || initialValue !== '',
    onOpenChange
  );

  const requestOpenChange = (nextOpen: boolean) => {
    if (isOpenProp === undefined) focusCauseRef.current = 'user';

    setOpen(nextOpen);
  };

  const {
    draftValue,
    handleDraftChange,
    commitDraft,
    resetValue,
    cancelPendingEmit,
  } = useSearchExpandableValue({
    value,
    defaultValue,
    onChange,
    emitValueTimeout,
    isEmitValueByEnterEnabled,
    onExternalValue: (nextValue) => {
      if (nextValue === '' || isDisabled || isOpen) return;

      if (isOpenProp === undefined) {
        focusCauseRef.current = 'model';

        modelOpenHadFocusRef.current =
          rootRef.current?.contains(document.activeElement) ?? false;
      }

      setOpen(true);
    },
  });

  const onOpenChangeRef = useMutableRef(onOpenChange);

  const initialOpenRef = useRef({
    value: initialValue,
    isControlled: isOpenProp !== undefined,
    isOpen: isOpenProp,
    defaultOpen,
  });

  const hasRequestedInitialOpenRef = useRef(false);

  useIsomorphicEffect(() => {
    if (hasRequestedInitialOpenRef.current) return;

    hasRequestedInitialOpenRef.current = true;

    const initial = initialOpenRef.current;

    if (initial.value === '') return;

    if (initial.isControlled) {
      if (initial.isOpen === false) onOpenChangeRef.current?.(true);

      return;
    }

    if (!initial.defaultOpen) onOpenChangeRef.current?.(true);
  }, []);

  const previousOpenRef = useRef(isOpen);

  useIsomorphicEffect(() => {
    const wasOpen = previousOpenRef.current;

    previousOpenRef.current = isOpen;

    if (wasOpen && !isOpen) cancelPendingEmit();
  }, [cancelPendingEmit, isOpen]);

  const previousRenderedOpenRef = useRef(isOpen);

  useIsomorphicEffect(() => {
    const wasOpen = previousRenderedOpenRef.current;

    previousRenderedOpenRef.current = isOpen;

    if (wasOpen === isOpen) return;

    const focusCause = focusCauseRef.current;

    focusCauseRef.current = 'external';

    if (isDisabled) return;

    if (isOpen) {
      if (focusCause === 'model' && !modelOpenHadFocusRef.current) return;

      inputRef.current?.focus();

      return;
    }

    setIsTooltipRestoring(true);
  }, [isDisabled, isOpen]);

  useIsomorphicEffect(() => {
    if (!isTooltipRestoring) return;

    if (!isDisabled) triggerRef.current?.focus();

    setIsTooltipRestoring(false);
  }, [isDisabled, isTooltipRestoring]);

  const normalizedTabIndex = normalizeTabIndex(tabIndex, isDisabled);

  const close = () => {
    if (isDisabled) return;

    resetValue();
    requestOpenChange(false);
  };

  const toggle = () => {
    if (isDisabled) return;

    if (isOpen) resetValue();

    requestOpenChange(!isOpen);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    if (event.key === 'Enter') {
      if (!isEmitValueByEnterEnabled) return;

      event.preventDefault();

      if (event.nativeEvent.isComposing || event.keyCode === 229) return;

      commitDraft();

      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();

      // An already stopped event is already contained, and stopping it twice
      // triggers React Aria's development-mode duplicate-stop warning.
      if (!event.isPropagationStopped()) event.stopPropagation();

      close();
    }
  };

  useImperativeHandle(ref, () => ({
    element: rootRef.current,
    toggle,
  }));

  const resolvedTooltipText = resolveSearchExpandableText(
    tooltipText,
    t.format('search')
  );

  const resolvedPlaceholder = resolveSearchExpandableText(
    placeholder,
    t.format('search')
  );

  const closeButtonLabel =
    slotProps?.closeButton?.['aria-label'] ?? t.format('close');

  return (
    <div
      ref={rootRef}
      data-slot="search-expandable"
      data-testid={testId}
      data-open={isOpen || undefined}
      data-disabled={isDisabled || undefined}
      data-fullwidth={fullWidth || undefined}
      className={clsx(s.base, className)}
      style={style}
    >
      {isOpen ? (
        <SearchInput
          {...other}
          ref={inputRef}
          value={draftValue}
          onChange={handleDraftChange}
          onKeyDown={handleInputKeyDown}
          isDisabled={isDisabled}
          isReadOnly={false}
          fullWidth={fullWidth}
          aria-label={resolvedPlaceholder}
          placeholder={resolvedPlaceholder}
          type="text"
          autoComplete="off"
          slotProps={{
            input: mergeProps(
              omitSearchExpandableOwnedInputSlotProps(slotProps?.input),
              { tabIndex: normalizedTabIndex }
            ),
            clearButton: mergeProps(
              omitSearchExpandableOwnedCloseButtonSlotProps(
                slotProps?.closeButton
              ),
              {
                isHidden: false,
                isClearable: true,
                excludeFromTabOrder: false,
                'aria-label': closeButtonLabel,
                onPress: close,
                // React Aria focuses the input on press start, which cancels
                // native keyboard activation; keep focus on the button instead.
                onPressStart: (event: PressEvent) => {
                  if (event.pointerType !== 'keyboard') return;
                  if (!(event.target instanceof HTMLElement)) return;

                  event.target.focus();
                },
              }
            ),
          }}
        />
      ) : (
        <Tooltip
          {...slotProps?.tooltip}
          isDisabled={isDisabled || isTooltipRestoring}
          control={({ ref: controlRef, ...controlProps }) => (
            <IconButton
              {...mergeProps(
                { ref: controlRef },
                controlProps,
                omitSearchExpandableOwnedButtonSlotProps(slotProps?.button),
                {
                  ref: triggerRef,
                  type: 'button',
                  'aria-label': resolvedTooltipText,
                  'aria-expanded': false,
                  isDisabled,
                  tabIndex: normalizedTabIndex,
                  onKeyDown: propagateTriggerKeyDown,
                  onPress: toggle,
                }
              )}
            >
              <IconMagnifyingGlass16 />
            </IconButton>
          )}
        >
          {resolvedTooltipText}
        </Tooltip>
      )}
    </div>
  );
});

SearchExpandable.displayName = 'SearchExpandable';
