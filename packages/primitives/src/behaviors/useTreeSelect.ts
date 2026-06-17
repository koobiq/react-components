'use client';

import type {
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  RefObject,
} from 'react';

import {
  chain,
  filterDOMProps,
  mergeProps,
  setInteractionModality,
  useId,
} from '@koobiq/react-core';
import type {
  AriaLabelingProps,
  DOMProps,
  FocusableProps,
  Selection,
  ValidationResult,
} from '@koobiq/react-core';
import { useField } from '@react-aria/label';
import { useOverlayTrigger } from '@react-aria/overlays';
import type { OverlayTriggerState } from '@react-stately/overlays';
import type { TreeProps } from 'react-aria-components';

import type {
  TreeSelectNode,
  TreeSelectProps,
  TreeSelectState,
} from './useTreeSelectState';

export interface AriaTreeSelectProps
  extends TreeSelectProps, DOMProps, AriaLabelingProps, FocusableProps {
  /** Visible label rendered above the control. */
  label?: ReactNode;
  /** If `true`, user input is required before form submission. */
  isRequired?: boolean;
  /** The helper text content. */
  caption?: ReactNode;
  /** The error message content. */
  errorMessage?: ReactNode;
}

export interface AriaTreeSelectOptions extends AriaTreeSelectProps {
  /** The ref for the trigger element. */
  triggerRef: RefObject<HTMLElement | null>;
}

export type TreeSelectPopoverProps = {
  state: OverlayTriggerState;
  type: 'tree';
};

export type TreeSelectAria = {
  /** Props for the label element. */
  labelProps: HTMLAttributes<HTMLElement>;
  /** Props for the popup trigger element. */
  triggerProps: HTMLAttributes<HTMLElement>;
  /** Props for the element representing the selected value. */
  valueProps: HTMLAttributes<HTMLElement>;
  /** Props for the popup tree. */
  treeProps: Omit<TreeProps<TreeSelectNode>, 'children' | 'items'>;
  /** Base props for the popover. */
  popoverProps: TreeSelectPopoverProps;
  /** Props for the select description element, if any. */
  descriptionProps: HTMLAttributes<HTMLElement>;
  /** Props for the select error message element, if any. */
  errorMessageProps: HTMLAttributes<HTMLElement>;
} & ValidationResult;

export function useTreeSelect(
  props: AriaTreeSelectOptions,
  state: TreeSelectState
): TreeSelectAria {
  const { triggerRef } = props;

  const { isInvalid, validationErrors, validationDetails } =
    state.displayValidation;

  const { labelProps, fieldProps, errorMessageProps, descriptionProps } =
    useField({
      ...props,
      isInvalid,
      description: props.caption,
      labelElementType: 'span',
      errorMessage: props.errorMessage || validationErrors,
    });

  const { triggerProps: overlayTriggerProps, overlayProps } = useOverlayTrigger(
    { type: 'tree' },
    state,
    triggerRef
  );

  const valueId = useId();

  const handleSelectionChange = (keys: Selection) => {
    if (keys === 'all') return;

    const [first] = keys;

    state.setSelectedKey(first != null ? String(first) : null);
    state.close();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (props.isDisabled) return;

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

  const triggerProps = mergeProps(
    filterDOMProps(props, { labelable: true }),
    fieldProps,
    overlayTriggerProps,
    {
      'aria-haspopup': 'tree',
      'aria-labelledby': [
        fieldProps['aria-labelledby'],
        fieldProps['aria-label'] ? overlayTriggerProps.id : null,
        valueId,
      ]
        .filter(Boolean)
        .join(' '),
      onFocus(event: FocusEvent<HTMLElement>) {
        if (state.isFocused) return;

        props.onFocus?.(event);
        state.setFocused(true);
      },
      onBlur(event: FocusEvent<HTMLElement>) {
        if (state.isOpen) return;

        props.onBlur?.(event);
        state.setFocused(false);
      },
      onKeyDown: chain(
        overlayTriggerProps.onKeyDown,
        handleTriggerKeyDown,
        props.onKeyDown
      ),
      onKeyUp: props.onKeyUp,
    }
  );

  const treeProps: TreeSelectAria['treeProps'] = mergeProps(overlayProps, {
    selectionMode: 'single' as const,
    selectedKeys: state.selectedKeys,
    expandedKeys: state.expandedKeys,
    disabledKeys: state.disabledKeys,
    autoFocus: state.isOpen || undefined,
    'aria-label': fieldProps['aria-label'],
    'aria-labelledby': fieldProps['aria-labelledby'],
    onExpandedChange: state.setExpandedKeys,
    onSelectionChange: handleSelectionChange,
    onBlur(event: FocusEvent<HTMLElement>) {
      if (event.currentTarget.contains(event.relatedTarget as Node)) {
        return;
      }

      props.onBlur?.(event);
      state.setFocused(false);
    },
  });

  return {
    labelProps: {
      ...labelProps,
      onClick: () => {
        if (props.isDisabled) return;

        triggerRef.current?.focus();
        setInteractionModality('keyboard');
      },
    },
    triggerProps,
    valueProps: { id: valueId },
    treeProps,
    popoverProps: {
      state,
      type: 'tree',
    },
    descriptionProps,
    errorMessageProps,
    isInvalid,
    validationErrors,
    validationDetails,
  };
}
