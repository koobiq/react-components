'use client';

import { forwardRef, useCallback, useRef, useState, type Ref } from 'react';

import {
  clsx,
  mergeProps,
  useControlledState,
  useDOMRef,
  useElementSize,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import {
  CollectionBuilder,
  Collection,
  FieldErrorContext,
  composeRenderProps,
  useTreeSelect,
  useTreeSelectState,
  type TreeProps,
  type SelectionMode,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Divider } from '../Divider';
import { DropdownFooter } from '../DropdownFooter';
import {
  FormField,
  type FormFieldCaptionProps,
  FormFieldClearButton,
  type FormFieldControlGroupProps,
  type FormFieldErrorProps,
  type FormFieldLabelProps,
  type FormFieldProps,
  type FormFieldSelectProps,
} from '../FormField';
import type { PopoverInnerProps, PopoverProps } from '../Popover';
import { PopoverInner } from '../Popover/PopoverInner';
import { SearchInput, type SearchInputProps } from '../SearchInput';
import { SelectedTags } from '../SelectedTags';
import { Tree } from '../Tree';

import intlMessages from './intl';
import { TreeCollection, TreeInner } from './TreeInner';
import s from './TreeSelect.module.css';
import type {
  TreeSelectInnerProps,
  TreeSelectProps,
  TreeSelectComponent,
  TreeSelectRef,
} from './types';
import { areSetsEqual } from './utils';

const { list } = utilClasses;

export function TreeSelectInner<
  T extends object,
  M extends SelectionMode = 'single',
>({ props, collection, controlRef }: TreeSelectInnerProps<T, M>) {
  const {
    selectedTagsOverflow = 'responsive',
    defaultInputValue = '',
    labelAlign,
    placeholder,
    labelPlacement,
    onClear,
    isClearable,
    startAddon,
    endAddon,
    dropdownFooter,
    onInputChange,
    label,
    errorMessage,
    isLabelHidden,
    isDisabled,
    caption,
    'data-testid': testId,
    slotProps,
    fullWidth,
    style,
    className,
    variant,
    isRequired,
    inputValue: inputValueProp,
    ...treeProps
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  const { ref: triggerRef, width } = useElementSize();
  const treeRef = useRef(null);

  const {
    selectionMode,
    onExpandedChange,
    disabledBehavior,
    expandedKeys: propExpandedKeys,
    defaultExpandedKeys: propDefaultExpandedKeys,
  } = treeProps;

  const [inputValue, setInputValue] = useControlledState(
    inputValueProp,
    defaultInputValue,
    onInputChange
  );

  /** ----- TreeInner ----- */
  const [expandedKeys, setExpandedKeys] = useControlledState(
    propExpandedKeys ? new Set(propExpandedKeys) : undefined,
    propDefaultExpandedKeys ? new Set(propDefaultExpandedKeys) : new Set(),
    onExpandedChange
  );

  const [lastCollection, setLastCollection] = useState(collection);
  const [lastExpandedKeys, setLastExpandedKeys] = useState(expandedKeys);

  const [flattenedCollection, setFlattenedCollection] = useState(() =>
    collection.withExpandedKeys(lastExpandedKeys, expandedKeys)
  );

  if (
    !areSetsEqual(lastExpandedKeys, expandedKeys) ||
    collection !== lastCollection
  ) {
    setFlattenedCollection(
      collection.withExpandedKeys(lastExpandedKeys, expandedKeys)
    );

    setLastCollection(collection);
    setLastExpandedKeys(expandedKeys);
  }
  /** ----- ----- */

  const state = useTreeSelectState<T, M>({
    ...props,
    selectionMode,
    expandedKeys,
    onExpandedChange: setExpandedKeys,
    collection: flattenedCollection,
    children: undefined,
    disabledBehavior,
  });

  const {
    treeProps: treePropsAria,
    isInvalid: isInvalidAria,
    labelProps: labelPropsAria,
    valueProps,
    triggerProps,
    descriptionProps,
    errorMessageProps,
    validationErrors,
    validationDetails,
  } = useTreeSelect<T, M>(props, state, triggerRef);

  const validation = {
    isInvalid: isInvalidAria,
    validationErrors,
    validationDetails,
  };

  const clearButtonIsHidden = isDisabled || !state.selectedItems.length;

  const handleClear = useCallback(() => {
    state.setSelectedKeys(new Set([]));
    onClear?.();
  }, [onClear, state]);

  const rootProps = mergeProps<(FormFieldProps | undefined)[]>(
    {
      style,
      fullWidth,
      labelAlign,
      labelPlacement,
      'data-testid': testId,
      'data-variant': variant,
      className: clsx(s.base, className),
      'data-disabled': isDisabled || undefined,
      'data-required': isRequired || undefined,
      'data-invalid': isInvalidAria || undefined,
    },
    slotProps?.root
  );

  const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
    { isHidden: isLabelHidden, isRequired, children: label },
    labelPropsAria,
    slotProps?.label
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
      endAddon: (
        <>
          {endAddon}
          <FormFieldClearButton {...clearButtonProps} />
          <span className={s.chevron}>
            <IconChevronDownS16 />
          </span>
        </>
      ),
      onMouseDown: (event) => {
        if (event.currentTarget !== event.target || isDisabled) return;

        event.preventDefault();
        controlRef.current?.focus();
        state.open();
      },
      variant,
      isInvalid: isInvalidAria,
      isDisabled,
      ref: triggerRef,
    },
    slotProps?.group
  );

  const controlProps = mergeProps<(FormFieldSelectProps | undefined)[]>(
    {
      ref: controlRef,
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
      state,
      offset: 4,
      type: 'tree',
      hideArrow: true,
      maxBlockSize: 256,
      className: s.popover,
      anchorRef: triggerRef,
      placement: 'bottom start',
      'data-slot': 'dropdown',
      size: Math.max(width, 200),
      slotProps: {
        backdrop: { hidden: true },
        container: { className: s.container },
      },
    },
    slotProps?.popover
  );

  const searchInputProps = mergeProps<(SearchInputProps | undefined)[]>(
    {
      placeholder: t.format('search'),
      'aria-label': t.format('search'),
      fullWidth: true,
      isLabelHidden: true,
      variant: 'transparent',
      className: s.search,
    },
    slotProps?.['search-input'],
    {
      value: inputValue,
      onChange: setInputValue,
    }
  );

  const { className: treeClassName, ...treeSlotProps } = slotProps?.tree || {};

  const innerTreeProps = {
    ...mergeProps(treeProps, treePropsAria, treeSlotProps),
    'data-padded': true,
    className: composeRenderProps(treeClassName, (className) =>
      clsx('kbq-Tree', list, s.tree, className)
    ),
  } as TreeProps<T>;

  const renderValue =
    selectionMode === 'multiple' ? (
      <SelectedTags
        state={state}
        states={{ isInvalid: isInvalidAria, isDisabled, isRequired }}
        selectedTagsOverflow={selectedTagsOverflow}
      />
    ) : (
      state.selectedItems[0]?.textValue
    );

  return (
    <FormField {...rootProps}>
      <FormField.Label {...labelProps} />
      <div className={s.body}>
        <FormField.ControlGroup {...groupProps}>
          <FormField.Select {...controlProps}>
            {state.selectedItems.length ? renderValue : undefined}
          </FormField.Select>
        </FormField.ControlGroup>
        <FieldErrorContext.Provider value={validation}>
          <FormField.Error {...errorProps} />
        </FieldErrorContext.Provider>
        <FormField.Caption {...captionProps} />
      </div>
      <PopoverInner {...popoverProps}>
        <div className={s.content}>
          <SearchInput {...searchInputProps} />
          <Divider disablePaddings />
          <TreeInner props={innerTreeProps} treeRef={treeRef} state={state} />
          <DropdownFooter {...slotProps?.dropdownFooter}>
            {dropdownFooter}
          </DropdownFooter>
        </div>
      </PopoverInner>
    </FormField>
  );
}

function TreeSelectRender<T extends object, M extends SelectionMode = 'single'>(
  props: Omit<TreeSelectProps<T, M>, 'ref'>,
  ref: Ref<TreeSelectRef>
) {
  const controlRef = useDOMRef<HTMLDivElement>(ref);

  return (
    <CollectionBuilder
      content={<Collection {...props} />}
      createCollection={() => new TreeCollection<T>()}
    >
      {(collection) => (
        <TreeSelectInner
          props={props}
          collection={collection}
          controlRef={controlRef}
        />
      )}
    </CollectionBuilder>
  );
}

const TreeSelectComponent = forwardRef(TreeSelectRender) as TreeSelectComponent;

type CompoundedComponent = typeof TreeSelectComponent & {
  Item: typeof Tree.Item;
  ItemContent: typeof Tree.ItemContent;
};

/** Select with hierarchical tree data. */
export const TreeSelect = TreeSelectComponent as CompoundedComponent;

TreeSelect.Item = Tree.Item;
TreeSelect.ItemContent = Tree.ItemContent;
