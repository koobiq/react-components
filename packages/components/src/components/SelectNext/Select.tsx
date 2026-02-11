'use client';

import type { Ref, RefObject } from 'react';
import { forwardRef, useCallback, useRef } from 'react';

import {
  useDOMRef,
  useFilter,
  mergeProps,
  useElementSize,
  useControlledState,
} from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import {
  useSelect,
  Collection,
  FormContext,
  useSelectState,
  useAutocomplete,
  useSlottedContext,
  CollectionBuilder,
  FieldErrorContext,
  useAutocompleteState,
  removeDataAttributes,
} from '@koobiq/react-primitives';
import type {
  SelectState,
  BaseCollection,
  SelectStateOptions,
} from '@koobiq/react-primitives';
import type { SelectionMode } from '@react-types/select';

import { Divider } from '../Divider';
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
  TagGroup,
  SelectList,
  SelectOption,
  SelectSection,
} from './components';
import type { SelectRef, SelectProps, SelectComponent } from './index';
import s from './Select.module.css';

function SelectInner<T extends object, M extends SelectionMode = 'single'>({
  state: inState,
  props,
  listBoxRef,
}: {
  state: SelectState<T, M>;
  props: Omit<SelectProps<T, M>, 'items'>;
  listBoxRef: RefObject<HTMLDivElement>;
}) {
  const {
    selectedTagsOverflow = 'responsive',
    renderValue: renderValueProp,
    'data-testid': testId,
    defaultInputValue,
    labelPlacement,
    onInputChange,
    selectionMode,
    isLabelHidden,
    isSearchable,
    errorMessage,
    placeholder,
    loadingText,
    isClearable,
    noItemsText,
    inputValue,
    labelAlign,
    startAddon,
    isRequired,
    onLoadMore,
    isDisabled,
    fullWidth,
    className,
    isLoading,
    slotProps,
    endAddon,
    caption,
    onClear,
    style,
    label,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const collectionRef = useRef<HTMLElement>(null);

  // search
  const { contains } = useFilter({ sensitivity: 'base' });

  const [filterText, setFilterText] = useControlledState(
    inputValue,
    defaultInputValue ?? '',
    onInputChange
  );

  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};

  const validationBehavior =
    props.validationBehavior ?? formValidationBehavior ?? 'aria';

  const clearButtonIsHidden = isDisabled || !inState.selectedItems.length;

  const handleClear = useCallback(() => {
    inState.selectionManager.setSelectedKeys(new Set());
    onClear?.();
  }, [onClear, inState]);

  const {
    menuProps,
    valueProps,
    triggerProps,
    descriptionProps,
    errorMessageProps,
    labelProps: labelPropsAria,
    ...validation
  } = useSelect(
    removeDataAttributes({
      ...props,
      isDisabled,
      selectionMode,
      validationBehavior,
      allowsEmptyCollection: true,
    }),
    inState,
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

  const autocompleteState = useAutocompleteState({
    inputValue: isSearchable ? filterText : '',
    onInputChange: isSearchable ? setFilterText : () => {},
  });

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

  const baseListProps = {
    filterFn,
    inputRef,
    isLoading,
    onLoadMore,
    inputProps,
    noItemsText,
    loadingText,
    state: inState,
    isSearchable,
    className: s.list,
    listRef: isSearchable ? mergedCollectionRef : collectionRef,
  };

  const listProps = mergeProps(
    baseListProps,
    isSearchable ? collectionProps : null,
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
        inState.open();
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
      offset: 4,
      state: inState,
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
              {renderValue(inState, {
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

function StandaloneSelect<
  T extends object,
  M extends SelectionMode = 'single',
>({
  props: inProps,
  listBoxRef,
  collection,
}: {
  props: SelectProps<T, M>;
  listBoxRef: RefObject<HTMLDivElement>;
  collection: BaseCollection<T>;
}) {
  const props = { ...inProps, collection, children: null, items: null };

  const { isDisabled: formIsDisabled } = useForm();

  const isDisabled = inProps?.isDisabled ?? formIsDisabled;

  const state = useSelectState<T, M>(
    removeDataAttributes({
      ...props,
      isDisabled,
      allowsEmptyCollection: true,
    } as unknown as SelectStateOptions<T, M>)
  );

  return (
    <SelectInner
      state={state}
      listBoxRef={listBoxRef}
      props={{ ...props, isDisabled }}
    />
  );
}

function SelectRender<T extends object, M extends SelectionMode = 'single'>(
  props: Omit<SelectProps<T, M>, 'ref'>,
  ref: Ref<SelectRef>
) {
  const listBoxRef = useDOMRef<HTMLDivElement>(ref);

  return (
    <CollectionBuilder content={<Collection {...props} />}>
      {(collection: BaseCollection<T>) => (
        <StandaloneSelect
          props={props}
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
  Section: typeof SelectSection;
  Divider: typeof Divider;
  ItemText: typeof ListItemText;
};

export const Select = SelectComponent as CompoundedComponent;

Select.Item = SelectOption;
Select.Section = SelectSection;
Select.Divider = Divider;
Select.ItemText = List.ItemText;
