'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
} from 'react';
import type { ReactElement, ReactNode, Ref } from 'react';

import {
  clsx,
  mergeProps,
  useControlledState,
  useDOMRef,
  useElementSize,
  useFilter,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import {
  ButtonContext,
  Collection,
  DEFAULT_SLOT,
  FieldErrorContext,
  FormContext,
  Provider,
  useTreeSelect,
  useTreeSelectState,
  useSlottedContext,
  type AriaTreeSelectProps,
} from '@koobiq/react-primitives';

import { Divider } from '../Divider';
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
import { SearchInput } from '../SearchInput';
import type { SearchInputProps } from '../SearchInput';
import { Tree } from '../Tree';
import { Typography } from '../Typography';

import intlMessages from './intl';
import s from './TreeSelect.module.css';
import type {
  TreeSelectComponent,
  TreeSelectItemProps,
  TreeSelectNode,
  TreeSelectProps,
  TreeSelectRef,
} from './types';
import { filterTree, getNodeTextValue } from './utils';

function isTreeSelectItemElement(
  node: ReactNode
): node is ReactElement<TreeSelectItemProps> {
  return (
    isValidElement<TreeSelectItemProps>(node) && node.type === TreeSelectItem
  );
}

function getStaticItemLabel(children: ReactNode, fallback: string): ReactNode {
  const labelChildren = Children.toArray(children).filter(
    (child) =>
      !isTreeSelectItemElement(child) &&
      !(typeof child === 'string' && child.trim().length === 0)
  );

  if (labelChildren.length === 0) return fallback;

  if (labelChildren.length === 1) {
    const [label] = labelChildren;

    return typeof label === 'string' ? label.trim() : label;
  }

  return labelChildren;
}

function getStaticItems(children: ReactNode): TreeSelectNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isTreeSelectItemElement(child)) return [];

    const { id, textValue, isDisabled, children: itemChildren } = child.props;

    const nestedItems = getStaticItems(itemChildren);

    return {
      id,
      textValue,
      isDisabled,
      label: getStaticItemLabel(itemChildren, textValue ?? id),
      children: nestedItems.length ? nestedItems : undefined,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TreeSelectItem(_props: TreeSelectItemProps) {
  return null;
}

TreeSelectItem.displayName = 'TreeSelect.Item';

/**
 * Select with hierarchical tree data.
 */
function TreeSelectRender(
  props: Omit<TreeSelectProps, 'ref'>,
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
    inputValue: inputValueProp,
    defaultInputValue = '',
    onInputChange,
    isSearchable = true,
    searchPlaceholder,
    placeholder,
    renderValue: renderValueProp,
    noResultsText,
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

  const [inputValue, setInputValue] = useControlledState(
    inputValueProp,
    defaultInputValue,
    onInputChange
  );

  const { contains } = useFilter({ sensitivity: 'base' });

  const t = useLocalizedStringFormatter(intlMessages);

  const collectionItems = useMemo(
    () => items ?? getStaticItems(children),
    [children, items]
  );

  const { items: visibleItems, expandedIds } = useMemo(
    () =>
      inputValue
        ? filterTree(collectionItems, (text) => contains(text, inputValue))
        : { items: collectionItems, expandedIds: [] as string[] },
    [collectionItems, inputValue, contains]
  );

  const treeSelectProps: AriaTreeSelectProps = {
    items: collectionItems,
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

  const renderDefaultValue: typeof renderValueProp = (node) =>
    node ? node.label : null;

  const renderValue = renderValueProp || renderDefaultValue;

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
      items: visibleItems,
      isPadded: true,
      expandedKeys: inputValue ? new Set(expandedIds) : treeProps.expandedKeys,
      renderEmptyState: () => (
        <Typography variant="text-normal">
          {noResultsText ?? t.format('nothing found')}
        </Typography>
      ),
    },
    slotProps?.tree
  );

  const searchInputProps = mergeProps<(SearchInputProps | undefined)[]>(
    {
      'aria-label': t.format('search'),
      isLabelHidden: true,
      isDisabled,
      placeholder: searchPlaceholder,
      value: inputValue,
      onChange: setInputValue,
      fullWidth: true,
      variant: 'transparent',
      className: s.search,
    },
    slotProps?.searchInput
  );

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
            {isSearchable && (
              <>
                <SearchInput {...searchInputProps} />
                <Divider disablePaddings />
              </>
            )}
            <Tree {...finalTreeProps}>
              {function renderItem(node: TreeSelectNode) {
                return (
                  <Tree.Item id={node.id} textValue={getNodeTextValue(node)}>
                    <Tree.ItemContent>{node.label}</Tree.ItemContent>
                    {node.children ? (
                      <Collection items={node.children}>
                        {renderItem}
                      </Collection>
                    ) : null}
                  </Tree.Item>
                );
              }}
            </Tree>
          </div>
        </PopoverInner>
      </FormField>
    </Provider>
  );
}

const TreeSelectComponent = forwardRef(TreeSelectRender) as TreeSelectComponent;

export const TreeSelect = TreeSelectComponent;

TreeSelect.displayName = 'TreeSelect';
TreeSelect.Item = TreeSelectItem;
