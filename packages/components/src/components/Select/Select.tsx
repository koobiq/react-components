import { forwardRef, type Ref, useCallback } from 'react';

import {
  useDOMRef,
  mergeProps,
  useElementSize,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconChevronDownS16, IconXmarkCircle16 } from '@koobiq/react-icons';
import {
  FieldErrorContext,
  FormContext,
  removeDataAttributes,
  useMultiSelect,
  useMultiSelectState,
  useSlottedContext,
} from '@koobiq/react-primitives';

import { Item, Section, Divider } from '../Collections';
import type {
  FormFieldLabelProps,
  FormFieldErrorProps,
  FormFieldSelectProps,
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
} from '../FormField';
import { FormField } from '../FormField';
import { IconButton } from '../IconButton';
import type { ListItemText } from '../List';
import { List } from '../List';
import { PopoverInner } from '../Popover/PopoverInner';

import { SelectList, TagGroup } from './components';
import type { SelectRef, SelectProps, SelectComponent } from './index';
import intlMessages from './intl';
import s from './Select.module.css';

function SelectRender<T extends object>(
  props: Omit<SelectProps<T>, 'ref'>,
  ref: Ref<SelectRef>
) {
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
    renderValue: renderValueProp,
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  const domRef = useDOMRef<HTMLDivElement>(ref);

  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};

  const validationBehavior =
    props.validationBehavior ?? formValidationBehavior ?? 'aria';

  const state = useMultiSelectState(
    removeDataAttributes({ ...props, selectionMode })
  );

  const hasClearButton = isClearable && !isDisabled && state.selectedItems;

  const handleClear = useCallback(() => {
    state.selectionManager.setSelectedKeys(new Set());
    onClear?.();
  }, [onClear, state]);

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
      disallowEmptySelection: true,
      validationBehavior,
    }),
    state,
    domRef
  );

  const { isInvalid } = validation;

  // Match the Popover width to the control element's width.
  const { ref: containerRef, width } = useElementSize();

  const rootProps = mergeProps({
    'data-testid': testId,
    'data-invalid': isInvalid || undefined,
    'data-disabled': props.isDisabled || undefined,
    'data-required': props.isRequired || undefined,
    className,
    fullWidth,
    labelPlacement,
    labelAlign,
    style,
  });

  const listProps = mergeProps(
    { className: s.list, state, noItemsText },
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
      'aria-label': t.format('clear'),
      onPress: handleClear,
      className: s.clearButton,
      variant: isInvalid ? 'error' : 'fade-contrast',
      preventFocusOnPress: true,
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
        if (e.currentTarget !== e.target) return;
        e.preventDefault();
        domRef?.current?.focus();
        state.open();
      },
      endAddon: (
        <>
          {endAddon}
          {hasClearButton && (
            <IconButton {...clearButtonProps}>
              <IconXmarkCircle16 />
            </IconButton>
          )}
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
      ref: domRef,
      placeholder,
    },
    valueProps,
    triggerProps,
    slotProps?.control
  );

  const popoverProps = mergeProps(
    {
      state,
      offset: 4,
      size: width,
      hideArrow: true,
      anchorRef: containerRef,
      className: s.popover,
      placement: 'bottom start',
      type: 'listbox',
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
              {renderValue(state, {
                isInvalid,
                isDisabled: props.isDisabled,
                isRequired: props.isRequired,
              })}
            </FormField.Select>
          </FormField.ControlGroup>
          <FormField.Caption {...captionProps} />
          <FieldErrorContext.Provider value={validation}>
            <FormField.Error {...errorProps} />
          </FieldErrorContext.Provider>
        </div>
      </FormField>
      <PopoverInner {...popoverProps}>
        <SelectList {...listProps} />
      </PopoverInner>
    </>
  );
}

const SelectComponent = forwardRef(SelectRender) as SelectComponent;

type CompoundedComponent = typeof SelectComponent & {
  Item: typeof Item;
  Section: typeof Section;
  Divider: typeof Divider;
  ItemText: typeof ListItemText;
};

export const Select = SelectComponent as CompoundedComponent;

Select.Item = Item;
Select.Section = Section;
Select.Divider = Divider;
Select.ItemText = List.ItemText;
