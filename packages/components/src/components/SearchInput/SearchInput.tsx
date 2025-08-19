import { forwardRef } from 'react';

import { mergeProps, useDOMRef } from '@koobiq/react-core';
import { IconXmarkCircle16 } from '@koobiq/react-icons';
import { useSearchField, useSearchFieldState } from '@koobiq/react-primitives';

import {
  FieldCaption,
  type FieldCaptionProps,
  FieldContentGroup,
  FieldControl,
  FieldError,
  type FieldErrorProps,
  FieldInput,
  type FieldInputGroupProps,
  type FieldInputProps,
  FieldLabel,
  type FieldLabelProps,
} from '../FieldComponents';
import { IconButton } from '../IconButton';

import s from './SearchInput.module.css';
import type { SearchInputProps, SearchInputRef } from './types';

export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  (props, ref) => {
    const {
      variant = 'filled',
      fullWidth = false,
      isLabelHidden = false,
      caption,
      errorMessage,
      isRequired,
      label,
      startAddon,
      endAddon,
      isInvalid,
      isDisabled,
      slotProps,
    } = props;

    const state = useSearchFieldState(props);
    const domRef = useDOMRef(ref);

    const {
      labelProps: labelPropsAria,
      inputProps: inputPropsAria,
      descriptionProps: descriptionPropsAria,
      errorMessageProps: errorMessagePropsAria,
      clearButtonProps,
    } = useSearchField(props, state, domRef);

    const labelProps = mergeProps<
      [FieldLabelProps, FieldLabelProps | undefined, FieldLabelProps]
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
      },
      slotProps?.input,
      inputPropsAria
    );

    const groupProps = mergeProps<
      [FieldInputGroupProps, FieldInputGroupProps | undefined]
    >(
      {
        startAddon,
        endAddon: (
          <>
            {state.value !== '' && (
              <IconButton
                {...clearButtonProps}
                variant={isInvalid ? 'error' : 'fade-contrast'}
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
      <FieldControl className={s.base} fullWidth={fullWidth}>
        <FieldLabel {...labelProps}>{label}</FieldLabel>
        <FieldContentGroup {...groupProps}>
          <FieldInput {...inputProps} />
        </FieldContentGroup>
        <FieldCaption {...captionProps} />
        <FieldError {...errorProps} />
      </FieldControl>
    );
  }
);

SearchInput.displayName = 'SearchInput';
