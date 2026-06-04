'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

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
import { useTagInputResolvedProps } from './utils';

export type TagInputInnerProps<T extends object> = {
  state: TagFieldState<T> | TagAutocompleteState<T>;
  inputRef?: Ref<HTMLInputElement>;
} & TagInputProps<T>;

/**
 * An input component that allows users to enter, display, and manage
 * multiple tags or keywords dynamically. It supports adding and removing
 * tags.
 */
export function TagInputInner<T extends object>(
  fieldProps: TagInputInnerProps<T>
) {
  const { state, inputRef: forwardedInputRef, ...props } = fieldProps;

  const {
    variant = 'filled',
    style,
    label,
    caption,
    className,
    fullWidth,
    labelAlign,
    errorMessage,
    isLabelHidden,
    labelPlacement,
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    'data-testid': dataTestid,
    slotProps,
    placeholder,
  } = props;

  const {
    inputValue,
    inputRef,
    isDisabled,
    isReadOnly,
    isRequired,
    isInvalid,
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
      isDisabled: isDisabledProp,
      isReadOnly: isReadOnlyProp,
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
      'data-testid': dataTestid,
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
      endAddon: clearButtonPropsAria.isClearable ? (
        <FormFieldClearButton {...clearButtonProps} />
      ) : undefined,
      variant,
      isDisabled,
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
  const resolvedProps = useTagInputResolvedProps<T>(props);

  const state = useTagFieldState<T>(resolvedProps);

  return <TagInputInner<T> {...resolvedProps} state={state} inputRef={ref} />;
}

const TagInputComponent = forwardRef(TagInputRender) as TagInputComponent;

type CompoundedComponent = typeof TagInputComponent & {
  Tag: typeof Tag;
};

export const TagInput = TagInputComponent as CompoundedComponent;

TagInput.Tag = Tag;
