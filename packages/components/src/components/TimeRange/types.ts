import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';

import type { DateTimeDuration, Time } from '@internationalized/date';
import type { DataAttributeProps } from '@koobiq/react-core';
import type { ButtonOptions, DateValue } from '@koobiq/react-primitives';

import type { PopoverProps } from '../Popover';
import type { RadioGroupProps } from '../RadioGroup';

export const timeRangeType = [
  'lastMinute',
  'last5Minutes',
  'last15Minutes',
  'last30Minutes',
  'lastHour',
  'last24Hours',
  'last3Days',
  'last7Days',
  'last14Days',
  'last30Days',
  'last3Months',
  'last12Months',
  'allTime',
  'currentQuarter',
  'currentYear',
  'range',
] as const;

/** A built-in time range preset. */
export type TimeRangeType = (typeof timeRangeType)[number];

/** The 9 presets shown by default, matching the most commonly used ranges. */
export const defaultTimeRangeTypes: TimeRangeType[] = [
  'lastHour',
  'last24Hours',
  'last3Days',
  'last7Days',
  'last14Days',
  'currentQuarter',
  'currentYear',
  'allTime',
  'range',
];

/** The calendar-arithmetic unit a preset's duration is expressed in. */
export type TimeRangeTranslationType =
  'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years' | 'other';

/** One side (start or end) of the manual range editor: an independent date + time pair. */
export type TimeRangeInstant<T extends DateValue = DateValue> = {
  date: T | null;
  time: Time | null;
};

/**
 * The resolved value of a `TimeRange`: the preset's type plus its computed
 * absolute bounds. `start`/`end` are always concrete `DateValue`s, independent
 * of the `DateValue` subtype used by the manual editor's fields.
 */
export type TimeRangeValue = {
  type: TimeRangeType | (string & {});
  start?: DateValue;
  end?: DateValue;
};

/** A preset type not in the built-in list, registered via `customTimeRangeTypes`. */
export type CustomTimeRangeType = {
  /** Unique identifier for the preset; shown as the `RadioGroup` value. */
  type: string;
  /** The duration to subtract from "now" to compute the preset's `start`. */
  units: DateTimeDuration;
  /** Which unit of `units` to use when formatting the preset's label. */
  translationType: TimeRangeTranslationType;
  /** A fixed range instead of a "now minus units" computation, e.g. a fiscal quarter. */
  range?: { start?: TimeRangeInstant; end?: TimeRangeInstant };
};

export type TimeRangeOptionContext = {
  type: string;
  translationType: TimeRangeTranslationType;
  formattedValue: string;
  units: DateTimeDuration;
};

/**
 * The live state handed to `TimeRange.Trigger`'s render function.
 * `buttonProps` must be spread onto whatever pressable element is rendered,
 * so it receives the popover's press/keyboard/ref wiring.
 */
export type TimeRangeTriggerRenderProps = {
  formattedValue: string;
  isOpen: boolean;
  isEmpty: boolean;
  placeholder?: string;
  buttonProps: ButtonOptions & { ref: Ref<HTMLButtonElement> };
};

export type TimeRangeTriggerProps = {
  /**
   * Renders a custom trigger. Omit it to get the default pseudo-link
   * trigger.
   */
  children?: (context: TimeRangeTriggerRenderProps) => ReactElement;
} & DataAttributeProps;

export type TimeRangeProps<T extends DateValue = DateValue> = {
  /** The selected time range. */
  value?: TimeRangeValue | null;
  /** The default selected time range. Use when the component is not controlled. */
  defaultValue?: TimeRangeValue | null;
  /** Seeds the manual range editor's from/to fields when no value has been set yet. */
  defaultRangeValue?: {
    start?: TimeRangeInstant<T>;
    end?: TimeRangeInstant<T>;
  };
  /** Handler that is called when the value changes, i.e. Apply is pressed. */
  onChange?: (value: TimeRangeValue | null) => void;
  /** Handler that is called when an out-of-range initial/incoming value gets corrected. */
  onValueCorrected?: (value: TimeRangeValue) => void;
  /** The minimum allowed date for the manual range editor. */
  minValue?: T;
  /** The maximum allowed date for the manual range editor. */
  maxValue?: T;
  /**
   * The presets shown in the editor.
   * @default defaultTimeRangeTypes
   */
  availableTimeRangeTypes?: (TimeRangeType | string)[];
  /** Additional presets beyond the built-in `TimeRangeType`s. */
  customTimeRangeTypes?: CustomTimeRangeType[];
  /**
   * If `true`, the popover's arrow isn't shown.
   * @default true
   */
  hideArrow?: boolean;
  /**
   * If `true`, the manual range editor isn't preselected when there are no presets to show.
   * @default false
   */
  hideRangeAsDefault?: boolean;
  /** Placeholder shown by the trigger when the value is empty. */
  placeholder?: string;
  /**
   * A custom trigger, composed from a `TimeRange.Trigger`. Omit it to render
   * the default pseudo-link trigger.
   */
  children?: ReactNode;
  /** Renders a custom label for a preset option in the editor. */
  renderOption?: (context: TimeRangeOptionContext) => ReactNode;
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the component is read-only.
   * @default false
   */
  isReadOnly?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Ref to the trigger element. */
  ref?: Ref<HTMLButtonElement>;
  /** The props used for each slot inside. */
  slotProps?: {
    popover?: PopoverProps;
    radioGroup?: RadioGroupProps;
  };
} & DataAttributeProps;

export type TimeRangeComponent = <T extends DateValue = DateValue>(
  props: TimeRangeProps<T>
) => ReactElement | null;

export type TimeRangeRef = HTMLButtonElement;
