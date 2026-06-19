'use client';

import { forwardRef, useCallback } from 'react';
import type { Ref } from 'react';

import {
  clsx,
  mergeProps,
  useDOMRef,
  useElementSize,
} from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import {
  ButtonContext,
  Collection,
  CollectionBuilder,
  DEFAULT_SLOT,
  FieldErrorContext,
  FormContext,
  Provider,
  useTreeSelect,
  useTreeSelectState,
  useSlottedContext,
  type AriaTreeSelectProps,
} from '@koobiq/react-primitives';

import { useForm } from '../Form';
import type {
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
  FormFieldErrorProps,
  FormFieldLabelProps,
  FormFieldProps,
  FormFieldSelectProps,
} from '../FormField';
import { FormField, FormFieldClearButton } from '../FormField';
import type { PopoverInnerProps, PopoverProps } from '../Popover';
import { PopoverInner } from '../Popover/PopoverInner';
import { Tree } from '../Tree';

import s from './TreeSelect.module.css';
import type {
  TreeSelectComponent,
  TreeSelectProps,
  TreeSelectRef,
} from './types';

/**
 * Select with hierarchical tree data.
 */
function TreeSelectRender<T extends object>(
  props: Omit<TreeSelectProps<T>, 'ref'>,
  ref: Ref<TreeSelectRef>
) {
  const {
    items,
    children,
    label,
    variant = 'filled',
    'aria-label': ariaLabel,
    selectedKey,
    defaultSelectedKey = null,
    onSelectionChange,
    expandedKeys,
    defaultExpandedKeys = [],
    onExpandedChange,
    isOpen,
    defaultOpen,
    onOpenChange,
    placeholder,
    renderValue: renderValueProp,
    isLabelHidden,
    labelPlacement,
    labelAlign,
    caption,
    errorMessage,
    isRequired,
    isInvalid,
    validationState,
    validationBehavior: validationBehaviorProp,
    validate,
    isDisabled: isDisabledProp,
    fullWidth,
    className,
    style,
    startAddon,
    endAddon,
    isClearable,
    onClear,
    slotProps,
    'data-testid': testId,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
  } = props;

  const controlRef = useDOMRef<TreeSelectRef>(ref);

  const { isDisabled: formIsDisabled } = useForm();

  const isDisabled = isDisabledProp ?? formIsDisabled;

  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};

  const validationBehavior =
    validationBehaviorProp ?? formValidationBehavior ?? 'aria';

  const treeSelectProps: AriaTreeSelectProps<T> = {
    items,
    label,
    'aria-label': ariaLabel,
    selectedKey,
    defaultSelectedKey,
    onSelectionChange,
    expandedKeys,
    defaultExpandedKeys,
    onExpandedChange,
    isOpen,
    defaultOpen,
    onOpenChange,
    isDisabled,
    isRequired,
    isInvalid,
    validationState,
    validationBehavior,
    validate,
    caption,
    errorMessage,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
  };

  const treeSelectState = useTreeSelectState(treeSelectProps);

  const {
    treeProps,
    valueProps,
    triggerProps,
    validationErrors,
    descriptionProps,
    errorMessageProps,
    validationDetails,
    isInvalid: isInvalidState,
    labelProps: labelPropsAria,
    popoverProps: popoverPropsAria,
  } = useTreeSelect(
    { ...treeSelectProps, triggerRef: controlRef },
    treeSelectState
  );

  const validation = {
    isInvalid: isInvalidState,
    validationErrors,
    validationDetails,
  };

  const { ref: containerRef, width } = useElementSize();

  const clearButtonIsHidden =
    isDisabled || !isClearable || treeSelectState.selectedKey == null;

  const handleClear = useCallback(() => {
    treeSelectState.setSelectedKey(null);
    onClear?.();
  }, [onClear, treeSelectState]);

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
      'data-invalid': isInvalidState || undefined,
    },
    slotProps?.root
  );

  const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
    { isHidden: isLabelHidden, isRequired, children: label },
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
        treeSelectState.open();
      },
      variant,
      isInvalid: isInvalidState,
      isDisabled,
      ref: containerRef,
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
      ...popoverPropsAria,
      offset: 4,
      hideArrow: true,
      maxBlockSize: 320,
      className: s.popover,
      anchorRef: containerRef,
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

  const finalTreeProps = mergeProps(
    treeProps,
    {
      className: s.tree,
      items,
      isPadded: true,
    },
    slotProps?.tree
  );

  return (
    <CollectionBuilder
      content={<Collection items={items}>{children}</Collection>}
    >
      {(collection) => {
        const renderDefaultValue: typeof renderValueProp = () => {
          if (treeSelectState.selectedKey == null) return null;

          return (
            collection.getItem(treeSelectState.selectedKey)?.textValue ?? null
          );
        };

        const renderValue = renderValueProp || renderDefaultValue;

        return (
          <Provider
            values={[
              [
                ButtonContext,
                {
                  slots: {
                    [DEFAULT_SLOT]: {},
                    'clear-button': {},
                  },
                },
              ],
            ]}
          >
            <FormField {...rootProps}>
              <FormField.Label {...labelProps} />
              <div className={s.body}>
                <FormField.ControlGroup {...groupProps}>
                  <FormField.Select {...controlProps}>
                    {renderValue(treeSelectState.selectedNode, {
                      isInvalid: isInvalidState,
                      isDisabled,
                      isRequired,
                    })}
                  </FormField.Select>
                </FormField.ControlGroup>
                <FieldErrorContext.Provider value={validation}>
                  <FormField.Error {...errorProps} />
                </FieldErrorContext.Provider>
                <FormField.Caption {...captionProps} />
              </div>
              <PopoverInner {...popoverProps}>
                <div className={s.content}>
                  <Tree {...finalTreeProps}>{children}</Tree>
                </div>
              </PopoverInner>
            </FormField>
          </Provider>
        );
      }}
    </CollectionBuilder>
  );
}

const TreeSelectComponent = forwardRef(
  TreeSelectRender
) as unknown as TreeSelectComponent;

export const TreeSelect = TreeSelectComponent;

TreeSelect.displayName = 'TreeSelect';
TreeSelect.Item = Tree.Item;
TreeSelect.ItemContent = Tree.ItemContent;
