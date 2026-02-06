'use client';

import type { Ref, RefObject } from 'react';
import { forwardRef, useCallback, useRef, useState } from 'react';

import {
  useDOMRef,
  mergeProps,
  useElementSize,
  useFilter,
} from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import {
  Collection,
  CollectionBuilder,
  FieldErrorContext,
  FormContext,
  removeDataAttributes,
  useMultiSelect,
  useMultiSelectState,
  useSlottedContext,
  useAutocompleteState,
  useAutocomplete,
} from '@koobiq/react-primitives';
import type {
  MultiSelectState,
  BaseCollection,
} from '@koobiq/react-primitives';

import { useForm } from '../Form';
import type {
  FormFieldLabelProps,
  FormFieldErrorProps,
  FormFieldSelectProps,
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
} from '../FormField';
import { FormField, FormFieldClearButton } from '../FormField';
import type { ListItemText } from '../List';
import { List } from '../List';
import type { PopoverInnerProps, PopoverProps } from '../Popover';
import { PopoverInner } from '../Popover/PopoverInner';

import {
  SelectList,
  type SelectListProps,
  SelectOption,
  TagGroup,
} from './components';
import type { SelectRef, SelectProps, SelectComponent } from './index';
import s from './Select.module.css';

function SelectInner<T extends object>({
  state: inputState,
  props,
  listBoxRef,
}: {
  state: MultiSelectState<T>;
  props: Omit<SelectProps<T>, 'items'>;
  listBoxRef: RefObject<HTMLDivElement>;
}) {
  const {
    fullWidth,
    isClearable,
    'data-testid': testId,
    selectionMode = 'single',
    noItemsText,
    selectedTagsOverflow = 'responsive',
    labelPlacement,
    labelAlign,
    isRequired,
    isDisabled,
    caption,
    errorMessage,
    className,
    style,
    isLabelHidden,
    placeholder,
    endAddon,
    slotProps,
    startAddon,
    onClear,
    label,
    isLoading,
    onLoadMore,
    loadingText,
    renderValue: renderValueProp,
  } = props;

  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};

  const validationBehavior =
    props.validationBehavior ?? formValidationBehavior ?? 'aria';

  const clearButtonIsHidden = isDisabled || !inputState.selectedItems;

  const handleClear = useCallback(() => {
    inputState.selectionManager.setSelectedKeys(new Set());
    onClear?.();
  }, [onClear, inputState]);

  const {
    menuProps,
    valueProps,
    triggerProps,
    labelProps: labelPropsAria,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useMultiSelect(
    removeDataAttributes({
      ...props,
      selectionMode,
      isDisabled,
      disallowEmptySelection: true,
      validationBehavior,
    }),
    inputState,
    listBoxRef
  );

  const { isInvalid } = validation;

  // Match the Popover width to the control element's width.
  const { ref: containerRef, width } = useElementSize();

  const rootProps = mergeProps({
    'data-testid': testId,
    'data-invalid': isInvalid || undefined,
    'data-disabled': isDisabled || undefined,
    'data-required': isRequired || undefined,
    className,
    fullWidth,
    labelPlacement,
    labelAlign,
    style,
  });

  // search
  const { contains } = useFilter({ sensitivity: 'base' });

  const [filterText, setFilterText] = useState('');

  const autocompleteState = useAutocompleteState({
    inputValue: filterText,
    onInputChange: setFilterText,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const collectionRef = useRef<HTMLElement>(null);

  const {
    inputProps,
    collectionProps,
    filter: filterFn,
    collectionRef: mergedCollectionRef,
  } = useAutocomplete(
    {
      inputRef,
      collectionRef,
      filter: contains,
    },
    autocompleteState
  );

  const listProps = mergeProps<
    [
      SelectListProps<T>,
      typeof menuProps,
      Omit<SelectListProps<object>, 'state'> | undefined,
    ]
  >(
    {
      className: s.list,
      state: inputState,
      noItemsText,
      loadingText,
      isLoading,
      onLoadMore,
      filterFn,
      inputProps,
      inputRef,
      listRef: mergedCollectionRef,
      ...collectionProps,
    },
    menuProps,
    slotProps?.list
  );

  const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
    { isHidden: isLabelHidden, children: label, isRequired },
    labelPropsAria,
    slotProps?.label
  );

  const clearButtonProps = mergeProps(
    {
      isClearable,
      onPress: handleClear,
      className: s.clearButton,
      isHidden: clearButtonIsHidden,
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
        listBoxRef?.current?.focus();
        inputState.open();
      },
      endAddon: (
        <>
          {endAddon}
          <FormFieldClearButton {...clearButtonProps} />
          <span className={s.chevron}>
            <IconChevronDownS16 />
          </span>
        </>
      ),
      isInvalid,
      isDisabled,
      ref: containerRef,
    },
    slotProps?.group
  );

  const controlProps = mergeProps<(FormFieldSelectProps | undefined)[]>(
    {
      ref: listBoxRef,
      placeholder,
    },
    valueProps,
    triggerProps,
    slotProps?.control
  );

  const popoverProps = mergeProps<
    [PopoverInnerProps, PopoverProps | undefined]
  >(
    {
      state: inputState,
      offset: 4,
      hideArrow: true,
      type: 'listbox',
      maxBlockSize: 256,
      className: s.popover,
      anchorRef: containerRef,
      placement: 'bottom start',
      size: Math.max(width, 200),
    },
    slotProps?.popover
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

  const renderDefaultValue: typeof renderValueProp = (state, states) => {
    if (!state.selectedItems?.length) return null;

    if (selectionMode === 'multiple')
      return (
        <TagGroup
          state={state}
          states={states}
          selectedTagsOverflow={selectedTagsOverflow}
        />
      );

    return state.selectedItems[0].textValue;
  };

  const renderValue = renderValueProp || renderDefaultValue;

  return (
    <>
      <FormField {...rootProps}>
        <FormField.Label {...labelProps} />
        <div className={s.body}>
          <FormField.ControlGroup {...groupProps}>
            <FormField.Select {...controlProps}>
              {renderValue(inputState, {
                isInvalid,
                isDisabled: props.isDisabled,
                isRequired: props.isRequired,
              })}
            </FormField.Select>
          </FormField.ControlGroup>
          <FieldErrorContext.Provider value={validation}>
            <FormField.Error {...errorProps} />
          </FieldErrorContext.Provider>
          <FormField.Caption {...captionProps} />
        </div>
      </FormField>
      <PopoverInner {...popoverProps}>
        <SelectList {...listProps} />
      </PopoverInner>
    </>
  );
}

function StandaloneSelect<T extends object>({
  props: inProps,
  listBoxRef,
  collection,
}: {
  props: Omit<SelectProps<T>, 'ref'>;
  listBoxRef: RefObject<HTMLDivElement>;
  collection: BaseCollection<T>;
}) {
  const props = { ...inProps, collection, children: null, items: null };
  const { isDisabled: formIsDisabled } = useForm();

  const isDisabled = inProps?.isDisabled ?? formIsDisabled;

  // TODO: work out with these types
  const state = useMultiSelectState<T>(
    removeDataAttributes({
      ...props,
      isDisabled,
      selectionMode: inProps.selectionMode,
    })
  );

  return (
    <SelectInner
      state={state}
      props={{ ...props, isDisabled }}
      listBoxRef={listBoxRef}
    />
  );
}

function SelectRender<T extends object>(
  props: Omit<SelectProps<T>, 'ref'>,
  ref: Ref<SelectRef>
) {
  const listBoxRef = useDOMRef<HTMLDivElement>(ref);

  return (
    <CollectionBuilder content={<Collection {...props} />}>
      {(collection) => (
        <StandaloneSelect
          props={props as any}
          collection={collection}
          listBoxRef={listBoxRef}
        />
      )}
    </CollectionBuilder>
  );
}

const SelectComponent = forwardRef(SelectRender) as SelectComponent;

type CompoundedComponent = typeof SelectComponent & {
  Item: typeof SelectOption;
  ItemText: typeof ListItemText;
};

export const Select = SelectComponent as CompoundedComponent;

Select.Item = SelectOption;
Select.ItemText = List.ItemText;
