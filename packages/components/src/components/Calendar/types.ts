import type { ComponentRef, ReactElement, Ref } from 'react';

import type { AriaCalendarProps, DateValue } from '@koobiq/react-primitives';

type CalendarPropMinValue<T extends DateValue> =
  AriaCalendarProps<T>['minValue'];

type CalendarPropMaxValue<T extends DateValue> =
  AriaCalendarProps<T>['maxValue'];

type CalendarPropValue<T extends DateValue> = AriaCalendarProps<T>['value'];

type CalendarPropDefaultValue<T extends DateValue> =
  AriaCalendarProps<T>['defaultValue'];

type CalendarPropOnChange<T extends DateValue> =
  AriaCalendarProps<T>['onChange'];

type CalendarPropIsDisabled<T extends DateValue> =
  AriaCalendarProps<T>['isDisabled'];

type CalendarPropFirstDayOfWeek<T extends DateValue> =
  AriaCalendarProps<T>['firstDayOfWeek'];

type CalendarPropIsDateUnavailable<T extends DateValue> =
  AriaCalendarProps<T>['isDateUnavailable'];

type CalendarPropFocusedValue<T extends DateValue> =
  AriaCalendarProps<T>['focusedValue'];

type CalendarPropDefaultFocusedValue<T extends DateValue> =
  AriaCalendarProps<T>['defaultFocusedValue'];

type CalendarPropOnFocusChange<T extends DateValue> =
  AriaCalendarProps<T>['onFocusChange'];

export type CalendarProps<T extends DateValue> = {
  /** Ref to the root container. */
  ref?: Ref<HTMLDivElement>;
  /** Additional CSS-classes. */
  className?: string;
  /** The minimum allowed date that a user may select. */
  minValue?: CalendarPropMinValue<T>;
  /** The maximum allowed date that a user may select. */
  maxValue?: CalendarPropMaxValue<T>;
  /** The current value (controlled). */
  value?: CalendarPropValue<T>;
  /** The default value (uncontrolled). */
  defaultValue?: CalendarPropDefaultValue<T>;
  /** Handler that is called when the value changes. */
  onChange?: CalendarPropOnChange<T>;
  /**
   * Whether the calendar is disabled.
   * @default false
   */
  isDisabled?: CalendarPropIsDisabled<T>;
  /**
   * The day that starts the week.
   */
  firstDayOfWeek?: CalendarPropFirstDayOfWeek<T>;
  /** Callback that is called for each date of the calendar. If it returns true, then the date is unavailable. */
  isDateUnavailable?: CalendarPropIsDateUnavailable<T>;
  /** Controls the currently focused date within the calendar. */
  focusedValue?: CalendarPropFocusedValue<T>;
  /** The date that is focused when the calendar first mounts (uncountrolled). */
  defaultFocusedValue?: CalendarPropDefaultFocusedValue<T>;
  /** Handler that is called when the focused date changes. */
  onFocusChange?: CalendarPropOnFocusChange<T>;
};

export type CalendarComponent = <T extends DateValue>(
  props: CalendarProps<T>
) => ReactElement | null;

export type CalendarRef = ComponentRef<'div'>;
