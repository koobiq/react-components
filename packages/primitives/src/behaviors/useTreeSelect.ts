'use client';

import { useEffect, useMemo } from 'react';
import type {
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  RefObject,
} from 'react';

import {
  chain,
  useId,
  mergeProps,
  setInteractionModality,
} from '@koobiq/react-core';
import type { ValidationResult } from '@koobiq/react-core';
import { useField } from '@react-aria/label';
import { useOverlayTrigger } from '@react-aria/overlays';
import type { TreeProps } from 'react-aria-components';

import type {
  SelectionMode,
  TreeSelectState,
  TreeSelectStateOptions,
} from './useTreeSelectState';

export type TreeSelectAria<T extends object> = {
  /** Props for the label element. */
  labelProps: HTMLAttributes<HTMLElement>;
  /** Props for the popup trigger element. */
  triggerProps: HTMLAttributes<HTMLElement>;
  /** Props for the element representing the selected value. */
  valueProps: HTMLAttributes<HTMLElement>;
  /** Props for the popup tree. */
  treeProps: Omit<TreeProps<T>, 'children' | 'items'>;
  /** Props for the select description element, if any. */
  descriptionProps: HTMLAttributes<HTMLElement>;
  /** Props for the select error message element, if any. */
  errorMessageProps: HTMLAttributes<HTMLElement>;
} & ValidationResult;

export type AriaTreeSelectOptions<
  T extends object,
  M extends SelectionMode = 'single',
> = TreeSelectStateOptions<T, M>;

export type AriaTreeSelectProps<
  T extends object = object,
  M extends SelectionMode = 'single',
> = TreeSelectStateOptions<T, M>;

export function useTreeSelect<
  T extends object,
  M extends SelectionMode = 'single',
>(
  props: AriaTreeSelectOptions<T, M>,
  state: TreeSelectState<T>,
  ref: RefObject<HTMLElement | null>
): TreeSelectAria<T> {
  const { displayValidation, isOpen, setOpen, open, close, toggle } = state;
  const { collection, selectionManager } = state;

  const visibleItems = useMemo(
    () => [...collection].filter((item) => item.type === 'item'),
    [collection]
  );

  const focusedKey = selectionManager.focusedKey;
  const isTreeFocused = selectionManager.isFocused;

  useEffect(() => {
    if (
      !isOpen ||
      !isTreeFocused ||
      focusedKey == null ||
      visibleItems.some((item) => item.key === focusedKey)
    ) {
      return;
    }

    const firstVisibleKey =
      visibleItems.find((item) => !selectionManager.isDisabled(item.key))
        ?.key ?? null;

    selectionManager.setFocusedKey(firstVisibleKey);
  }, [focusedKey, isOpen, isTreeFocused, selectionManager, visibleItems]);

  const { isInvalid, validationErrors, validationDetails } = displayValidation;

  const { labelProps, errorMessageProps, descriptionProps, fieldProps } =
    useField({
      ...props,
      isInvalid,
      labelElementType: 'span',
      errorMessage: props.errorMessage || validationErrors,
    });

  const { triggerProps: overlayTriggerProps, overlayProps } = useOverlayTrigger(
    { type: 'tree' },
    {
      isOpen,
      setOpen,
      open,
      close,
      toggle,
    },
    ref
  );

  const valueId = useId();

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (props.isDisabled || props.isReadOnly) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault();
        state.open();
        break;
      case 'Escape':
        state.close();
        break;
      default:
        break;
    }
  };

  const triggerProps = mergeProps(fieldProps, overlayTriggerProps, {
    labelable: true,
    'aria-haspopup': 'tree',
    'aria-labelledby': [
      fieldProps['aria-labelledby'],
      fieldProps['aria-label'] ? overlayTriggerProps.id : null,
      valueId,
    ]
      .filter(Boolean)
      .join(' '),
    onFocus(event: FocusEvent) {
      if (state.isFocused) return;

      props.onFocus?.(event);
      props.onFocusChange?.(true);
      state.setFocused(true);
    },
    onBlur(event: FocusEvent) {
      if (state.isOpen) return;

      props.onBlur?.(event);
      props.onFocusChange?.(false);
      state.setFocused(false);
    },
    onKeyDown: chain(
      overlayTriggerProps.onKeyDown,
      handleTriggerKeyDown,
      props.onKeyDown
    ),
    onKeyUp: props.onKeyUp,
  });

  const treeProps: TreeSelectAria<T>['treeProps'] = mergeProps(overlayProps, {
    autoFocus: isOpen || undefined,
    // In a select, Escape should dismiss the dropdown — not clear the
    // selection. React Aria's default (`clearSelection`) wipes the selection
    // and stops the event, so the popover never closes while items are
    // selected.
    escapeKeyBehavior: 'none' as const,
    'aria-label': fieldProps['aria-label'],
    'aria-labelledby': fieldProps['aria-labelledby'],
    onBlur(event: FocusEvent<HTMLElement>) {
      if (event.currentTarget.contains(event.relatedTarget as Node)) {
        return;
      }

      props.onBlur?.(event);
      props.onFocusChange?.(false);
      state.setFocused(false);
    },
  });

  return {
    isInvalid,
    labelProps: {
      ...labelProps,
      onClick: () => {
        if (props.isDisabled) return;

        ref.current?.focus();
        setInteractionModality('keyboard');
      },
    },
    valueProps: { id: valueId },
    triggerProps,
    errorMessageProps,
    descriptionProps,
    treeProps,
    validationErrors,
    validationDetails,
  };
}
