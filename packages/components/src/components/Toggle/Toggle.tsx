'use client';

import { type ComponentRef, forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, isNotNil, mergeProps } from '@koobiq/react-core';
import { Switch, type SwitchProps } from '@koobiq/react-primitives';

import type { ToggleProps } from './index';
import s from './Toggle.module.css';

export const Toggle = forwardRef<ComponentRef<'label'>, ToggleProps>(
  (props, ref) => {
    const {
      size = 'normal',
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
      children,
      slotProps,
      className,
      ...other
    } = props;

    const isDisabled = isDisabledProp ?? disabled ?? false;
    const isSelected = isSelectedProp ?? checked;
    const isInvalid = isInvalidProp ?? error ?? false;
    const defaultSelected = defaultSelectedProp ?? defaultChecked;
    const isReadOnly = isReadOnlyProp ?? readonly ?? false;

    if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
      deprecate(
        'Toggle: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'checked' in props) {
      deprecate(
        'Toggle: the "checked" prop is deprecated. Use "isSelected" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'error' in props) {
      deprecate(
        'Toggle: the "error" prop is deprecated. Use "isInvalid" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'defaultChecked' in props) {
      deprecate(
        'Toggle: the "defaultChecked" prop is deprecated. Use "defaultSelected" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'readonly' in props) {
      deprecate(
        'Toggle: the "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.'
      );
    }

    const commonProps: SwitchProps = {
      isDisabled,
      isSelected,
      isInvalid,
      isReadOnly,
      defaultSelected,
      className: ({
        isInvalid,
        isHovered,
        isFocusVisible,
        isDisabled,
        isSelected,
      }) =>
        clsx(
          s.base,
          s[size],
          s[labelPlacement],
          isInvalid && s.invalid,
          isHovered && s.hovered,
          isSelected && s.selected,
          isDisabled && s.disabled,
          isFocusVisible && s.focusVisible,
          className
        ),
      ...other,
    };

    const trackProps = mergeProps({ className: s.track }, slotProps?.track);
    const labelProps = slotProps?.label;

    return (
      <Switch
        data-size={size}
        data-label-placement={labelPlacement}
        {...commonProps}
        ref={ref}
      >
        <span {...trackProps} />
        {isNotNil(children) && <span {...labelProps}>{children}</span>}
      </Switch>
    );
  }
);

Toggle.displayName = 'Toggle';
