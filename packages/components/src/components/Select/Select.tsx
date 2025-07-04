import { forwardRef, type Ref } from 'react';

import { deprecate } from '@koobiq/logger';
import {
  clsx,
  mergeProps,
  useBoolean,
  useDOMRef,
  useElementSize,
} from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import {
  useSelect,
  useSelectState,
  HiddenSelect,
  removeDataAttributes,
} from '@koobiq/react-primitives';
import type { Node } from '@koobiq/react-primitives';

import { Item, Section } from '../Collections';
import {
  FieldLabel,
  FieldError,
  FieldSelect,
  FieldCaption,
  FieldInputGroup,
  FieldControl,
  type FieldLabelProps,
  type FieldInputGroupProps,
  type FieldCaptionProps,
  type FieldErrorProps,
  type FieldSelectProps,
} from '../FieldComponents';
import { ListItemText, ListInner } from '../List';
import { PopoverInner } from '../Popover';

import type { SelectRef, SelectProps, SelectComponentProp } from './index';
import s from './Select.module.css';

function SelectRender<T extends object>(
  props: Omit<SelectProps<T>, 'ref'>,
  ref: Ref<SelectRef>
) {
  const {
    fullWidth = false,
    'data-testid': testId,
    className,
    style,
    open,
    isOpen: isOpenProp,
    hiddenLabel,
    isLabelHidden: isLabelHiddenProp,
    disabled,
    isDisabled: isDisabledProp,
    error,
    isInvalid: isInvalidProp,
    required,
    isRequired: isRequiredProp,
    caption,
    placeholder,
    endAddon,
    slotProps,
    startAddon,
    label,
    name,
    errorMessage,
    renderValue: renderValueProp,
  } = props;

  const isOpen = isOpenProp ?? open;
  const isInvalid = isInvalidProp ?? error ?? false;
  const isDisabled = isDisabledProp ?? disabled ?? false;
  const isRequired = isRequiredProp ?? required ?? false;
  const isLabelHidden = isLabelHiddenProp ?? hiddenLabel ?? false;

  if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
    deprecate(
      'Select: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'required' in props) {
    deprecate(
      'Select: the "required" prop is deprecated. Use "isRequired" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'error' in props) {
    deprecate(
      'Select: the "error" prop is deprecated. Use "isInvalid" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'open' in props) {
    deprecate(
      'Select: the "open" prop is deprecated. Use "isOpen" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'hiddenLabel' in props) {
    deprecate(
      'Select: the "hiddenLabel" prop is deprecated. Use "isLabelHidden" prop to replace it.'
    );
  }

  const domRef = useDOMRef<HTMLButtonElement>(ref);

  const state = useSelectState({
    ...removeDataAttributes(props),
    isOpen,
    isInvalid,
    isDisabled,
    isRequired,
  });

  const [opened, { on, off }] = useBoolean(state.isOpen);

  const {
    menuProps,
    valueProps,
    triggerProps,
    labelProps: labelPropsAria,
    descriptionProps,
    errorMessageProps,
  } = useSelect(
    {
      ...removeDataAttributes(props),
      isOpen,
      isInvalid,
      isDisabled,
      isRequired,
    },
    { ...state, isOpen: state.isOpen || opened },
    domRef
  );

  // Match the Popover width to the control element's width.
  const { ref: containerRef, width } = useElementSize();

  const rootProps = mergeProps({
    'data-testid': testId,
    'data-invalid': isInvalid,
    'data-fullwidth': fullWidth,
    'data-disabled': isDisabled,
    'data-required': isRequired,
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
  >({ isHidden: isLabelHidden, isRequired }, slotProps?.label, labelPropsAria);

  const groupProps = mergeProps<
    [FieldInputGroupProps, FieldInputGroupProps | undefined]
  >(
    {
      slotProps: {
        end: { className: s.addon },
        start: { className: s.addon },
      },
      startAddon,
      endAddon: (
        <>
          {endAddon}
          <IconChevronDownS16 />
        </>
      ),
      isInvalid,
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
      isInvalid,
      isDisabled,
      ref: domRef,
      placeholder,
    },
    slotProps?.control,
    valueProps,
    triggerProps
  );

  const captionProps = mergeProps<
    [FieldCaptionProps, FieldCaptionProps | undefined, FieldCaptionProps]
  >({ isInvalid }, slotProps?.caption, descriptionProps);

  const errorProps = mergeProps<
    [FieldErrorProps, FieldErrorProps | undefined, FieldErrorProps]
  >({ isInvalid }, slotProps?.errorMessage, errorMessageProps);

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
      slotProps: {
        transition: {
          onEnter: on,
          onExited: off,
        },
      },
    },
    slotProps?.popover
  );

  const renderDefaultValue = (selectedItem: Node<T> | null) =>
    selectedItem?.rendered;

  const renderValue = renderValueProp || renderDefaultValue;

  return (
    <>
      <FieldControl {...rootProps}>
        <FieldLabel {...labelProps}>{label}</FieldLabel>
        <HiddenSelect
          name={name}
          label={label}
          state={state}
          triggerRef={domRef}
          isDisabled={isDisabled}
        />
        <FieldInputGroup {...groupProps}>
          <FieldSelect {...controlProps}>
            {renderValue(state?.selectedItem)}
          </FieldSelect>
        </FieldInputGroup>
        <FieldCaption {...captionProps}>
          {captionProps?.children || caption}
        </FieldCaption>
        <FieldError {...errorProps}>
          {errorProps.children || errorMessage}
        </FieldError>
      </FieldControl>
      <PopoverInner {...popoverProps}>
        <ListInner {...listProps} />
      </PopoverInner>
    </>
  );
}

const SelectComponent = forwardRef(SelectRender) as SelectComponentProp;

type CompoundedComponent = typeof SelectComponent & {
  Item: typeof Item;
  Section: typeof Section;
  ItemText: typeof ListItemText;
};

export const Select = SelectComponent as CompoundedComponent;

Select.Item = Item;
Select.Section = Section;
Select.ItemText = ListItemText;
