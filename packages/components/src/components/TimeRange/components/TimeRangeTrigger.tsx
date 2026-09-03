'use client';

import { useRef } from 'react';
import type { ComponentProps } from 'react';

import { mergeProps, mergeRefs } from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import { FieldErrorContext } from '@koobiq/react-primitives';

import { FormField } from '../../FormField';
import type {
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
  FormFieldErrorProps,
  FormFieldLabelProps,
  FormFieldProps,
} from '../../FormField';
import s from '../TimeRange.module.css';
import type { TimeRangeTriggerProps } from '../types';

import { useTimeRangeTriggerContext } from './TimeRangeTriggerContext';

/**
 * The pressable element that opens `TimeRange`'s popover. Rendered
 * automatically when `TimeRange` has no children — a `FormField`-based
 * control wired up from `label`/`isInvalid`/`errorMessage`/`caption` and the
 * rest of `TimeRange`'s own props. Render it explicitly with a function
 * child to replace the default trigger with your own layout instead — spread
 * the received `buttonProps` onto whatever element you render; the
 * `FormField` wiring only applies to the default trigger.
 */
export function TimeRangeTrigger({
  children,
  ...other
}: TimeRangeTriggerProps) {
  const {
    formattedValue,
    isOpen,
    isEmpty,
    isDisabled,
    placeholder,
    buttonProps: contextButtonProps,
    formField,
  } = useTimeRangeTriggerContext();

  const buttonProps = {
    ...contextButtonProps,
    isDisabled,
    'data-open': isOpen || undefined,
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  if (children) {
    return children({
      formattedValue,
      isOpen,
      isEmpty,
      isDisabled: Boolean(isDisabled),
      placeholder,
      buttonProps,
    });
  }

  const rootProps = mergeProps<(FormFieldProps | undefined)[]>(
    {
      fullWidth: formField.fullWidth,
      labelPlacement: formField.labelPlacement,
      labelAlign: formField.labelAlign,
      'data-invalid': formField.isInvalid || undefined,
      'data-disabled': isDisabled || undefined,
      'data-required': formField.isRequired || undefined,
    },
    formField.slotProps?.root
  );

  const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
    {
      isHidden: formField.isLabelHidden,
      isRequired: formField.isRequired,
      children: formField.label,
    },
    formField.slotProps?.label
  );

  const captionProps = mergeProps<(FormFieldCaptionProps | undefined)[]>(
    { children: formField.caption },
    formField.slotProps?.caption
  );

  const errorProps = mergeProps<(FormFieldErrorProps | undefined)[]>(
    { children: formField.errorMessage },
    formField.slotProps?.errorMessage
  );

  const groupProps = mergeProps<(FormFieldControlGroupProps | undefined)[]>(
    {
      ref: formField.groupRef,
      isDisabled,
      isInvalid: formField.isInvalid,
      endAddon: <IconChevronDownS16 className={s.chevron} />,
      slotProps: { endAddon: { className: s.addon } },
      // The chevron/padding around the trigger button aren't part of it, so
      // clicking there wouldn't open the popover — forward the click to the
      // trigger, same as `SelectNext`'s `ControlGroup`.
      onMouseDown: (e) => {
        if (isDisabled || buttonRef.current?.contains(e.target as Node)) {
          return;
        }

        e.preventDefault();
        buttonRef.current?.click();
      },
    },
    formField.slotProps?.group
  );

  return (
    <FormField {...rootProps}>
      <FormField.Label {...labelProps} />
      <FormField.ControlGroup {...groupProps}>
        <FormField.Select
          as="button"
          {...(mergeProps(buttonProps, other) as ComponentProps<
            typeof FormField.Select
          >)}
          ref={mergeRefs(buttonProps.ref, buttonRef)}
          placeholder={placeholder}
        >
          {isEmpty ? undefined : formattedValue}
        </FormField.Select>
      </FormField.ControlGroup>
      <FieldErrorContext.Provider
        value={{
          isInvalid: Boolean(formField.isInvalid),
          validationErrors: [],
          validationDetails: {} as ValidityState,
        }}
      >
        <FormField.Error {...errorProps} />
      </FieldErrorContext.Provider>
      <FormField.Caption {...captionProps} />
    </FormField>
  );
}

TimeRangeTrigger.displayName = 'TimeRange.Trigger';
