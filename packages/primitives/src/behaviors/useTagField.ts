import { useCallback, useMemo, useRef } from 'react';
import type {
  ClipboardEvent,
  FocusEvent,
  HTMLAttributes,
  MouseEvent,
  Ref,
  RefObject,
} from 'react';

import type { FocusStrategy, Key, ValidationResult } from '@koobiq/react-core';
import {
  mergeProps,
  useCollator,
  useControlledState,
  useDOMRef,
  useKeyboard,
} from '@koobiq/react-core';
import { getItemId } from '@react-aria/listbox';
import {
  ListKeyboardDelegate,
  useSelectableCollection,
} from '@react-aria/selection';
import type { AriaTextFieldProps, TextFieldAria } from '@react-aria/textfield';
import { useTextField } from '@react-aria/textfield';
import { useSlottedContext } from 'react-aria-components';

import { FormContext } from '../components';
import { removeDataAttributes } from '../utils';

import type { TagAutocompleteState } from './useTagAutocomplete';
import type { TagListState } from './useTagListState';

const DEFAULT_SPLIT_PATTERN = /,/;

const splitInputValue = (raw: string, splitPattern: RegExp): string[] =>
  raw
    .split(splitPattern)
    .map((value) => value.trim())
    .filter(Boolean);

const testSplitPattern = (splitPattern: RegExp, value: string): boolean => {
  splitPattern.lastIndex = 0;

  return splitPattern.test(value);
};

/** How the user's input ended up as new tags. */
export type TagFieldAddSource = 'enter' | 'separator' | 'paste' | 'blur';

export type TagFieldAddContext = {
  source: TagFieldAddSource;
};

export interface AriaTagFieldProps extends Omit<
  AriaTextFieldProps<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange'
> {
  /** Fires when the user commits one or more new values from the text input. */
  onAdd?: (values: string[], context: TagFieldAddContext) => void;
  /** Fires when the user removes one or more tags. */
  onRemove?: (keys: Set<Key>) => void;
  /** Controlled value of the text input. */
  inputValue?: string;
  /** Uncontrolled initial value of the text input. */
  defaultInputValue?: string;
  /** Fires whenever the text input value changes. */
  onInputChange?: (value: string) => void;
  /**
   * Characters (besides Enter) that commit the current input as a new tag.
   * @default /,/
   */
  splitPattern?: RegExp;
  /**
   * Whether to suppress committing the input value as a new tag when focus leaves the field.
   * @default false
   */
  disableCommitOnBlur?: boolean;
  /** Whether to show the cleaner button that removes all tags and the input. */
  isClearable?: boolean;
  /** Fires after the cleaner is pressed and the field is reset. */
  onClear?: () => void;
}

export type TagFieldClearButtonProps = {
  isClearable: boolean;
  tabIndex: -1 | undefined;
  isHidden: boolean;
  onPress: () => void;
};

export type TagFieldTagListProps<T extends object> = {
  state: TagListState<T>;
  isDisabled: boolean | undefined;
  tabIndex: -1;
  onRemove: ((keys: Set<Key>) => void) | undefined;
  'aria-label': string;
};

export type TagFieldTagListContainerProps = HTMLAttributes<HTMLDivElement> & {
  ref: RefObject<HTMLDivElement | null>;
  role: 'presentation';
};

export interface TagFieldAria<T extends object> extends ValidationResult {
  /** Props for the label element. */
  labelProps: TextFieldAria<'input'>['labelProps'];
  /** Props for the input element. */
  inputProps: TextFieldAria<'input'>['inputProps'];
  /** Props for the description element, if any. */
  descriptionProps: TextFieldAria<'input'>['descriptionProps'];
  /** Props for the error message element, if any. */
  errorMessageProps: TextFieldAria<'input'>['errorMessageProps'];
  /** Props for a clear button that clears tags and input text. */
  clearButtonProps: TagFieldClearButtonProps;
  /** Props for the owning tag list. */
  tagListProps: TagFieldTagListProps<T>;
  /** Props for the tag list/input canvas. */
  tagListContainerProps: TagFieldTagListContainerProps;
  /** Ref for the input element. */
  inputRef: RefObject<HTMLInputElement | null>;
  /** Current input value. */
  inputValue: string;
  isDisabled: boolean | undefined;
  isReadOnly: boolean | undefined;
  isRequired: boolean | undefined;
}

export function useTagField<T extends object>(
  props: AriaTagFieldProps,
  state: TagListState<T>,
  ref?: Ref<HTMLInputElement>,
  autocomplete?: TagAutocompleteState | null
): TagFieldAria<T> {
  const {
    onAdd,
    onRemove,
    splitPattern = DEFAULT_SPLIT_PATTERN,
    disableCommitOnBlur,
    inputValue,
    defaultInputValue,
    onInputChange,
    isClearable,
    onClear,
    isDisabled,
    isReadOnly,
    isRequired,
    validationBehavior: validationBehaviorProp,
    'aria-label': ariaLabel,
    ...textFieldProps
  } = props;

  const {
    overlayState: autocompleteOverlayState,
    listState: autocompleteListState,
    onAction: autocompleteOnAction,
    popoverRef,
    listBoxRef,
    listBoxId,
  } = autocomplete ?? {};

  const inputRef = useDOMRef<HTMLInputElement>(ref);
  const innerRef = useRef<HTMLDivElement>(null);
  const collator = useCollator({ usage: 'search', sensitivity: 'base' });

  const [inputValueState, setInputValueState] = useControlledState<string>(
    inputValue,
    defaultInputValue ?? '',
    onInputChange
  );

  const addTagsFromInput = useCallback(
    (raw: string, source: TagFieldAddSource) => {
      if (isDisabled || isReadOnly || !onAdd) return;
      const candidates = splitInputValue(raw, splitPattern);
      if (candidates.length === 0) return;
      onAdd(candidates, { source });
      setInputValueState('');
    },
    [isDisabled, isReadOnly, splitPattern, onAdd, setInputValueState]
  );

  const handleRemove = useCallback(
    (keys: Set<Key>) => {
      if (isDisabled || isReadOnly) return;
      onRemove?.(keys);

      if (keys.size >= state.collection.size) {
        inputRef.current?.focus({ preventScroll: true });
      }
    },
    [isDisabled, isReadOnly, onRemove, state.collection.size, inputRef]
  );

  const focusTagAt = useCallback(
    (position: 'first' | 'last') => {
      const key =
        position === 'first'
          ? state.collection.getFirstKey()
          : state.collection.getLastKey();

      if (key == null) return;
      state.selectionManager.setFocused(true);
      state.selectionManager.setFocusedKey(key);
    },
    [state.collection, state.selectionManager]
  );

  const resetTagListFocus = useCallback(() => {
    state.selectionManager.setFocused(false);
    state.selectionManager.setFocusedKey(null);
  }, [state.selectionManager]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const openAutocomplete = useCallback(
    (focusStrategy?: FocusStrategy) => {
      autocomplete?.open(focusStrategy);
    },
    [autocomplete]
  );

  const closeAutocomplete = useCallback(() => {
    autocomplete?.close();
  }, [autocomplete]);

  const handleClear = useCallback(() => {
    if (isDisabled || isReadOnly) return;
    const allKeys = new Set<Key>(state.collection.getKeys());
    if (allKeys.size > 0) onRemove?.(allKeys);
    setInputValueState('');
    onClear?.();
    focusInput();
  }, [
    onClear,
    onRemove,
    isDisabled,
    isReadOnly,
    focusInput,
    setInputValueState,
    state.collection,
  ]);

  const collectionState = autocompleteListState ?? state;
  const collectionRef = listBoxRef ?? innerRef;

  const keyboardDelegate = useMemo(
    () =>
      new ListKeyboardDelegate({
        collection: collectionState.collection,
        collator,
        disabledBehavior: collectionState.selectionManager.disabledBehavior,
        disabledKeys: collectionState.disabledKeys,
        ref: collectionRef,
      }),
    [
      collator,
      collectionRef,
      collectionState.collection,
      collectionState.disabledKeys,
      collectionState.selectionManager.disabledBehavior,
    ]
  );

  const { collectionProps: autocompleteCollectionProps } =
    useSelectableCollection({
      selectionManager: collectionState.selectionManager,
      keyboardDelegate,
      disallowEmptySelection: true,
      disallowTypeAhead: true,
      isVirtualized: true,
      ref: inputRef,
      selectOnFocus: false,
      shouldUseVirtualFocus: true,
    });

  const isAutocompleteOpen = Boolean(
    autocompleteOverlayState?.isOpen && autocompleteListState
  );

  const focusedAutocompleteKey =
    isAutocompleteOpen && autocompleteListState
      ? autocompleteListState.selectionManager.focusedKey
      : null;

  const autocompleteActiveDescendant =
    focusedAutocompleteKey != null && autocompleteListState
      ? getItemId(autocompleteListState, focusedAutocompleteKey)
      : undefined;

  const selectFocusedAutocompleteOption = useCallback(() => {
    if (
      !isAutocompleteOpen ||
      !autocompleteListState ||
      !autocompleteOnAction
    ) {
      return false;
    }

    const { focusedKey } = autocompleteListState.selectionManager;
    if (focusedKey == null) return false;

    autocompleteOnAction(focusedKey);

    return true;
  }, [autocompleteListState, autocompleteOnAction, isAutocompleteOpen]);

  const { keyboardProps: inputKeyboardProps } = useKeyboard({
    isDisabled: isDisabled || isReadOnly,
    onKeyDown: (event) => {
      if (event.nativeEvent.isComposing) {
        event.continuePropagation();

        return;
      }

      if (event.key === 'Escape' && autocompleteOverlayState?.isOpen) {
        event.preventDefault();
        closeAutocomplete();

        return;
      }

      if (event.key === 'Enter') {
        if (selectFocusedAutocompleteOption()) {
          event.preventDefault();

          return;
        }

        if (inputValueState.trim() && onAdd) {
          event.preventDefault();
          addTagsFromInput(inputValueState, 'enter');

          return;
        }

        event.continuePropagation();

        return;
      }

      if (
        autocompleteOverlayState &&
        (event.key === 'ArrowDown' || event.key === 'ArrowUp')
      ) {
        event.preventDefault();

        if (!autocompleteOverlayState.isOpen) {
          openAutocomplete(event.key === 'ArrowDown' ? 'first' : 'last');

          return;
        }

        event.continuePropagation();

        return;
      }

      if (event.key.length === 1 && testSplitPattern(splitPattern, event.key)) {
        if (!onAdd) {
          event.continuePropagation();

          return;
        }

        if (inputValueState.trim()) {
          addTagsFromInput(inputValueState, 'separator');
        }

        event.preventDefault();

        return;
      }

      const input = event.currentTarget;
      const { selectionStart, selectionEnd } = input;

      const isCaretAtStart =
        selectionStart === 0 && selectionEnd === 0 && !inputValueState;

      const hasTags = state.collection.size > 0;

      if (
        isCaretAtStart &&
        (event.key === 'Backspace' || event.key === 'ArrowLeft')
      ) {
        if (!hasTags) {
          event.continuePropagation();

          return;
        }

        event.preventDefault();
        focusTagAt('last');

        return;
      }

      if (
        !inputValueState &&
        hasTags &&
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'a' || event.key === 'A')
      ) {
        event.preventDefault();
        state.selectionManager.selectAll();
        focusTagAt('last');

        return;
      }

      if (isCaretAtStart && event.key === 'Tab' && event.shiftKey && hasTags) {
        event.preventDefault();
        focusTagAt('first');

        return;
      }

      event.continuePropagation();
    },
  });

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      if (isDisabled || isReadOnly) return;
      const text = event.clipboardData.getData('text/plain');
      const input = event.currentTarget;
      const selectionStart = input.selectionStart ?? input.value.length;
      const selectionEnd = input.selectionEnd ?? selectionStart;
      const nextValue = `${input.value.slice(0, selectionStart)}${text}${input.value.slice(selectionEnd)}`;

      if (!text || !onAdd || !testSplitPattern(splitPattern, nextValue)) return;

      event.preventDefault();
      const candidates = splitInputValue(nextValue, splitPattern);
      if (candidates.length === 0) return;
      onAdd(candidates, { source: 'paste' });
      setInputValueState('');
    },
    [isDisabled, isReadOnly, splitPattern, onAdd, setInputValueState]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      if (isDisabled || isReadOnly || disableCommitOnBlur) return;
      const next = event.relatedTarget;

      if (next && innerRef.current?.contains(next)) return;
      if (next && popoverRef?.current?.contains(next)) return;

      if (inputValueState.trim()) {
        addTagsFromInput(inputValueState, 'blur');
      }
    },
    [
      isDisabled,
      isReadOnly,
      disableCommitOnBlur,
      inputValueState,
      addTagsFromInput,
      popoverRef,
    ]
  );

  const handleTagListContainerBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const next = event.relatedTarget;
      if (next && event.currentTarget.contains(next)) return;

      resetTagListFocus();
    },
    [resetTagListFocus]
  );

  const handleTagListContainerMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      focusInput();
    },
    [focusInput]
  );

  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};

  const validationBehavior =
    validationBehaviorProp ?? formValidationBehavior ?? 'aria';

  const {
    labelProps,
    inputProps: inputPropsAria,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useTextField<'input'>(
    {
      ...removeDataAttributes({
        ...textFieldProps,
        isDisabled,
        isReadOnly,
        isRequired,
        value: inputValueState,
        defaultValue: defaultInputValue,
        onChange: setInputValueState,
        validationBehavior,
        'aria-label': ariaLabel,
      }),
      inputElementType: 'input',
    },
    inputRef
  );

  const hasTags = state.collection.size > 0;
  const hasInputValue = inputValueState !== '';
  const showCleaner = Boolean(isClearable);

  const cleanerIsHidden = Boolean(
    !showCleaner || (!hasTags && !hasInputValue) || isDisabled || isReadOnly
  );

  const clearButtonProps: TagFieldClearButtonProps = {
    isClearable: showCleaner,
    tabIndex: cleanerIsHidden ? -1 : undefined,
    isHidden: cleanerIsHidden,
    onPress: handleClear,
  };

  const tagListProps = {
    state,
    isDisabled,
    tabIndex: -1,
    onRemove: isReadOnly ? undefined : handleRemove,
    'aria-label': ariaLabel ?? 'Selected tags',
  } as const;

  const tagListContainerProps = {
    ref: innerRef,
    role: 'presentation',
    onMouseDown: handleTagListContainerMouseDown,
    onBlur: handleTagListContainerBlur,
  } as const;

  const comboboxInputProps = autocompleteOverlayState
    ? {
        onFocus: () => openAutocomplete(),
        role: 'combobox',
        'aria-expanded': autocompleteOverlayState.isOpen,
        'aria-controls': autocompleteOverlayState.isOpen
          ? listBoxId
          : undefined,
        'aria-autocomplete': 'list',
        autoComplete: 'off',
        autoCorrect: 'off',
        spellCheck: 'false',
      }
    : undefined;

  const autocompleteKeyboardProps = isAutocompleteOpen
    ? {
        onKeyDown: autocompleteCollectionProps.onKeyDown,
        'aria-activedescendant': autocompleteActiveDescendant,
      }
    : undefined;

  const inputProps = mergeProps(
    inputPropsAria,
    comboboxInputProps,
    autocompleteKeyboardProps,
    {
      onFocus: resetTagListFocus,
      onPaste: handlePaste,
      onBlur: handleBlur,
    },
    inputKeyboardProps
  );

  return {
    ...validation,
    clearButtonProps,
    descriptionProps,
    errorMessageProps,
    inputProps,
    inputRef,
    inputValue: inputValueState,
    isDisabled,
    isReadOnly,
    isRequired,
    labelProps,
    tagListContainerProps,
    tagListProps,
  };
}
