'use client';

import { forwardRef } from 'react';

import { clsx, mergeProps, useDOMRef } from '@koobiq/react-core';
import { IconMagnifyingGlass16, IconXmarkCircle16 } from '@koobiq/react-icons';
import {
  removeDataAttributes,
  useSearchField,
  useSearchFieldState,
} from '@koobiq/react-primitives';

import {
  FieldCaption,
  type FieldCaptionProps,
  FieldContentGroup,
  type FieldContentGroupProps,
  FieldError,
  type FieldErrorProps,
  FieldInput,
  type FieldInputProps,
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
      fullWidth = false,
      isLabelHidden = false,
      labelPlacement,
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

    const hasClearButton = state.value !== '' && !isDisabled && !isReadOnly;

    const {
      labelProps: labelPropsAria,
      inputProps: inputPropsAria,
      descriptionProps: descriptionPropsAria,
      errorMessageProps: errorMessagePropsAria,
      clearButtonProps: clearButtonPropsAria,
      isInvalid,
      validationDetails,
      validationErrors,
    } = useSearchField(removeDataAttributes(props), state, domRef);

    const errorMessage =
      typeof props.errorMessage === 'function'
        ? props.errorMessage({ isInvalid, validationErrors, validationDetails })
        : props.errorMessage || validationErrors?.join(' ');

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
        'data-invalid': isInvalid,
        'data-disabled': isDisabled,
        'data-required': isRequired,
        'data-readonly': isReadOnly,
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
      { isInvalid, children: errorMessage },
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
          <FieldError {...errorProps} />
        </Field>
      </FormControl>
    );
  }
);

SearchInput.displayName = 'SearchInput';
