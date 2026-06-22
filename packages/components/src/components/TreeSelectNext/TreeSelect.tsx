import { useCallback, useRef, useState } from 'react';

import {
  clsx,
  mergeProps,
  useControlledState,
  useElementSize,
} from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import {
  CollectionBuilder,
  Collection,
  FieldErrorContext,
  composeRenderProps,
  type TreeProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Divider } from '../Divider';
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
import { SearchInput } from '../SearchInput';
import { SelectedTags } from '../SelectedTags';

import { TreeCollection, TreeInner } from './TreeInner';
import s from './TreeSelect.module.css';
import type { TestInnerProps, TreeSelectProps } from './types';
import { useTreeSelect } from './useTreeSelect';
import { useTreeSelectState } from './useTreeSelectState';

const { list } = utilClasses;

export function TreeSelectInner<T extends object>({
  props,
  collection,
}: TestInnerProps<T>) {
  const {
    labelAlign,
    placeholder,
    labelPlacement,
    onClear,
    isClearable,
    startAddon,
    endAddon,
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
    defaultInputValue = '',
    inputValue: inputValueProp,
    ...treeProps
  } = props;

  const { ref: triggerRef, width } = useElementSize();
  const controlRef = useRef<HTMLDivElement>(null);
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

  const state = useTreeSelectState({
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
  } = useTreeSelect({ ...props, triggerRef }, state, treeRef);

  const validation = {
    isInvalid: isInvalidAria,
    validationErrors,
    validationDetails,
  };

  const clearButtonIsHidden = isDisabled || !state.selectedItems.length;

  const handleClear = useCallback(() => {
    // TODO: check it up
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

  const renderValue =
    selectionMode === 'multiple' ? (
      <SelectedTags
        state={state}
        states={{ isInvalid: isInvalidAria, isDisabled, isRequired }}
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
          <SearchInput
            aria-label="search"
            value={inputValue}
            onChange={setInputValue}
            fullWidth
            isLabelHidden
            variant="transparent"
            className={s.search}
          />
          <Divider disablePaddings />
          <TreeInner
            props={
              {
                ...treeProps,
                ...treePropsAria,
                'data-padded': true,
                className: composeRenderProps(className, (className) =>
                  clsx('kbq-Tree', list, className)
                ),
              } as TreeProps<T>
            }
            treeRef={treeRef}
            state={state}
          />
        </div>
      </PopoverInner>
    </FormField>
  );
}

export function TreeSelect<T extends object>(props: TreeSelectProps<T>) {
  return (
    <CollectionBuilder
      content={<Collection {...props} />}
      createCollection={() => new TreeCollection<T>()}
    >
      {(collection) => (
        <TreeSelectInner props={props} collection={collection} />
      )}
    </CollectionBuilder>
  );
}

function areSetsEqual<T>(a: Set<T>, b: Set<T>) {
  if (a.size !== b.size) return false;

  for (const item of a) {
    if (!b.has(item)) return false;
  }

  return true;
}
