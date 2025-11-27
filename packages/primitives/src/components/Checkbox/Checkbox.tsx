'use client';

import { type ComponentRef, useContext } from 'react';
import { forwardRef } from 'react';

import { useDOMRef, mergeProps, filterDOMProps } from '@koobiq/react-core';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useToggleState } from '@react-stately/toggle';

import { useCheckbox, useCheckboxGroupItem } from '../../behaviors';
import { removeDataAttributes, useRenderProps } from '../../utils';

import {
  CheckboxGroupContext,
  type CheckboxProps,
  type CheckboxRenderProps,
} from './index';

export const Checkbox = forwardRef<ComponentRef<'label'>, CheckboxProps>(
  (props, ref) => {
    const { children, inputRef } = props;

    const groupState = useContext(CheckboxGroupContext);
    const domRef = useDOMRef<ComponentRef<'input'>>(inputRef);

    const {
      isHovered,
      isInvalid,
      isSelected,
      isFocused,
      isPressed,
      isReadOnly,
      isDisabled,
      isFocusVisible,
      isIndeterminate,
      labelProps,
      inputProps,
    } = groupState
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useCheckboxGroupItem(
          {
            ...removeDataAttributes(props),
            children: typeof children === 'function' ? true : children,
            value: props.value as string,
          },
          groupState,
          domRef
        )
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useCheckbox(
          {
            ...removeDataAttributes(props),
            children: typeof children === 'function' ? true : children,
          },
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useToggleState(props),
          domRef
        );

    const renderValues: CheckboxRenderProps = {
      isHovered,
      isInvalid,
      isSelected,
      isFocused,
      isPressed,
      isReadOnly,
      isFocusVisible,
      isIndeterminate,
      isDisabled: isDisabled || false,
    };

    const renderProps = useRenderProps({
      ...props,
      values: renderValues,
    });

    const DOMProps = filterDOMProps(props);
    delete DOMProps.id;

    return (
      <label
        data-hovered={isHovered || undefined}
        data-pressed={isPressed || undefined}
        data-focused={isFocused || undefined}
        data-invalid={isInvalid || undefined}
        data-selected={isSelected || undefined}
        data-disabled={isDisabled || undefined}
        data-read-only={isReadOnly || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-indeterminate={isIndeterminate || undefined}
        {...mergeProps(DOMProps, labelProps, renderProps)}
        ref={ref}
      >
        <VisuallyHidden elementType="span">
          <input {...inputProps} ref={domRef} />
        </VisuallyHidden>
        {renderProps.children}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
