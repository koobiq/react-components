import { useState } from 'react';

import type {
  AsyncLoadable,
  CollectionBase,
  FocusableProps,
  InputBase,
  LabelableProps,
  MultipleSelection,
  TextInputBase,
  Validation,
} from '@koobiq/react-core';
import type { FormValidationState } from '@react-stately/form';
import { useFormValidationState } from '@react-stately/form';
import type { MenuTriggerState } from '@react-stately/menu';
import { useMenuTriggerState } from '@react-stately/menu';
import type { OverlayTriggerProps } from '@react-types/overlays';

import type { MultiSelectListState } from './useMultiSelectListState';
import { useMultiSelectListState } from './useMultiSelectListState';

export interface MultiSelectProps<T>
  extends CollectionBase<T>,
    AsyncLoadable,
    Omit<InputBase, 'isReadOnly'>,
    Validation,
    LabelableProps,
    TextInputBase,
    MultipleSelection,
    FocusableProps,
    OverlayTriggerProps {
  /**
   * Whether the menu should automatically flip direction when space is limited.
   * @default true
   */
  shouldFlip?: boolean;
}

export interface MultiSelectState<T>
  extends MultiSelectListState<T>,
    MenuTriggerState,
    FormValidationState {
  /** Whether the select is currently focused. */
  isFocused: boolean;

  /** Sets whether the select is focused. */
  setFocused(isFocused: boolean): void;
}

export function useMultiSelectState<T extends object>({
  validate,
  validationBehavior,
  ...props
}: MultiSelectProps<T>): MultiSelectState<T> {
  const [isFocused, setFocused] = useState(false);

  const triggerState = useMenuTriggerState(props);

  const listState = useMultiSelectListState({
    ...props,
    onSelectionChange: (keys) => {
      if (props.onSelectionChange != null) {
        if (keys === 'all') {
          // This may change back to "all" once we will implement async loading of additional
          // items and differentiation between "select all" vs. "select visible".
          props.onSelectionChange(new Set(listState.collection.getKeys()));
        } else {
          props.onSelectionChange(keys);
        }
      }

      // Multi select stays open after item selection
      if (props.selectionMode === 'single') {
        triggerState.close();
      }
    },
  });

  const validationState = useFormValidationState<Set<string>>({
    ...props,
    validationBehavior,
    validate: (value) => {
      if (!validate) return;
      const keys = Array.from(value as Set<string>);

      // eslint-disable-next-line consistent-return
      return validate(props.selectionMode === 'single' ? keys[0] : keys);
    },
    value: listState.selectedKeys as Set<string>,
  });

  return {
    ...validationState,
    ...listState,
    ...triggerState,
    close() {
      triggerState.close();
    },
    open() {
      // Don't open if the collection is empty.
      if (listState.collection.size !== 0) {
        triggerState.open();
      }
    },
    toggle(focusStrategy) {
      if (listState.collection.size !== 0) {
        triggerState.toggle(focusStrategy);
      }
    },
    isFocused,
    setFocused,
  };
}
