'use client';

import { forwardRef, type Ref, useRef } from 'react';

import {
  clsx,
  mergeProps,
  useDOMRef,
  useElementSize,
  useFilter,
} from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import {
  FieldErrorContext,
  removeDataAttributes,
  useComboBox,
  useComboBoxState,
} from '@koobiq/react-primitives';

import { Item } from '../Collections';
import { useForm } from '../Form';
import {
  FormField,
  type FormFieldCaptionProps,
  type FormFieldControlGroupProps,
  type FormFieldErrorProps,
  type FormFieldInputProps,
  type FormFieldLabelProps,
  type FormFieldProps,
} from '../FormField';
import { IconButton } from '../IconButton';
import { ListInner } from '../List';
import type { PopoverInnerProps, PopoverProps } from '../Popover';
import { PopoverInner } from '../Popover/PopoverInner';

import s from './Autocomplete.module.css';
import type {
  AutocompleteComponent,
  AutocompleteProps,
  AutocompleteRef,
} from './index';

export function AutocompleteRender<T extends object = object>(
  props: Omit<AutocompleteProps<T>, 'ref'>,
  ref: Ref<AutocompleteRef>
) {
  const inputRef = useDOMRef<HTMLInputElement>(ref);

  const {
    variant = 'filled',
    disableShowChevron = false,
    defaultFilter: defaultFilterProp,
    label,
    style,
    caption,
    endAddon,
    slotProps,
    className,
    fullWidth,
    isRequired,
    labelAlign,
    startAddon,
    errorMessage,
    isLabelHidden,
    labelPlacement,
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    'data-testid': testId,
  } = props;

  const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } = useForm();

  const isDisabled = isDisabledProp ?? formIsDisabled;
  const isReadOnly = isReadOnlyProp ?? formIsReadOnly;

  const { contains } = useFilter({ sensitivity: 'base' });

  const state = useComboBoxState(
    removeDataAttributes({
      ...props,
      isDisabled,
      isReadOnly,
      defaultFilter: defaultFilterProp || contains,
    })
  );

  // Setup refs and get props for child elements.
  const buttonRef = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);

  const {
    buttonProps,
    listBoxProps,
    inputProps: inputPropsAria,
    labelProps: labelPropsAria,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useComboBox(
    removeDataAttributes({
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
      isDisabled,
      isReadOnly,
    }),
    state
  );

  const { isInvalid } = validation;

  // Match the Popover width to the control element's width.
  const { ref: containerRef, width } = useElementSize();

  const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
    { isHidden: isLabelHidden, isRequired, children: label },
    labelPropsAria,
    slotProps?.label
  );

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

  const popoverProps = mergeProps<
    [PopoverInnerProps, PopoverProps | undefined]
  >(
    {
      state,
      offset: 4,
      popoverRef,
      type: 'listbox',
      hideArrow: true,
      isNonModal: true,
      maxBlockSize: 256,
      className: s.popover,
      anchorRef: containerRef,
      placement: 'bottom start',
      size: Math.max(width, 200),
      slotProps: { backdrop: { hidden: true } },
    },
    slotProps?.popover
  );

  const groupProps = mergeProps<(FormFieldControlGroupProps | undefined)[]>(
    {
      slotProps: {
        endAddon: { className: s.addon },
        startAddon: { className: s.addon },
      },
      startAddon,
      onMouseDown: (e) => {
        if (e.currentTarget !== e.target || isDisabled) return;
        e.preventDefault();
        inputRef?.current?.focus();
      },
      endAddon: (
        <>
          {endAddon}
          {!disableShowChevron && (
            <IconButton
              {...buttonProps}
              variant={isInvalid ? 'error' : 'fade-contrast'}
              ref={buttonRef}
            >
              <IconChevronDownS16 className={s.chevron} />
            </IconButton>
          )}
        </>
      ),
      variant,
      isInvalid,
      isDisabled,
      ref: containerRef,
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

  const inputProps = mergeProps<(FormFieldInputProps | undefined)[]>(
    {
      ...inputPropsAria,
      ref: inputRef,
    },
    slotProps?.input
  );

  return (
    <FormField {...rootProps}>
      <FormField.Label {...labelProps} />
      <div className={s.body}>
        <FormField.ControlGroup {...groupProps}>
          <FormField.Input {...inputProps} />
        </FormField.ControlGroup>
        <FormField.Caption {...captionProps} />
        <FieldErrorContext.Provider value={validation}>
          <FormField.Error {...errorProps} />
        </FieldErrorContext.Provider>
      </div>
      <PopoverInner {...popoverProps}>
        <ListInner
          {...listBoxProps}
          isPadded
          className={s.list}
          listRef={listBoxRef}
          state={state}
        />
      </PopoverInner>
    </FormField>
  );
}

const AutocompleteComponent = forwardRef(
  AutocompleteRender
) as AutocompleteComponent;

type CompoundedComponent = typeof AutocompleteComponent & {
  Item: typeof Item;
};

export const Autocomplete = AutocompleteComponent as CompoundedComponent;

Autocomplete.Item = Item;
