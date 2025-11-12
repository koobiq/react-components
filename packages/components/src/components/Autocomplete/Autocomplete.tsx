import { forwardRef, useRef } from 'react';

import { mergeProps, useElementSize, useFilter } from '@koobiq/react-core';
import { IconChevronDown16 } from '@koobiq/react-icons';
import { useComboBox, useComboBoxState } from '@koobiq/react-primitives';

import { Item } from '../Collections';
import { FormField } from '../FormField';
import { IconButton } from '../IconButton';
import { ListInner } from '../List';
import type { PopoverInnerProps, PopoverProps } from '../Popover';
import { PopoverInner } from '../Popover/PopoverInner';

import s from './Autocomplete.module.css';
import type { AutocompleteComponent, AutocompleteProps } from './index';

export function AutocompleteRender<T>(props: AutocompleteProps<T>) {
  // Setup filter function and state.
  const { contains } = useFilter({ sensitivity: 'base' });
  const state = useComboBoxState({ ...props, defaultFilter: contains });

  // Setup refs and get props for child elements.
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);

  const {
    buttonProps,
    inputProps,
    listBoxProps,
    labelProps,
    errorMessageProps,
  } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state
  );

  // Match the Popover width to the control element's width.
  const { ref: containerRef, width } = useElementSize();

  const popoverProps = mergeProps<
    [PopoverInnerProps, PopoverProps | undefined]
  >(
    {
      state,
      offset: 4,
      hideArrow: true,
      type: 'listbox',
      maxBlockSize: 256,
      className: s.popover,
      anchorRef: inputRef,
      placement: 'bottom start',
      size: Math.max(width, 200),
      slotProps: { backdrop: { hidden: true } },
      popoverRef,
      isNonModal: true,
    },
    undefined
  );

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
      <div>
        <FormField>
          <FormField.Label {...labelProps}>{props.label}</FormField.Label>
          <div className={s.body}>
            <FormField.ControlGroup>
              <input
                {...inputProps}
                ref={inputRef}
                style={{
                  height: 24,
                  boxSizing: 'border-box',
                  marginRight: 0,
                  fontSize: 16,
                }}
              />
              <IconButton {...buttonProps} ref={buttonRef}>
                <IconChevronDown16 />
              </IconButton>
            </FormField.ControlGroup>
          </div>
        </FormField>

        {state.isOpen && (
          <PopoverInner {...popoverProps}>
            <ListInner
              {...listBoxProps}
              isPadded
              className={s.list}
              listRef={listBoxRef}
              state={state}
            />
          </PopoverInner>
        )}
      </div>
    </div>
  );
}

const AutocompleteComponent = forwardRef(
  AutocompleteRender
) as AutocompleteComponent;

type CompoundedComponent = typeof AutocompleteComponent & {
  Item: typeof Item;
};

export const Autocomplete = AutocompleteComponent as CompoundedComponent;

Autocomplete.Item = Item;
