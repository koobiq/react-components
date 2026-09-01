import {
  type CalendarDateTime,
  type DateFormatter,
  type DateValue,
  type DateTimeDuration,
  type Time,
  type ZonedDateTime,
  endOfMonth,
  endOfYear,
  getLocalTimeZone,
  now,
  startOfMonth,
  startOfYear,
  toCalendarDate,
  toCalendarDateTime,
  toTime,
} from '@internationalized/date';
import type { LocalizedStringFormatter } from '@koobiq/react-core';

import type {
  CustomTimeRangeType,
  TimeRangeInstant,
  TimeRangeTranslationType,
  TimeRangeType,
  TimeRangeValue,
} from './types';

/** The duration and label unit looked up for a built-in preset via `getTimeRangeTypeConfig`. */
export type TimeRangeConfigEntry = {
  units: DateTimeDuration;
  translationType: TimeRangeTranslationType;
};

/** The duration and label unit for every built-in preset. */
export const timeRangeConfig: Record<TimeRangeType, TimeRangeConfigEntry> = {
  lastMinute: { units: { minutes: 1 }, translationType: 'minutes' },
  last5Minutes: { units: { minutes: 5 }, translationType: 'minutes' },
  last15Minutes: { units: { minutes: 15 }, translationType: 'minutes' },
  last30Minutes: { units: { minutes: 30 }, translationType: 'minutes' },
  lastHour: { units: { hours: 1 }, translationType: 'hours' },
  last24Hours: { units: { hours: 24 }, translationType: 'hours' },
  last3Days: { units: { days: 3 }, translationType: 'days' },
  last7Days: { units: { days: 7 }, translationType: 'days' },
  last14Days: { units: { days: 14 }, translationType: 'days' },
  last30Days: { units: { days: 30 }, translationType: 'days' },
  last3Months: { units: { months: 3 }, translationType: 'months' },
  last12Months: { units: { months: 12 }, translationType: 'months' },
  allTime: { units: {}, translationType: 'other' },
  currentQuarter: { units: {}, translationType: 'other' },
  currentYear: { units: {}, translationType: 'other' },
  range: { units: {}, translationType: 'other' },
};

/**
 * Looks up a preset's config, checking the built-in table first and falling
 * back to `customTimeRangeTypes` for user-registered presets.
 */
export function getTimeRangeTypeConfig(
  type: string,
  customTimeRangeTypes: CustomTimeRangeType[] = []
): TimeRangeConfigEntry | CustomTimeRangeType | undefined {
  return (
    (timeRangeConfig as Record<string, TimeRangeConfigEntry>)[type] ??
    customTimeRangeTypes.find((custom) => custom.type === type)
  );
}

/**
 * Combines a calendar date and a time-of-day into a single date-time value,
 * usable wherever the manual range editor's from/to fields need to be
 * compared or turned into a `TimeRangeValue`'s `start`/`end`.
 */
export function combineDateTime<T extends DateValue>(date: T, time: Time) {
  return toCalendarDateTime(date, time);
}

/**
 * Splits a combined date-time value back into the date/time pair the manual
 * range editor's `DatePicker`/`TimePicker` fields expect.
 */
export function splitDateTime(
  value: CalendarDateTime | ZonedDateTime
): TimeRangeInstant {
  return { date: toCalendarDate(value), time: toTime(value) };
}

function resolveInstantDate(instant?: TimeRangeInstant): DateValue | undefined {
  if (!instant?.date) return undefined;

  return instant.time
    ? combineDateTime(instant.date, instant.time)
    : instant.date;
}

/**
 * Resolves a preset's absolute `start`/`end` bounds. Duration-based presets
 * are computed relative to "now"; `currentQuarter`/`currentYear` are computed
 * relative to today; `allTime` is an open range; `range` (and any custom
 * preset with a fixed `range`) simply passes its bounds through.
 */
export function calculateTimeRange(
  type: string,
  customTimeRangeTypes: CustomTimeRangeType[] = [],
  manualRange: { start?: TimeRangeInstant; end?: TimeRangeInstant } = {}
): { start?: DateValue; end?: DateValue } {
  const custom = customTimeRangeTypes.find((entry) => entry.type === type);

  if (custom?.range) {
    return {
      start: resolveInstantDate(custom.range.start),
      end: resolveInstantDate(custom.range.end),
    };
  }

  if (type === 'range') {
    return {
      start: resolveInstantDate(manualRange.start),
      end: resolveInstantDate(manualRange.end),
    };
  }

  if (type === 'allTime') return {};

  const nowZoned = now(getLocalTimeZone());

  if (type === 'currentQuarter') {
    const quarterStartMonth = Math.floor((nowZoned.month - 1) / 3) * 3 + 1;
    const start = startOfMonth(nowZoned.set({ month: quarterStartMonth }));

    return { start, end: endOfMonth(start.add({ months: 2 })) };
  }

  if (type === 'currentYear') {
    return { start: startOfYear(nowZoned), end: endOfYear(nowZoned) };
  }

  const entry = getTimeRangeTypeConfig(type, customTimeRangeTypes);

  if (!entry || entry.translationType === 'other') return {};

  return { start: nowZoned.subtract(entry.units), end: nowZoned };
}

/** Whether a manual range's `start` is not later than its `end`. */
export function isRangeValid(
  start?: TimeRangeInstant,
  end?: TimeRangeInstant
): boolean {
  const startDate = resolveInstantDate(start);
  const endDate = resolveInstantDate(end);

  if (!startDate || !endDate) return false;

  return startDate.compare(endDate) <= 0;
}

/**
 * Whether a manual range's `start` and `end` are both set and `start` comes
 * after `end` — distinct from `!isRangeValid`, which is also `true` for an
 * incomplete range. Used to swap the two once the user finishes editing,
 * instead of surfacing a validation error.
 */
export function isRangeReversed(
  start?: TimeRangeInstant,
  end?: TimeRangeInstant
): boolean {
  const startDate = resolveInstantDate(start);
  const endDate = resolveInstantDate(end);

  if (!startDate || !endDate) return false;

  return startDate.compare(endDate) > 0;
}

/** "Yesterday → today", used to seed the manual range editor when nothing else is available. */
export function getDefaultRangeValue<T extends DateValue>(
  minValue?: T,
  maxValue?: T
): { start: TimeRangeInstant<T>; end: TimeRangeInstant<T> } {
  const nowZoned = now(getLocalTimeZone());
  const time = toTime(nowZoned);
  // Cast is safe: callers only ever pass a `T` compatible with the plain
  // `CalendarDate` produced here (`minValue`/`maxValue` share the same `T`).
  const today = toCalendarDate(nowZoned) as unknown as T;

  const yesterday = toCalendarDate(
    nowZoned.subtract({ days: 1 })
  ) as unknown as T;

  const start =
    minValue && yesterday.compare(minValue) < 0 ? minValue : yesterday;

  let end = maxValue && today.compare(maxValue) > 0 ? maxValue : today;

  // `minValue`/`maxValue` can exclude the default "yesterday → today" range
  // entirely (e.g. `minValue` is in the future) — collapse to a single valid
  // day instead of returning a `start` after `end`.
  if (start.compare(end) > 0) end = start;

  return {
    start: { date: start, time },
    end: { date: end, time },
  };
}

/**
 * Formats a preset's label: for `range`, the actual `start`–`end` span (e.g.
 * "August 31 – September 1") when both `range` and `formatter` are given,
 * falling back to a literal "Custom range" string otherwise (e.g. for the
 * `range` option itself in the presets list, which has no concrete bounds
 * yet); a literal string for `allTime`/`currentQuarter`/`currentYear`; an
 * ICU-pluralized "last N units" for duration-based presets (built-in or
 * custom); or a title-cased fallback of `type` for a custom
 * `translationType: 'other'` preset with no literal translation.
 */
export function formatTimeRangeDuration(
  type: string,
  entry: TimeRangeConfigEntry | CustomTimeRangeType | undefined,
  t: LocalizedStringFormatter<string>,
  range?: { start?: DateValue; end?: DateValue },
  formatter?: DateFormatter
): string {
  if (type === 'range') {
    if (range?.start && range.end && formatter) {
      const zone = getLocalTimeZone();

      return formatter.formatRange(
        range.start.toDate(zone),
        range.end.toDate(zone)
      );
    }

    return t.format('range');
  }

  if (
    type === 'allTime' ||
    type === 'currentQuarter' ||
    type === 'currentYear'
  ) {
    return t.format(type);
  }

  if (!entry || entry.translationType === 'other') {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  const count = entry.units[entry.translationType] ?? 0;

  return t.format('duration', {
    count: Math.abs(count),
    unit: entry.translationType,
  });
}

/**
 * Sanitizes an incoming value against the currently available preset types:
 * falls back to the first available preset (or `getDefaultRangeValue`) when
 * the value's type isn't registered.
 */
export function checkAndCorrectTimeRangeValue<T extends DateValue>(
  value: TimeRangeValue | null | undefined,
  availableTimeRangeTypes: string[],
  customTimeRangeTypes: CustomTimeRangeType[] = [],
  minValue?: T,
  maxValue?: T
): { value: TimeRangeValue | null; corrected: boolean } {
  if (!value) return { value: value ?? null, corrected: false };

  const isAvailable =
    availableTimeRangeTypes.includes(value.type) ||
    customTimeRangeTypes.some((custom) => custom.type === value.type);

  if (isAvailable) return { value, corrected: false };

  const fallbackType = availableTimeRangeTypes[0];

  if (!fallbackType) return { value: null, corrected: true };

  if (fallbackType === 'range') {
    const { start, end } = getDefaultRangeValue(minValue, maxValue);

    return {
      value: {
        type: 'range',
        start: resolveInstantDate(start),
        end: resolveInstantDate(end),
      },
      corrected: true,
    };
  }

  return {
    value: {
      type: fallbackType,
      ...calculateTimeRange(fallbackType, customTimeRangeTypes),
    },
    corrected: true,
  };
}
