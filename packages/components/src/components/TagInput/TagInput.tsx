'use client';

import { forwardRef, useCallback, useMemo, useRef } from 'react';
import type { ClipboardEvent, FocusEvent, MouseEvent } from 'react';

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

import s from './TagInput.module.css';
import type { TagInputItem, TagInputProps, TagInputRef } from './types';

const DEFAULT_SPLIT_PATTERN = /,/;

const toItem = (value: string): TagInputItem => ({ id: value, value });

const splitInputValue = (raw: string, splitPattern: RegExp): string[] =>
  raw
    .split(splitPattern)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * An input component that allows users to enter, display, and manage
 * multiple tags or keywords dynamically. It supports adding and removing
 * tags.
 */
export const TagInput = forwardRef<TagInputRef, TagInputProps>((props, ref) => {
  const {
    splitPattern = DEFAULT_SPLIT_PATTERN,
    variant = 'filled',
    name,
    className,
    style,
    value,
    defaultValue,
    onChange,
    inputValue,
    defaultInputValue,
    onInputChange,
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

  // Tag collection state
  const [tagValues, setTagValues] = useControlledState<string[]>(
    value,
    defaultValue ?? [],
    onChange
  );

  const items = useMemo(() => tagValues.map(toItem), [tagValues]);

  // When the whole field is disabled, propagate it to every tag via
  // `disabledKeys` so each TagItem renders in its disabled state.
  const disabledTagKeys = useMemo(
    () => (isDisabled ? tagValues : undefined),
    [isDisabled, tagValues]
  );

  const tagListState = useTagListState<TagInputItem>({
    items,
    children: (item) => <Tag key={item.id}>{item.value}</Tag>,
    // Read-only fields keep focus navigation but disable tag selection.
    selectionMode: isReadOnly ? 'none' : 'multiple',
    disabledKeys: disabledTagKeys,
  });

  // Input value state
  const [inputValueState, setInputValueState] = useControlledState<string>(
    inputValue,
    defaultInputValue ?? '',
    onInputChange
  );

  // Mutation helpers
  const addTags = useCallback(
    (raw: string) => {
      if (isDisabled || isReadOnly) return;
      const candidates = splitInputValue(raw, splitPattern);
      if (candidates.length === 0) return;
      setTagValues([...tagValues, ...candidates]);
      setInputValueState('');
    },
    [
      isDisabled,
      isReadOnly,
      splitPattern,
      tagValues,
      setTagValues,
      setInputValueState,
    ]
  );

  const removeKeys = useCallback(
    (keys: Set<Key>) => {
      if (isDisabled || isReadOnly) return;
      const next = tagValues.filter((v) => !keys.has(v));
      setTagValues(next);

      // When the list becomes empty, focus has nowhere to go inside the
      // tag list — pull it back to the input synchronously, before React
      // unmounts the focused remove button.
      if (next.length === 0) {
        inputRef.current?.focus({ preventScroll: true });
      }
    },
    [isDisabled, isReadOnly, tagValues, setTagValues, inputRef]
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
    [tagListState]
  );

  const focusLastTag = useCallback(() => focusTagAt('last'), [focusTagAt]);
  const focusFirstTag = useCallback(() => focusTagAt('first'), [focusTagAt]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const handleClear = useCallback(() => {
    if (isDisabled || isReadOnly) return;
    setTagValues([]);
    setInputValueState('');
    onClear?.();
    focusInput();
  }, [
    isDisabled,
    isReadOnly,
    setTagValues,
    setInputValueState,
    onClear,
    focusInput,
  ]);

  // Keyboard handling via @react-aria useKeyboard.
  // `isDisabled` skips the handler entirely; non-handled keys are explicitly
  // bubbled with `event.continuePropagation()`.
  const { keyboardProps: inputKeyboardProps } = useKeyboard({
    isDisabled: isDisabled || isReadOnly,
    onKeyDown: (event) => {
      // Enter / split character → commit current value as a tag.
      if (event.key === 'Enter') {
        if (inputValueState.trim()) {
          event.preventDefault();
          addTags(inputValueState);

          return;
        }

        event.continuePropagation();

        return;
      }

      if (event.key.length === 1 && splitPattern.test(event.key)) {
        if (inputValueState.trim()) {
          addTags(inputValueState);
        }

        // Don't let a bare separator end up in the input either way.
        event.preventDefault();

        return;
      }

      const input = event.currentTarget;
      const { selectionStart, selectionEnd } = input;

      const isCaretAtStart =
        selectionStart === 0 && selectionEnd === 0 && !inputValueState;

      // Empty input + Backspace / ArrowLeft → focus last tag.
      if (
        isCaretAtStart &&
        (event.key === 'Backspace' || event.key === 'ArrowLeft')
      ) {
        if (tagValues.length === 0) {
          event.continuePropagation();

          return;
        }

        event.preventDefault();
        focusLastTag();

        return;
      }

      // Empty input + Ctrl/Cmd+A → select all tags, focus the last one.
      if (
        !inputValueState &&
        tagValues.length > 0 &&
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'a' || event.key === 'A')
      ) {
        event.preventDefault();
        tagListState.selectionManager.selectAll();
        focusLastTag();

        return;
      }

      // Shift+Tab from empty input → focus the first tag (per spec).
      if (
        isCaretAtStart &&
        event.key === 'Tab' &&
        event.shiftKey &&
        tagValues.length > 0
      ) {
        event.preventDefault();
        focusFirstTag();

        return;
      }

      event.continuePropagation();
    },
  });

  // Paste handling
  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      if (isDisabled || isReadOnly) return;
      const text = event.clipboardData.getData('text/plain');
      if (!text || !splitPattern.test(text)) return;

      event.preventDefault();
      const candidates = splitInputValue(text, splitPattern);
      if (candidates.length === 0) return;
      setTagValues([...tagValues, ...candidates]);
    },
    [isDisabled, isReadOnly, splitPattern, tagValues, setTagValues]
  );

  // Commit on blur
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      if (isDisabled || isReadOnly) return;
      const next = event.relatedTarget;
      // If focus is moving inside the same TagInput (to a tag, to the
      // cleaner, etc.), don't commit — the value is still being edited.
      if (next && innerRef.current?.contains(next)) return;

      if (inputValueState.trim()) {
        addTags(inputValueState);
      }
    },
    [isDisabled, isReadOnly, inputValueState, addTags]
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

  // Render
  const hasTags = tagValues.length > 0;
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
      // The TextField primitive owns the text input value — wire it to our
      // inputValue so labels / errors / descriptions get correctly aria-linked
      // and the form context sees the controlled string.
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
            onPaste: handlePaste,
            onBlur: handleBlur,
          },
          inputKeyboardProps,
          slotProps?.input
        );

        // `state` stays out of the merge — it's the only required prop on
        // TagListInner and the user can't override it through slotProps anyway.
        const tagListProps = mergeProps<
          (
            | Partial<Omit<TagListInnerProps<TagInputItem>, 'state'>>
            | undefined
          )[]
        >(
          {
            variant: groupIsInvalid ? 'error-fade' : undefined,
            // Keep onRemove set even when disabled — the × button stays
            // visible per spec; disabledKeys turn it into a disabled state
            // and `removeKeys` guards against accidental fires.
            onRemove: isReadOnly ? undefined : removeKeys,
            'aria-label': ariaLabel ?? 'Selected tags',
            slotProps: { root: { className: s.tagList } },
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
            onMouseDown: handleCanvasMouseDown,
            isInvalid: groupIsInvalid,
            isDisabled,
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
                  >
                    <TagListInner<TagInputItem>
                      state={tagListState}
                      {...tagListProps}
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
});

TagInput.displayName = 'TagInput';
