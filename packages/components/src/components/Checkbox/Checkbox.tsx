'use client';

import { forwardRef, type ComponentRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, isNotNil, mergeProps } from '@koobiq/react-core';
import { IconCheckS16, IconMinusS16 } from '@koobiq/react-icons';
import {
  Checkbox as CheckboxPrimitive,
  type CheckboxProps as CheckboxPropsPrimitive,
} from '@koobiq/react-primitives';

import { AnimatedIcon } from '../AnimatedIcon';
import { useCheckboxGroupState } from '../CheckboxGroup/CheckboxGroupContext';

import s from './Checkbox.module.css';
import type { CheckboxProps } from './index';

export const Checkbox = forwardRef<ComponentRef<'label'>, CheckboxProps>(
  (props, ref) => {
    const {
      size: sizeProp,
      labelPlacement = 'end',
      disabled,
      isDisabled: isDisabledProp,
      checked,
      isSelected: isSelectedProp,
      error,
      isInvalid: isInvalidProp,
      defaultChecked,
      defaultSelected: defaultSelectedProp,
      readonly,
      isReadOnly: isReadOnlyProp,
      required,
      isRequired: isRequiredProp,
      indeterminate,
      isIndeterminate: isIndeterminateProp,
      children,
      className,
      slotProps,
      ...other
    } = props;

    const isDisabled = isDisabledProp ?? disabled;
    const isInvalid = isInvalidProp ?? error;
    const isSelected = isSelectedProp ?? checked;
    const defaultSelected = defaultSelectedProp ?? defaultChecked;
    const isReadOnly = isReadOnlyProp ?? readonly;
    const isRequired = isRequiredProp ?? required;
    const isIndeterminate = isIndeterminateProp ?? indeterminate;

    const { size: sizeState } = useCheckboxGroupState();

    const size = sizeProp || sizeState || 'normal';

    const commonProps: CheckboxPropsPrimitive = {
      isIndeterminate,
      isDisabled,
      isSelected,
      isInvalid,
      isRequired,
      isReadOnly,
      defaultSelected,
      className: ({
        isInvalid,
        isSelected,
        isHovered,
        isReadOnly,
        isDisabled,
        isFocusVisible,
        isIndeterminate,
      }) =>
        clsx(
          s.base,
          s[size],
          s[labelPlacement],
          isInvalid && s.invalid,
          isHovered && s.hovered,
          isReadOnly && s.readOnly,
          isDisabled && s.disabled,
          isSelected && s.selected,
          isFocusVisible && s.focusVisible,
          isIndeterminate && s.indeterminate,
          className
        ),
      ...other,
    };

    if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
      deprecate(
        'Checkbox: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'checked' in props) {
      deprecate(
        'Checkbox: the "checked" prop is deprecated. Use "isSelected" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'error' in props) {
      deprecate(
        'Checkbox: the "error" prop is deprecated. Use "isInvalid" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'defaultChecked' in props) {
      deprecate(
        'Checkbox: the "defaultChecked" prop is deprecated. Use "defaultSelected" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'readonly' in props) {
      deprecate(
        'Checkbox: the "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'required' in props) {
      deprecate(
        'Checkbox: the "required" prop is deprecated. Use "isRequired" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'indeterminate' in props) {
      deprecate(
        'Checkbox: the "indeterminate" prop is deprecated. Use "isIndeterminate" prop to replace it.'
      );
    }

    const boxProps = mergeProps({ className: s.checkbox }, slotProps?.box);
    const labelProps = slotProps?.label;

    return (
      <CheckboxPrimitive
        data-size={size}
        data-indeterminate={isIndeterminate || undefined}
        data-label-placement={labelPlacement}
        {...commonProps}
        ref={ref}
      >
        {({ isSelected, isIndeterminate }) => {
          // unchecked = -1, checked = 0, indeterminate = 1,
          const activeIndex = isIndeterminate
            ? 1
            : Number(Boolean(isSelected)) - 1;

          return (
            <>
              <span {...boxProps}>
                <AnimatedIcon
                  icons={[
                    <IconCheckS16 key="checked" />,
                    <IconMinusS16 key="indeterminate" />,
                  ]}
                  activeIndex={activeIndex}
                />
              </span>
              {isNotNil(children) && <span {...labelProps}>{children}</span>}
            </>
          );
        }}
      </CheckboxPrimitive>
    );
  }
);

Checkbox.displayName = 'Checkbox';
