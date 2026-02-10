'use client';

import { forwardRef, useCallback, useRef } from 'react';
import type { Ref } from 'react';

import {
  clsx,
  mergeProps,
  useDOMRef,
  useElementSize,
  useFilter,
} from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import {
  useComboBox,
  useComboBoxState,
  FieldErrorContext,
  removeDataAttributes,
  useSlottedContext,
  FormContext,
} from '@koobiq/react-primitives';

import { Section, Item } from '../Collections';
import { useForm } from '../Form';
import type {
  FormFieldProps,
  FormFieldErrorProps,
  FormFieldInputProps,
  FormFieldLabelProps,
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
} from '../FormField';
import { FormField, FormFieldClearButton } from '../FormField';
import { IconButton } from '../IconButton';
import { List, ListInner } from '../List';
import type { ListInnerProps, ListItemText } from '../List';
import type { PopoverInnerProps, PopoverProps } from '../Popover';
import { PopoverInner } from '../Popover/PopoverInner';

import s from './Autocomplete.module.css';
import type {
  AutocompleteRef,
  AutocompleteProps,
  AutocompleteComponent,
} from './index';

export function AutocompleteRender<T extends object = object>(
  props: Omit<AutocompleteProps<T>, 'ref'>,
  ref: Ref<AutocompleteRef>
) {
  const inputRef = useDOMRef<HTMLInputElement>(ref);

  const {
    variant = 'filled',
    disableShowChevron = false,
    allowsEmptyCollection = true,
    label,
    style,
    caption,
    onClear,
    endAddon,
    slotProps,
    className,
    isLoading,
    fullWidth,
    isRequired,
    labelAlign,
    startAddon,
    onLoadMore,
    noItemsText,
    loadingText,
    isClearable,
    errorMessage,
    isLabelHidden,
    labelPlacement,
    allowsCustomValue,
    'data-testid': testId,
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    defaultFilter: defaultFilterProp,
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
      allowsEmptyCollection,
      defaultFilter: defaultFilterProp || contains,
    })
  );

  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};

  const validationBehavior =
    props.validationBehavior ?? formValidationBehavior ?? 'aria';

  // Setup refs
  const buttonRef = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);

  const {
    buttonProps,
    listBoxProps,
    descriptionProps,
    errorMessageProps,
    inputProps: inputPropsAria,
    labelProps: labelPropsAria,
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
      validationBehavior,
    }),
    state
  );

  const clearButtonIsHidden =
    isReadOnly ||
    isDisabled ||
    (allowsCustomValue ? !state.inputValue : !state.selectedItem);

  const handleClear = useCallback(() => {
    state.selectionManager.setSelectedKeys(new Set());
    onClear?.();
  }, [onClear, state]);

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
      fullWidth,
      labelAlign,
      labelPlacement,
      'data-testid': testId,
      'data-variant': variant,
      className: clsx(s.base, className),
      'data-invalid': isInvalid || undefined,
      'data-readonly': isReadOnly || undefined,
      'data-disabled': isDisabled || undefined,
      'data-required': isRequired || undefined,
      'data-show-chevron': !disableShowChevron || undefined,
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

  const listProps = mergeProps<
    [
      ListInnerProps<object>,
      typeof listBoxProps,
      Omit<ListInnerProps<object>, 'state'> | undefined,
    ]
  >(
    {
      state,
      isLoading,
      onLoadMore,
      loadingText,
      isPadded: true,
      className: s.list,
      listRef: listBoxRef,
      noItemsText: !allowsEmptyCollection ? null : noItemsText,
    },
    listBoxProps,
    slotProps?.list
  );

  const clearButtonProps = mergeProps(
    {
      onPress: handleClear,
      isHidden: clearButtonIsHidden,
      isClearable,
    },
    slotProps?.clearButton
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
      endAddon: (isClearable ||
        endAddon ||
        !disableShowChevron ||
        undefined) && (
        <>
          <FormFieldClearButton {...clearButtonProps} />
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
        <FieldErrorContext.Provider value={validation}>
          <FormField.Error {...errorProps} />
        </FieldErrorContext.Provider>
        <FormField.Caption {...captionProps} />
      </div>
      <PopoverInner {...popoverProps}>
        <ListInner {...listProps} />
      </PopoverInner>
    </FormField>
  );
}

const AutocompleteComponent = forwardRef(
  AutocompleteRender
) as AutocompleteComponent;

type CompoundedComponent = typeof AutocompleteComponent & {
  Item: typeof Item;
  Section: typeof Section;
  ItemText: typeof ListItemText;
};

export const Autocomplete = AutocompleteComponent as CompoundedComponent;

Autocomplete.Item = Item;
Autocomplete.Section = Section;
Autocomplete.ItemText = List.ItemText;
