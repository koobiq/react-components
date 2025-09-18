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

import {
  FieldCaption,
  type FieldCaptionProps,
  FieldContentGroup,
  type FieldContentGroupProps,
  FieldInput,
  type FieldInputProps,
  type FieldErrorProps,
  FieldError,
  Field,
} from '../FieldComponents';
import { FormControl, type FormControlProps } from '../FormControl';
import {
  FormControlLabel,
  type FormControlLabelProps,
} from '../FormControlLabel';
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

    const rootProps = mergeProps<
      [FormControlProps, FormControlProps | undefined]
    >(
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

    const labelProps = mergeProps<
      [
        FormControlLabelProps,
        FormControlLabelProps | undefined,
        FormControlLabelProps,
      ]
    >(
      { isHidden: isLabelHidden, isRequired, children: label },
      slotProps?.label,
      labelPropsAria
    );

    const inputProps = mergeProps<
      [FieldInputProps, FieldInputProps | undefined, FieldInputProps]
    >(
      {
        variant,
        isInvalid,
        isDisabled,
        ref: domRef,
        className: s.input,
      },
      slotProps?.input,
      inputPropsAria
    );

    const groupProps = mergeProps<
      [FieldContentGroupProps, FieldContentGroupProps | undefined]
    >(
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

    const captionProps = mergeProps<
      [FieldCaptionProps, FieldCaptionProps | undefined, FieldCaptionProps]
    >({ children: caption }, slotProps?.caption, descriptionPropsAria);

    const errorProps = mergeProps<
      [FieldErrorProps, FieldErrorProps | undefined, FieldErrorProps]
    >(
      { children: errorMessage },
      slotProps?.errorMessage,
      errorMessagePropsAria
    );

    return (
      <FormControl {...rootProps}>
        <FormControlLabel {...labelProps}>{label}</FormControlLabel>
        <Field>
          <FieldContentGroup {...groupProps}>
            <FieldInput {...inputProps} />
          </FieldContentGroup>
          <FieldCaption {...captionProps} />
          <FieldErrorContext.Provider value={validation}>
            <FieldError {...errorProps} />
          </FieldErrorContext.Provider>
        </Field>
      </FormControl>
    );
  }
);

SearchInput.displayName = 'SearchInput';
