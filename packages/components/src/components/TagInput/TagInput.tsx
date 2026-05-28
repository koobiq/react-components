'use client';

import { forwardRef, useCallback, useRef } from 'react';
import type { ClipboardEvent, FocusEvent, MouseEvent, Ref } from 'react';

import type { Key } from '@koobiq/react-core';
import {
  mergeProps,
  useControlledState,
  useDOMRef,
  useKeyboard,
} from '@koobiq/react-core';
import { TextField, useTagListState } from '@koobiq/react-primitives';

import { useForm } from '../Form';
import type {
  FormFieldProps,
  FormFieldInputProps,
  FormFieldLabelProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
} from '../FormField';
import { FormField, FormFieldClearButton } from '../FormField';
import type { TagListInnerProps } from '../TagList';
import { Tag } from '../TagList/Tag';
import { TagListInner } from '../TagList/TagListInner';

import { useFieldSizingFallback } from './hooks/useFieldSizingFallback';
import s from './TagInput.module.css';
import type {
  TagInputAddSource,
  TagInputComponent,
  TagInputProps,
} from './types';
import { testSplitPattern, splitInputValue } from './utils';

const DEFAULT_SPLIT_PATTERN = /,/;

/**
 * An input component that allows users to enter, display, and manage
 * multiple tags or keywords dynamically. It supports adding and removing
 * tags.
 */
function TagInputRender<T extends object>(
  props: TagInputProps<T>,
  ref?: Ref<HTMLInputElement>
) {
  const {
    items,
    children,
    onAdd,
    onRemove,
    splitPattern = DEFAULT_SPLIT_PATTERN,
    variant = 'filled',
    name,
    className,
    style,
    inputValue,
    defaultInputValue,
    onInputChange,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disabledKeys,
    placeholder,
    isClearable,
    onClear,
    label,
    caption,
    errorMessage,
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    isRequired,
    isInvalid,
    isLabelHidden,
    fullWidth,
    labelPlacement,
    labelAlign,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'data-testid': dataTestid,
    slotProps,
  } = props;

  const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } = useForm();
  const isDisabled = isDisabledProp ?? formIsDisabled;
  const isReadOnly = isReadOnlyProp ?? formIsReadOnly;

  const inputRef = useDOMRef<HTMLInputElement>(ref);
  const innerRef = useRef<HTMLDivElement>(null);

  const tagListState = useTagListState<T>({
    items,
    children,
    // Read-only fields keep focus navigation but disable tag selection.
    selectionMode: isReadOnly ? 'none' : 'multiple',
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disabledKeys,
  });

  const [inputValueState, setInputValueState] = useControlledState<string>(
    inputValue,
    defaultInputValue ?? '',
    onInputChange
  );

  useFieldSizingFallback(inputRef, {
    fallbackText: placeholder,
    text: inputValueState,
  });

  const addTagsFromInput = useCallback(
    (raw: string, source: TagInputAddSource) => {
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

      if (keys.size >= tagListState.collection.size) {
        inputRef.current?.focus({ preventScroll: true });
      }
    },
    [isDisabled, isReadOnly, onRemove, tagListState.collection.size, inputRef]
  );

  const focusTagAt = useCallback(
    (position: 'first' | 'last') => {
      const key =
        position === 'first'
          ? tagListState.collection.getFirstKey()
          : tagListState.collection.getLastKey();

      if (key == null) return;
      tagListState.selectionManager.setFocused(true);
      tagListState.selectionManager.setFocusedKey(key);
    },
    [tagListState.collection, tagListState.selectionManager]
  );

  const resetTagListFocus = useCallback(() => {
    tagListState.selectionManager.setFocused(false);
    tagListState.selectionManager.setFocusedKey(null);
  }, [tagListState.selectionManager]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const handleClear = useCallback(() => {
    if (isDisabled || isReadOnly) return;
    const allKeys = new Set<Key>(tagListState.collection.getKeys());
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
    tagListState.collection,
  ]);

  const { keyboardProps: inputKeyboardProps } = useKeyboard({
    isDisabled: isDisabled || isReadOnly,
    onKeyDown: (event) => {
      if (event.key === 'Enter') {
        if (inputValueState.trim() && onAdd) {
          event.preventDefault();
          addTagsFromInput(inputValueState, 'enter');

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

        // Don't let a bare separator end up in the input either way.
        event.preventDefault();

        return;
      }

      const input = event.currentTarget;
      const { selectionStart, selectionEnd } = input;

      const isCaretAtStart =
        selectionStart === 0 && selectionEnd === 0 && !inputValueState;

      const hasTags = tagListState.collection.size > 0;

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
        tagListState.selectionManager.selectAll();
        focusTagAt('last');

        return;
      }

      // Shift+Tab from empty input → focus the first tag.
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
      if (isDisabled || isReadOnly) return;
      const next = event.relatedTarget;
      // If focus is moving inside the same TagInput, don't commit — the user is still editing.
      if (next && innerRef.current?.contains(next)) return;

      if (inputValueState.trim()) {
        addTagsFromInput(inputValueState, 'blur');
      }
    },
    [isDisabled, isReadOnly, inputValueState, addTagsFromInput]
  );

  const handleTagListContainerBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const next = event.relatedTarget;
      if (next && event.currentTarget.contains(next)) return;

      resetTagListFocus();
    },
    [resetTagListFocus]
  );

  // Click on empty canvas → focus the input. Attached to wrapper + group.
  const handleCanvasMouseDown = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      focusInput();
    },
    [focusInput]
  );

  const hasTags = tagListState.collection.size > 0;
  const hasInputValue = inputValueState !== '';
  const showCleaner = Boolean(isClearable);

  const cleanerIsHidden =
    !showCleaner || (!hasTags && !hasInputValue) || isDisabled || isReadOnly;

  const rootProps = mergeProps<
    (FormFieldProps<typeof TextField<HTMLInputElement>> | undefined)[]
  >(
    {
      label,
      fullWidth,
      isDisabled,
      isRequired,
      isReadOnly,
      isInvalid,
      errorMessage,
      labelPlacement,
      labelAlign,
      'data-variant': variant,
      'data-testid': dataTestid,
      className,
      style,
      name,
      // TextField primitive owns the text input value — wire it to our
      // inputValue so labels / errors / descriptions get correctly aria-linked.
      value: inputValueState,
      defaultValue: defaultInputValue,
      onChange: setInputValueState,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
    },
    slotProps?.root
  );

  return (
    <FormField as={TextField} inputElementType="input" {...rootProps}>
      {({ isInvalid: groupIsInvalid, isRequired: groupIsRequired }) => {
        const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
          {
            isHidden: isLabelHidden,
            isRequired: groupIsRequired,
            children: label,
          },
          slotProps?.label
        );

        const clearButtonProps = mergeProps(
          {
            isClearable: showCleaner,
            tabIndex: cleanerIsHidden ? -1 : undefined,
            isHidden: cleanerIsHidden,
            onPress: handleClear,
          },
          slotProps?.clearButton
        );

        const inputProps = mergeProps<(FormFieldInputProps | undefined)[]>(
          {
            ref: inputRef,
            placeholder,
            onFocus: resetTagListFocus,
            onPaste: handlePaste,
            onBlur: handleBlur,
          },
          inputKeyboardProps,
          slotProps?.input
        );

        // `state` stays out of the merge — only required prop on
        // TagListInner and can't be overridden via slotProps.
        const tagListProps = mergeProps<
          (
            | Partial<Omit<TagListInnerProps<T>, 'state' | 'isDisabled'>>
            | undefined
          )[]
        >(
          {
            variant: groupIsInvalid ? 'error-fade' : undefined,
            onRemove: isReadOnly ? undefined : handleRemove,
            'aria-label': ariaLabel ?? 'Selected tags',
            slotProps: { root: { className: s.tagList, tabIndex: -1 } },
          },
          slotProps?.tagList
        );

        const groupProps = mergeProps<
          (FormFieldControlGroupProps | undefined)[]
        >(
          {
            endAddon: showCleaner ? (
              <FormFieldClearButton {...clearButtonProps} />
            ) : undefined,
            variant,
            isDisabled,
            onMouseDown: handleCanvasMouseDown,
            isInvalid: groupIsInvalid,
            className: s.group,
          },
          slotProps?.group
        );

        const captionProps = mergeProps<(FormFieldCaptionProps | undefined)[]>(
          { children: caption },
          slotProps?.caption
        );

        const errorProps = mergeProps<(FormFieldErrorProps | undefined)[]>(
          { children: errorMessage },
          slotProps?.errorMessage
        );

        return (
          <>
            <FormField.Label {...labelProps} />
            <div className={s.body}>
              <FormField.ControlGroup {...groupProps}>
                {({ focusProps }) => (
                  <div
                    ref={innerRef}
                    role="presentation"
                    className={s.tagListContainer}
                    onMouseDown={handleCanvasMouseDown}
                    onBlur={handleTagListContainerBlur}
                  >
                    <TagListInner<T>
                      {...tagListProps}
                      state={tagListState}
                      isDisabled={isDisabled}
                    />
                    {/* focusProps on the input only — tags don't drive the group ring. */}
                    <FormField.Input
                      {...mergeProps(focusProps, inputProps)}
                      className={s.input}
                    />
                  </div>
                )}
              </FormField.ControlGroup>
              <FormField.Error {...errorProps} />
              <FormField.Caption {...captionProps} />
            </div>
          </>
        );
      }}
    </FormField>
  );
}

const TagInputComponent = forwardRef(TagInputRender) as TagInputComponent;

type CompoundedComponent = typeof TagInputComponent & {
  Tag: typeof Tag;
};

export const TagInput = TagInputComponent as CompoundedComponent;

TagInput.Tag = Tag;
