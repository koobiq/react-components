'use client';

import { forwardRef } from 'react';
import type { Ref, RefObject } from 'react';

import { mergeProps } from '@koobiq/react-core';
import {
  ButtonContext,
  DEFAULT_SLOT,
  FieldErrorContext,
  Provider,
  type TagAutocompleteState,
  type TagFieldState,
  useTagField,
  useTagFieldState,
} from '@koobiq/react-primitives';

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
import { Tag } from '../TagList/Tag';
import { TagListInner } from '../TagList/TagListInner';

import { useFieldSizingFallback } from './hooks/useFieldSizingFallback';
import s from './TagInput.module.css';
import type { TagInputComponent, TagInputProps } from './types';

export type TagInputInnerProps<T extends object> = {
  state: TagFieldState<T> | TagAutocompleteState<T>;
  inputRef?: Ref<HTMLInputElement>;
  popoverRef?: RefObject<HTMLDivElement | null>;
  listBoxRef?: RefObject<HTMLUListElement | null>;
} & TagInputProps<T>;

/**
 * An input component that allows users to enter, display, and manage
 * multiple tags or keywords dynamically. It supports adding and removing
 * tags.
 */
export function TagInputInner<T extends object>(
  inProps: TagInputInnerProps<T>
) {
  const {
    state,
    inputRef: forwardedInputRef,
    isRequired,
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    ...props
  } = inProps;

  const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } = useForm();

  const isDisabled = isDisabledProp ?? formIsDisabled;
  const isReadOnly = isReadOnlyProp ?? formIsReadOnly;

  const {
    variant = 'filled',
    style,
    label,
    caption,
    endAddon,
    className,
    fullWidth,
    labelAlign,
    errorMessage,
    isLabelHidden,
    labelPlacement,
    startAddon,
    'data-testid': dataTestId,
    slotProps,
    placeholder,
  } = props;

  const {
    inputRef,
    isInvalid,
    inputValue,
    validationErrors,
    validationDetails,
    descriptionProps,
    errorMessageProps,
    inputProps: inputPropsAria,
    labelProps: labelPropsAria,
    tagListProps: tagListPropsAria,
    clearButtonProps: clearButtonPropsAria,
    tagListContainerProps: tagListContainerPropsAria,
  } = useTagField(
    {
      ...props,
      isDisabled,
      isReadOnly,
    },
    state,
    forwardedInputRef
  );

  useFieldSizingFallback(inputRef, {
    fallbackText: placeholder,
    text: inputValue,
  });

  const validation = { isInvalid, validationErrors, validationDetails };

  const rootProps = mergeProps<(FormFieldProps | undefined)[]>(
    {
      style,
      fullWidth,
      labelAlign,
      labelPlacement,
      'data-testid': dataTestId,
      'data-variant': variant,
      'data-invalid': isInvalid || undefined,
      'data-readonly': isReadOnly || undefined,
      'data-disabled': isDisabled || undefined,
      'data-required': isRequired || undefined,
      className,
    },
    slotProps?.root
  );

  const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
    { isHidden: isLabelHidden, isRequired, children: label },
    labelPropsAria,
    slotProps?.label
  );

  const clearButtonProps = mergeProps(
    clearButtonPropsAria,
    slotProps?.clearButton
  );

  const inputProps = mergeProps<(FormFieldInputProps | undefined)[]>(
    {
      ref: inputRef,
      className: s.input,
    },
    inputPropsAria,
    slotProps?.input
  );

  const tagListContainerProps = mergeProps(
    { className: s.tagListContainer },
    tagListContainerPropsAria
  );

  const tagListProps = mergeProps(
    {
      className: s.tagList,
      variant: isInvalid ? 'error-fade' : 'contrast-fade',
    },
    tagListPropsAria,
    slotProps?.tagList
  );

  const groupProps = mergeProps<(FormFieldControlGroupProps | undefined)[]>(
    {
      endAddon: (clearButtonPropsAria.isClearable || endAddon) && (
        <>
          <FormFieldClearButton {...clearButtonProps} />
          {endAddon}
        </>
      ),
      variant,
      isDisabled,
      startAddon,
      onMouseDown: (event) => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        inputRef.current?.focus();
      },
      isInvalid,
      className: s.group,
    },
    slotProps?.group
  );

  const captionProps = mergeProps<(FormFieldCaptionProps | undefined)[]>(
    { children: caption },
    descriptionProps,
    slotProps?.caption
  );

  const errorProps = mergeProps<(FormFieldErrorProps | undefined)[]>(
    { children: errorMessage },
    errorMessageProps,
    slotProps?.errorMessage
  );

  return (
    <Provider
      values={[
        [
          ButtonContext,
          {
            slots: {
              [DEFAULT_SLOT]: {},
              'clear-button': {},
            },
          },
        ],
      ]}
    >
      <FormField {...rootProps}>
        <FormField.Label {...labelProps} />
        <div className={s.body}>
          <FormField.ControlGroup {...groupProps}>
            {({ focusProps }) => (
              <div {...tagListContainerProps}>
                <TagListInner<T> {...tagListProps} />
                {/* focusProps on the input only: tags don't drive the group ring. */}
                <FormField.Input {...mergeProps(focusProps, inputProps)} />
              </div>
            )}
          </FormField.ControlGroup>
          <FieldErrorContext.Provider value={validation}>
            <FormField.Error {...errorProps} />
          </FieldErrorContext.Provider>
          <FormField.Caption {...captionProps} />
        </div>
      </FormField>
    </Provider>
  );
}

/**
 * An input component that allows users to enter, display, and manage
 * multiple tags or keywords dynamically. It supports adding and removing
 * tags.
 */
function TagInputRender<T extends object>(
  props: TagInputProps<T>,
  ref?: Ref<HTMLInputElement>
) {
  const state = useTagFieldState<T>(props);

  return <TagInputInner<T> {...props} state={state} inputRef={ref} />;
}

const TagInputComponent = forwardRef(TagInputRender) as TagInputComponent;

type CompoundedComponent = typeof TagInputComponent & {
  Tag: typeof Tag;
};

export const TagInput = TagInputComponent as CompoundedComponent;

TagInput.Tag = Tag;
