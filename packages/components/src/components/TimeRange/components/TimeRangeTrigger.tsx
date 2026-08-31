'use client';

import type { ReactElement, ReactNode, Ref } from 'react';

import { IconCalendarO16, IconChevronDownS16 } from '@koobiq/react-icons';
import type { ButtonOptions } from '@koobiq/react-primitives';

import { Button } from '../../Button';
import { FormField, FormFieldClearButton } from '../../FormField';
import s from '../TimeRange.module.css';
import type {
  TimeRangeRenderTriggerProps,
  TimeRangeTriggerVariant,
} from '../types';

export type TimeRangeTriggerProps = ButtonOptions & {
  ref: Ref<HTMLButtonElement>;
  'data-testid'?: string | number;
  formattedValue: string;
  isOpen: boolean;
  isEmpty: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  label?: ReactNode;
  triggerVariant: TimeRangeTriggerVariant;
  renderTrigger?: (props: TimeRangeRenderTriggerProps) => ReactElement;
  onClear: () => void;
};

export function TimeRangeTrigger({
  formattedValue,
  isOpen,
  isEmpty,
  isClearable,
  isDisabled,
  placeholder,
  label,
  triggerVariant,
  renderTrigger,
  onClear,
  ref,
  ...buttonProps
}: TimeRangeTriggerProps) {
  if (renderTrigger) {
    return renderTrigger({
      formattedValue,
      isOpen,
      isEmpty,
      buttonProps: { ...buttonProps, isDisabled, ref },
    });
  }

  const clearButton = (
    <FormFieldClearButton
      isClearable={isClearable && !isEmpty}
      onPress={() => onClear()}
    />
  );

  if (triggerVariant === 'field') {
    return (
      <FormField
        data-disabled={isDisabled || undefined}
        className={s.triggerField}
      >
        <FormField.Label>{label}</FormField.Label>
        <FormField.ControlGroup
          isDisabled={isDisabled}
          endAddon={
            <>
              {clearButton}
              <span className={s.chevron}>
                <IconChevronDownS16 />
              </span>
            </>
          }
        >
          <Button
            ref={ref}
            variant="fade-contrast-outline"
            isDisabled={isDisabled}
            className={s.selectValue}
            {...buttonProps}
          >
            {isEmpty ? placeholder : formattedValue}
          </Button>
        </FormField.ControlGroup>
      </FormField>
    );
  }

  return (
    <span className={s.triggerLink}>
      <Button
        ref={ref}
        variant="theme-transparent"
        isDisabled={isDisabled}
        startIcon={<IconCalendarO16 />}
        className={s.linkTrigger}
        {...buttonProps}
      >
        {isEmpty ? placeholder : formattedValue}
      </Button>
      {isClearable && !isEmpty && !isDisabled && clearButton}
    </span>
  );
}
