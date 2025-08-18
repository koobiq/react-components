import { forwardRef, type Ref, useCallback } from 'react';

import {
  clsx,
  useDOMRef,
  mergeProps,
  useElementSize,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconChevronDownS16, IconXmarkCircle16 } from '@koobiq/react-icons';
import {
  removeDataAttributes,
  useMultiSelect,
  useMultiSelectState,
} from '@koobiq/react-primitives';

import { Item, Section, Divider } from '../Collections';
import {
  FieldLabel,
  FieldError,
  FieldSelect,
  FieldCaption,
  FieldContentGroup,
  FieldControl,
  type FieldLabelProps,
  type FieldInputGroupProps,
  type FieldCaptionProps,
  type FieldErrorProps,
  type FieldSelectProps,
} from '../FieldComponents';
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
    fullWidth = false,
    isClearable = false,
    'data-testid': testId,
    selectionMode = 'single',
    selectedTagsOverflow = 'responsive',
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

  const state = useMultiSelectState(
    removeDataAttributes({ ...props, selectionMode })
  );

  const hasClearButton = isClearable && !isDisabled && state.selectedItems;

  const handleClear = useCallback(() => {
    state.selectionManager.clearSelection();
    onClear?.();
  }, [onClear, state]);

  const {
    isInvalid,
    menuProps,
    valueProps,
    triggerProps,
    labelProps: labelPropsAria,
    descriptionProps,
    errorMessageProps,
  } = useMultiSelect(
    removeDataAttributes({
      ...props,
      selectionMode,
      disallowEmptySelection: true,
    }),
    state,
    domRef
  );

  // Match the Popover width to the control element's width.
  const { ref: containerRef, width } = useElementSize();

  const rootProps = mergeProps({
    'data-testid': testId,
    'data-fullwidth': fullWidth,
    'data-invalid': isInvalid,
    'data-disabled': props.isDisabled,
    'data-required': props.isRequired,
    className: clsx(s.base, fullWidth && s.fullWidth, className),
    style,
  });

  const listProps = mergeProps(
    { className: s.list, state },
    slotProps?.list,
    menuProps
  );

  const labelProps = mergeProps<
    [FieldLabelProps, FieldLabelProps | undefined, FieldLabelProps]
  >(
    { isHidden: isLabelHidden, children: label, isRequired },
    slotProps?.label,
    labelPropsAria
  );

  const clearButtonProps = mergeProps(
    {
      'aria-labe': t.format('clear'),
      onPress: handleClear,
      className: s.clearButton,
      variant: isInvalid ? 'error' : 'fade-contrast',
      preventFocusOnPress: true,
    },
    slotProps?.clearButton
  );

  const groupProps = mergeProps<
    [FieldInputGroupProps, FieldInputGroupProps | undefined]
  >(
    {
      slotProps: {
        endAddon: { className: s.addon },
        startAddon: { className: s.addon },
      },
      className: clsx(isClearable && s.clearable),
      startAddon,
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

  const controlProps = mergeProps<
    [
      FieldSelectProps,
      FieldSelectProps | undefined,
      FieldSelectProps,
      FieldSelectProps,
    ]
  >(
    {
      ref: domRef,
      placeholder,
      isInvalid,
      isDisabled,
    },
    slotProps?.control,
    valueProps,
    triggerProps
  );

  const popoverProps = mergeProps(
    {
      state,
      offset: 4,
      size: width,
      hideArrow: true,
      anchorRef: domRef,
      className: s.popover,
      placement: 'bottom start',
      type: 'listbox',
    },
    slotProps?.popover
  );

  const captionProps = mergeProps<
    [FieldCaptionProps, FieldCaptionProps | undefined, FieldCaptionProps]
  >({ children: caption }, slotProps?.caption, descriptionProps);

  const errorProps = mergeProps<
    [FieldErrorProps, FieldErrorProps | undefined, FieldErrorProps]
  >(
    { isInvalid, children: errorMessage },
    slotProps?.errorMessage,
    errorMessageProps
  );

  const renderDefaultValue: typeof renderValueProp = (state, states) => {
    if (!state.selectedItems) return null;

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
      <FieldControl {...rootProps}>
        <FieldLabel {...labelProps} />
        <FieldContentGroup {...groupProps}>
          <FieldSelect {...controlProps}>
            {renderValue(state, {
              isInvalid,
              isDisabled: props.isDisabled,
              isRequired: props.isRequired,
            })}
          </FieldSelect>
        </FieldContentGroup>
        <FieldCaption {...captionProps} />
        <FieldError {...errorProps} />
      </FieldControl>
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
