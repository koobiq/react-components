'use client';

import type { Time } from '@internationalized/date';
import type { DateValue } from '@koobiq/react-primitives';

import { DatePicker } from '../../DatePicker';
import { TimePicker } from '../../TimePicker';
import s from '../TimeRange.module.css';
import type { TimeRangeInstant } from '../types';

export type TimeRangeDateTimeFieldProps<T extends DateValue> = {
  label: string;
  /** Fully localized accessible name for the time field. */
  timeLabel: string;
  /** Fully localized accessible name for the date field. */
  dateLabel: string;
  instant: TimeRangeInstant<T>;
  onChange: (instant: TimeRangeInstant<T>) => void;
  minValue?: T;
  maxValue?: T;
  isInvalid?: boolean;
  isDisabled?: boolean;
};

/** One "from"/"to" row of the manual range editor: an independent time field + date field. */
export function TimeRangeDateTimeField<T extends DateValue>({
  label,
  timeLabel,
  dateLabel,
  instant,
  onChange,
  minValue,
  maxValue,
  isInvalid,
  isDisabled,
}: TimeRangeDateTimeFieldProps<T>) {
  return (
    <div className={s.dateTimeRow}>
      <span className={s.dateTimeRowLabel}>{label}</span>
      <div className={s.dateTimeRowFields}>
        <TimePicker
          aria-label={timeLabel}
          value={instant.time}
          onChange={(time: Time | null) => onChange({ ...instant, time })}
          isInvalid={isInvalid}
          isDisabled={isDisabled}
        />
        <DatePicker
          aria-label={dateLabel}
          value={instant.date}
          onChange={(date) => onChange({ ...instant, date: date as T | null })}
          minValue={minValue}
          maxValue={maxValue}
          isInvalid={isInvalid}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
}
