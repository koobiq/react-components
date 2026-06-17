import { useCallback, useMemo, useRef } from 'react';
import type {
  ClipboardEvent,
  FocusEvent,
  HTMLAttributes,
  PointerEvent,
  Ref,
  RefObject,
} from 'react';

import type {
  CollectionChildren,
  FocusStrategy,
  Key,
  Selection,
  ValidationResult,
} from '@koobiq/react-core';
import {
  mergeProps,
  useCollator,
  useControlledState,
  useDOMRef,
  useKeyboard,
  useLocalizedStringFormatter,
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
import intlMessages from '../intl/tag-field.json';
import { removeDataAttributes } from '../utils';

import type { TagAutocompleteState } from './useTagAutocomplete';
import {
  isInteractiveTarget,
  type TagListItemRemoveContext,
} from './useTagListItem';
import type { TagListState } from './useTagListState';
import { useTagListState } from './useTagListState';

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
export type TagFieldAddSource =
  | 'enter'
  | 'separator'
  | 'paste'
  | 'blur'
  | 'suggestion';

export type TagFieldAddContext<T = unknown> =
  | { source: Exclude<TagFieldAddSource, 'suggestion'> }
  | { source: 'suggestion'; suggestion: T };

export type AriaTagFieldProps<T extends object> = Omit<
  AriaTextFieldProps<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange'
> & {
  /** Tag collection items. */
  items?: Iterable<T>;
  /** Render function for each item in the collection. */
  children: CollectionChildren<T>;
  /** Keys of tags rendered as disabled. */
  disabledKeys?: Iterable<Key>;
  /** Controlled set of selected tag keys. */
  selectedKeys?: Selection;
  /** Uncontrolled initial set of selected tag keys. */
  defaultSelectedKeys?: Iterable<Key>;
  /** Fires when the selected tag keys change. */
  onSelectionChange?: (keys: Selection) => void;
  /** Fires when the user commits one or more new values from the text input. */
  onAdd?: (values: string[], context: TagFieldAddContext<T>) => void;
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
};

export type TagFieldClearButtonProps = {
  /** Whether the cleaner should render in the DOM. */
  isClearable: boolean;
  tabIndex: -1 | undefined;
  isHidden: boolean;
  onPress: () => void;
};

export type TagFieldTagListProps<T extends object> = {
  state: TagListState<T>;
  isDisabled: boolean | undefined;
  tabIndex: -1;
  onRemove:
    | ((keys: Set<Key>, context?: TagListItemRemoveContext) => void)
    | undefined;
  'aria-label': string;
};

export type TagFieldTagListContainerProps = HTMLAttributes<HTMLDivElement> & {
  ref: RefObject<HTMLDivElement | null>;
  role: 'presentation';
};

export type TagFieldStateProps<T extends object> = AriaTagFieldProps<T>;

export type TagFieldState<T extends object> = TagListState<T> & {
  /** Current input value. */
  inputValue: string;
  /** Initial input value. */
  defaultInputValue: string;
  /** Updates the input value. */
  setInputValue: (value: string) => void;
  /** Whether adding new values is currently allowed. */
  allowsAdding: boolean;
  /** Resolved disabled state. */
  isDisabled: boolean | undefined;
  /** Resolved read-only state. */
  isReadOnly: boolean | undefined;
  /** Adds raw values with the provided context and clears the input. */
  addValues: (values: string[], context: TagFieldAddContext<T>) => boolean;
  /** Splits and adds the current input value, or a provided raw value. */
  addFromInput: (
    source: Exclude<TagFieldAddSource, 'suggestion'>,
    rawValue?: string
  ) => boolean;
  /** Whether the provided text should split the input into tags. */
  isSeparator: (value: string) => boolean;
  /** Removes the provided tag keys. */
  remove: (keys: Set<Key>) => boolean;
  /** Clears all tags and the input value. */
  clear: () => boolean;
};

type TagFieldAutocompleteProps = {
  popoverRef?: RefObject<HTMLDivElement | null>;
  listBoxRef?: RefObject<HTMLUListElement | null>;
};

export function useTagFieldState<T extends object>(
  props: TagFieldStateProps<T>
): TagFieldState<T> {
  const {
    items,
    children,
    disabledKeys,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    inputValue: inputValueProp,
    defaultInputValue: defaultInputValueProp,
    onInputChange,
    splitPattern = DEFAULT_SPLIT_PATTERN,
    onAdd,
    onRemove,
    onClear,
    isDisabled,
    isReadOnly,
  } = props;

  const tagListState = useTagListState<T>({
    items,
    children,
    disabledKeys,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    selectionMode: isReadOnly ? 'none' : 'multiple',
  });

  const [inputValue, setInputValue] = useControlledState<string>(
    inputValueProp,
    defaultInputValueProp ?? '',
    onInputChange
  );

  const defaultInputValue = defaultInputValueProp ?? '';
  const allowsAdding = Boolean(onAdd && !isDisabled && !isReadOnly);

  const addValues = useCallback(
    (values: string[], context: TagFieldAddContext<T>) => {
      if (!allowsAdding || values.length === 0) return false;

      onAdd?.(values, context);
      setInputValue('');

      return true;
    },
    [allowsAdding, onAdd, setInputValue]
  );

  const addFromInput = useCallback(
    (
      source: Exclude<TagFieldAddSource, 'suggestion'>,
      rawValue = inputValue
    ) => {
      const candidates = splitInputValue(rawValue, splitPattern);

      return addValues(candidates, { source });
    },
    [addValues, inputValue, splitPattern]
  );

  const isSeparator = useCallback(
    (value: string) => testSplitPattern(splitPattern, value),
    [splitPattern]
  );

  const remove = useCallback(
    (keys: Set<Key>) => {
      if (isDisabled || isReadOnly || !onRemove) return false;

      onRemove(keys);

      return true;
    },
    [isDisabled, isReadOnly, onRemove]
  );

  const clear = useCallback(() => {
    if (isDisabled || isReadOnly) return false;

    const allKeys = new Set<Key>(tagListState.collection.getKeys());
    if (allKeys.size > 0) onRemove?.(allKeys);

    setInputValue('');
    onClear?.();

    return true;
  }, [
    isDisabled,
    isReadOnly,
    onClear,
    onRemove,
    setInputValue,
    tagListState.collection,
  ]);

  return {
    ...tagListState,
    inputValue,
    defaultInputValue,
    setInputValue,
    allowsAdding,
    isDisabled,
    isReadOnly,
    addValues,
    addFromInput,
    isSeparator,
    remove,
    clear,
  };
}

export type TagFieldAria<T extends object> = ValidationResult & {
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
};

export function useTagField<T extends object>(
  props: AriaTagFieldProps<T> & TagFieldAutocompleteProps,
  state: TagFieldState<T> | TagAutocompleteState<T>,
  ref?: Ref<HTMLInputElement>
): TagFieldAria<T> {
  const {
    disableCommitOnBlur,
    isClearable,
    isRequired,
    validationBehavior: validationBehaviorProp,
    'aria-label': ariaLabel,
    popoverRef,
    listBoxRef,
    isDisabled,
    isReadOnly,
    ...textFieldProps
  } = props;

  const {
    inputValue,
    defaultInputValue,
    setInputValue,
    allowsAdding,
    collection,
    selectionManager,
    addFromInput,
    isSeparator,
    remove,
    clear,
  } = state;

  const {
    overlayState: autocompleteOverlayState,
    listState: autocompleteListState,
    onAction: autocompleteOnAction,
    listBoxId,
    open: autocompleteOpen,
    close: autocompleteClose,
  } = state as Partial<TagAutocompleteState<T>>;

  const inputRef = useDOMRef<HTMLInputElement>(ref);
  const innerRef = useRef<HTMLDivElement>(null);
  const collator = useCollator({ usage: 'search', sensitivity: 'base' });
  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  const handleRemove = useCallback(
    (keys: Set<Key>, context?: TagListItemRemoveContext) => {
      if (
        remove(keys) &&
        (context?.source === 'press' || keys.size >= collection.size)
      ) {
        inputRef.current?.focus({ preventScroll: true });
      }
    },
    [collection, inputRef, remove]
  );

  const focusTagAt = useCallback(
    (position: 'first' | 'last') => {
      const key =
        position === 'first'
          ? collection.getFirstKey()
          : collection.getLastKey();

      if (key == null) return;
      selectionManager.setFocused(true);
      selectionManager.setFocusedKey(key);
    },
    [collection, selectionManager]
  );

  const resetTagListFocus = useCallback(() => {
    selectionManager.setFocused(false);
    selectionManager.setFocusedKey(null);
  }, [selectionManager]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const openAutocomplete = useCallback(
    (focusStrategy?: FocusStrategy) => {
      autocompleteOpen?.(focusStrategy);
    },
    [autocompleteOpen]
  );

  const closeAutocomplete = useCallback(() => {
    autocompleteClose?.();
  }, [autocompleteClose]);

  const handleClear = useCallback(() => {
    if (clear()) focusInput();
  }, [clear, focusInput]);

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
      collectionRef,
      collectionState.collection,
      collectionState.disabledKeys,
      collectionState.selectionManager.disabledBehavior,
      collator,
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
    isDisabled,
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

        if (inputValue.trim() && addFromInput('enter')) {
          event.preventDefault();

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

      if (event.key.length === 1 && isSeparator(event.key)) {
        if (!allowsAdding) {
          event.continuePropagation();

          return;
        }

        if (inputValue.trim()) {
          addFromInput('separator');
        }

        // Don't let a bare separator end up in the input either way.
        event.preventDefault();

        return;
      }

      const input = event.currentTarget;
      const { selectionStart, selectionEnd } = input;

      const isCaretAtStart =
        selectionStart === 0 && selectionEnd === 0 && !inputValue;

      const hasTags = collection.size > 0;

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
        !inputValue &&
        hasTags &&
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'a' || event.key === 'A')
      ) {
        event.preventDefault();
        selectionManager.selectAll();
        focusTagAt('last');

        return;
      }

      // Shift+Tab from empty input -> focus the first tag.
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
      const text = event.clipboardData.getData('text/plain');
      const input = event.currentTarget;
      const selectionStart = input.selectionStart ?? input.value.length;
      const selectionEnd = input.selectionEnd ?? selectionStart;
      const nextValue = `${input.value.slice(0, selectionStart)}${text}${input.value.slice(selectionEnd)}`;

      if (!text || !allowsAdding || !isSeparator(nextValue)) {
        return;
      }

      event.preventDefault();
      addFromInput('paste', nextValue);
    },
    [addFromInput, allowsAdding, isSeparator]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const next = event.relatedTarget;

      if (next && innerRef.current?.contains(next)) return;
      if (next && popoverRef?.current?.contains(next)) return;

      if (next) {
        closeAutocomplete();
      }

      if (isDisabled || isReadOnly || disableCommitOnBlur) return;

      if (inputValue.trim()) {
        addFromInput('blur');
      }
    },
    [
      addFromInput,
      closeAutocomplete,
      disableCommitOnBlur,
      inputValue,
      isDisabled,
      isReadOnly,
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

  const handleTagListContainerPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const isPlainPrimaryClick =
        event.button === 0 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey;

      if (!isPlainPrimaryClick || inputRef.current?.contains(target)) return;

      if (event.target !== event.currentTarget) {
        const row = target.closest('[role="row"]');

        if (!row || !event.currentTarget.contains(row)) return;
        if (target !== row && isInteractiveTarget(target, row)) return;

        event.stopPropagation();
      }

      event.preventDefault();
      resetTagListFocus();
      focusInput();
      openAutocomplete();
    },
    [focusInput, inputRef, openAutocomplete, resetTagListFocus]
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
        value: inputValue,
        defaultValue: defaultInputValue,
        onChange: setInputValue,
        validationBehavior,
        'aria-label': ariaLabel,
      }),
      inputElementType: 'input',
    },
    inputRef
  );

  const hasTags = collection.size > 0;
  const hasInputValue = inputValue !== '';
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
    'aria-label': ariaLabel ?? stringFormatter.format('tagListLabel'),
  } as const;

  const tagListContainerProps = {
    ref: innerRef,
    role: 'presentation',
    onPointerDownCapture: handleTagListContainerPointerDown,
    onBlur: handleTagListContainerBlur,
  } as const;

  const comboboxInputProps = autocompleteOverlayState
    ? {
        onFocus: () => openAutocomplete(),
        // Reopen suggestions when typing resumes after a selection (or Escape)
        // closed the popover — focus stays in the input, so `onFocus` won't fire.
        onInput: () => {
          if (!autocompleteOverlayState?.isOpen) openAutocomplete();
        },
        onClick: () => {
          if (!autocompleteOverlayState?.isOpen) openAutocomplete();
        },
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
    inputValue,
    labelProps,
    tagListContainerProps,
    tagListProps,
  };
}
