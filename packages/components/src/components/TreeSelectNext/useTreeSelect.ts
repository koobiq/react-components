import type { HTMLAttributes, KeyboardEvent } from 'react';

import { chain, mergeProps, useId } from '@koobiq/react-core';
import type { RefObject, ValidationResult } from '@koobiq/react-core';
import { useField } from '@react-aria/label';
import { useOverlayTrigger } from '@react-aria/overlays';
import type { TreeProps } from 'react-aria-components';

import type {
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

export type AriaTreeSelectOptions<T extends object> = TreeSelectStateOptions<T>;

export function useTreeSelect<T extends object>(
  props: AriaTreeSelectOptions<T>,
  state: TreeSelectState<T>,
  ref: RefObject<HTMLElement | null>
): TreeSelectAria<T> {
  const { displayValidation, isOpen, setOpen, open, close, toggle } = state;

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
    onFocus() {
      // event: FocusEvent<HTMLElement>
      // if (state.isFocused) return;
      //
      // props.onFocus?.(event);
      // state.setFocused(true);
    },
    onBlur() {
      // event: FocusEvent<HTMLElement>
      if (state.isOpen) return;

      // props.onBlur?.(event);
      // state.setFocused(false);
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
    'aria-label': fieldProps['aria-label'],
    'aria-labelledby': fieldProps['aria-labelledby'],
  });

  return {
    isInvalid,
    labelProps,
    valueProps: { id: valueId },
    triggerProps,
    errorMessageProps,
    descriptionProps,
    treeProps,
    validationErrors,
    validationDetails,
  };
}
