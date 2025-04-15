import { forwardRef, type Ref } from 'react';

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
} from '@koobiq/react-primitives';
import type { Node } from '@koobiq/react-primitives';

import {
  FieldLabel,
  FieldError,
  FieldSelect,
  FieldCaption,
  FieldInputGroup,
} from '../FieldComponents';
import { ListInner } from '../List/List';
import { PopoverInner } from '../Popover';

import type { SelectRef, SelectProps, SelectComponent } from './index';
import s from './Select.module.css';

function SelectRender<T extends object>(
  props: Omit<SelectProps<T>, 'ref'>,
  ref: Ref<SelectRef>
) {
  const {
    fullWidth = false,
    hiddenLabel = false,
    'data-testid': testId,
    open,
    onOpenChange,
    defaultOpen,
    items,
    error,
    caption,
    endAddon,
    required,
    disabled,
    children,
    slotProps,
    startAddon,
    selectedKey,
    placeholder,
    errorMessage,
    disabledKeys,
    onSelectionChange,
    defaultSelectedKey,
    renderValue: renderValueProp,
    ...other
  } = props;

  const state = useSelectState({
    ...other,
    items,
    defaultOpen,
    onOpenChange,
    isOpen: open,
    placeholder,
    selectedKey,
    disabledKeys,
    errorMessage,
    isInvalid: error,
    onSelectionChange,
    defaultSelectedKey,
    isRequired: required,
    isDisabled: disabled,
    children,
  });

  const domRef = useDOMRef<HTMLButtonElement>(ref);

  const [opened, { on, off }] = useBoolean(state.isOpen);

  const {
    menuProps,
    valueProps,
    triggerProps,
    labelProps: labelPropsCommon,
  } = useSelect(
    {
      ...other,

      placeholder,
      errorMessage,
      disabledKeys,
      isInvalid: error,
      isRequired: required,
      isDisabled: disabled,
    },
    { ...state, isOpen: state.isOpen || opened },
    domRef
  );

  const rootProps = mergeProps(
    {
      'data-testid': testId,
      'data-fullwidth': fullWidth,
      'data-disabled': disabled,
      'data-required': required,
      'data-error': error,
      className: clsx(s.base, fullWidth && s.fullWidth),
    },
    other
  );

  // Match the Popover width to the control element's width.
  const { ref: containerRef, width } = useElementSize();

  const listProps = mergeProps(
    { className: s.list, state },
    slotProps?.list,
    menuProps
  );

  const labelProps = mergeProps(
    { hidden: hiddenLabel, required },
    slotProps?.label,
    labelPropsCommon
  );

  const groupProps = mergeProps(
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
      error,
      ref: containerRef,
    },
    slotProps?.group
  );

  const controlProps = mergeProps(
    {
      error,
      disabled,
      ref: domRef,
      placeholder,
    },
    slotProps?.control,
    valueProps,
    triggerProps
  );

  const captionProps = slotProps?.caption;

  const errorProps = mergeProps({ error }, slotProps?.errorMessage);

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
      <div {...rootProps}>
        <FieldLabel {...labelProps}>{props.label}</FieldLabel>
        <HiddenSelect
          state={state}
          isDisabled={disabled}
          triggerRef={domRef}
          label={props.label}
          name={props.name}
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
      </div>
      <PopoverInner {...popoverProps}>
        <ListInner {...listProps} />
      </PopoverInner>
    </>
  );
}

export const Select = forwardRef(SelectRender) as SelectComponent;
