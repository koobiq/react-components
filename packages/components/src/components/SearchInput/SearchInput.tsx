import { forwardRef } from 'react';

import { mergeProps, useDOMRef } from '@koobiq/react-core';
import { IconMagnifyingGlass16, IconXmarkCircle16 } from '@koobiq/react-icons';
import { useSearchField, useSearchFieldState } from '@koobiq/react-primitives';

import {
  FieldCaption,
  type FieldCaptionProps,
  FieldContentGroup,
  type FieldContentGroupProps,
  FieldControl,
  FieldError,
  type FieldErrorProps,
  FieldInput,
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
      startAddon = <IconMagnifyingGlass16 className={s.searchIcon} />,
      variant = 'filled',
      fullWidth = false,
      isLabelHidden = false,
      caption,
      errorMessage,
      isRequired,
      isReadOnly,
      label,
      endAddon,
      isInvalid,
      isDisabled,
      slotProps,
    } = props;

    const state = useSearchFieldState(props);
    const domRef = useDOMRef(ref);

    const hasClearButton = state.value !== '' && !isDisabled && !isReadOnly;

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
                className={s.clearButton}
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
      <FieldControl fullWidth={fullWidth}>
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
