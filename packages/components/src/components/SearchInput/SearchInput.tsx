'use client';

import { forwardRef } from 'react';

import { clsx, mergeProps, useDOMRef } from '@koobiq/react-core';
import { IconMagnifyingGlass16, IconXmarkCircle16 } from '@koobiq/react-icons';
import {
  removeDataAttributes,
  useSearchField,
  useSearchFieldState,
  FieldErrorContext,
  useSlottedContext,
  FormContext,
} from '@koobiq/react-primitives';

import type {
  FormFieldProps,
  FormFieldLabelProps,
  FormFieldInputProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
} from '../FormField';
import { FormField } from '../FormField';
import { IconButton } from '../IconButton';

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
      isReadOnly,
      label,
      endAddon,
      isDisabled,
      slotProps,
    } = props;

    const state = useSearchFieldState(removeDataAttributes(props));
    const domRef = useDOMRef(ref);

    const { validationBehavior: formValidationBehavior } =
      useSlottedContext(FormContext) || {};

    const validationBehavior =
      props.validationBehavior ?? formValidationBehavior ?? 'aria';

    const hasClearButton = state.value !== '' && !isDisabled && !isReadOnly;

    const {
      labelProps: labelPropsAria,
      inputProps: inputPropsAria,
      descriptionProps: descriptionPropsAria,
      errorMessageProps: errorMessagePropsAria,
      clearButtonProps: clearButtonPropsAria,
      ...validation
    } = useSearchField(
      { ...removeDataAttributes(props), validationBehavior },
      state,
      domRef
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
        ref: domRef,
        className: s.input,
      },
      inputPropsAria,
      slotProps?.input
    );

    const groupProps = mergeProps<(FormFieldControlGroupProps | undefined)[]>(
      {
        slotProps: { startAddon: { className: s.startAddon } },
        startAddon,
        endAddon: (
          <>
            {hasClearButton && (
              <IconButton
                {...clearButtonPropsAria}
                variant={isInvalid ? 'error' : 'fade-contrast'}
                {...slotProps?.clearButton}
                className={clsx(
                  s.clearButton,
                  slotProps?.clearButton?.className
                )}
              >
                <IconXmarkCircle16 />
              </IconButton>
            )}
            {endAddon}
          </>
        ),
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
          <FormField.Caption {...captionProps} />
          <FieldErrorContext.Provider value={validation}>
            <FormField.Error {...errorProps} />
          </FieldErrorContext.Provider>
        </div>
      </FormField>
    );
  }
);

SearchInput.displayName = 'SearchInput';
