'use client';

import { forwardRef } from 'react';

import { clsx, mergeProps, useDOMRef } from '@koobiq/react-core';
import { IconMagnifyingGlass16 } from '@koobiq/react-icons';
import {
  removeDataAttributes,
  useSearchField,
  useSearchFieldState,
  FieldErrorContext,
  useSlottedContext,
  FormContext,
} from '@koobiq/react-primitives';

import { useForm } from '../Form';
import type {
  FormFieldProps,
  FormFieldLabelProps,
  FormFieldInputProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
} from '../FormField';
import { FormField, FormFieldClearButton } from '../FormField';

import s from './SearchInput.module.css';
import type { SearchInputProps, SearchInputRef } from './types';

export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  (props, ref) => {
    const {
      startAddon = <IconMagnifyingGlass16 className={s.searchIcon} />,
      variant = 'filled',
      fullWidth,
      isLabelHidden,
      labelPlacement,
      errorMessage,
      labelAlign,
      'data-testid': testId,
      style,
      className,
      caption,
      isRequired,
      isReadOnly: isReadOnlyProp,
      label,
      endAddon,
      isDisabled: isDisabledProp,
      slotProps,
    } = props;

    const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } =
      useForm();

    const isDisabled = isDisabledProp ?? formIsDisabled;
    const isReadOnly = isReadOnlyProp ?? formIsReadOnly;

    const state = useSearchFieldState(
      removeDataAttributes({ ...props, isDisabled, isReadOnly })
    );

    const inputRef = useDOMRef(ref);

    const { validationBehavior: formValidationBehavior } =
      useSlottedContext(FormContext) || {};

    const validationBehavior =
      props.validationBehavior ?? formValidationBehavior ?? 'aria';

    const clearButtonIsHidden = state.value === '' || isDisabled || isReadOnly;

    const {
      labelProps: labelPropsAria,
      inputProps: inputPropsAria,
      descriptionProps: descriptionPropsAria,
      errorMessageProps: errorMessagePropsAria,
      clearButtonProps: clearButtonPropsAria,
      ...validation
    } = useSearchField(
      {
        ...removeDataAttributes({ ...props, isDisabled, isReadOnly }),
        validationBehavior,
      },
      state,
      inputRef
    );

    const { isInvalid } = validation;

    const rootProps = mergeProps<(FormFieldProps | undefined)[]>(
      {
        style,
        labelPlacement,
        labelAlign,
        fullWidth,
        'data-testid': testId,
        'data-variant': variant,
        'data-invalid': isInvalid || undefined,
        'data-readonly': isReadOnly || undefined,
        'data-disabled': isDisabled || undefined,
        'data-required': isRequired || undefined,
        className: clsx(s.base, className),
      },
      slotProps?.root
    );

    const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
      { isHidden: isLabelHidden, isRequired, children: label },
      labelPropsAria,
      slotProps?.label
    );

    const inputProps = mergeProps<(FormFieldInputProps | undefined)[]>(
      {
        ref: inputRef,
        className: s.input,
      },
      inputPropsAria,
      slotProps?.input
    );

    const clearButtonProps = mergeProps(
      {
        className: s.clearButton,
        isHidden: clearButtonIsHidden,
        isClearable: true,
      },
      clearButtonPropsAria,
      slotProps?.clearButton
    );

    const groupProps = mergeProps<(FormFieldControlGroupProps | undefined)[]>(
      {
        slotProps: { startAddon: { className: s.startAddon } },
        startAddon,
        endAddon: (
          <>
            <FormFieldClearButton {...clearButtonProps} />
            {endAddon}
          </>
        ),
        onMouseDown: (e) => {
          if (e.currentTarget !== e.target) return;
          e.preventDefault();
          inputRef?.current?.focus();
        },
        variant,
        isInvalid,
        isDisabled,
      },
      slotProps?.group
    );

    const captionProps = mergeProps<(FormFieldCaptionProps | undefined)[]>(
      { children: caption },
      descriptionPropsAria,
      slotProps?.caption
    );

    const errorProps = mergeProps<(FormFieldErrorProps | undefined)[]>(
      { children: errorMessage },
      errorMessagePropsAria,
      slotProps?.errorMessage
    );

    return (
      <FormField {...rootProps}>
        <FormField.Label {...labelProps}>{label}</FormField.Label>
        <div className={s.body}>
          <FormField.ControlGroup {...groupProps}>
            <FormField.Input {...inputProps} />
          </FormField.ControlGroup>
          <FieldErrorContext.Provider value={validation}>
            <FormField.Error {...errorProps} />
          </FieldErrorContext.Provider>
          <FormField.Caption {...captionProps} />
        </div>
      </FormField>
    );
  }
);

SearchInput.displayName = 'SearchInput';
