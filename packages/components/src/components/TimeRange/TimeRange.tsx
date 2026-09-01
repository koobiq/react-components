'use client';

import { forwardRef, useEffect, useReducer, useState } from 'react';
import type { Ref } from 'react';

import type { CalendarDateTime, ZonedDateTime } from '@internationalized/date';
import {
  mergeProps,
  mergeRefs,
  useControlledState,
  useDateFormatter,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import type { DateValue } from '@koobiq/react-primitives';

import { Button } from '../Button';
import { Popover } from '../Popover';
import type { PopoverProps } from '../Popover';

import { TimeRangeEditor } from './components/TimeRangeEditor';
import type { TimeRangeDraft } from './components/TimeRangeEditor';
import { TimeRangeTrigger } from './components/TimeRangeTrigger';
import { TimeRangeTriggerContext } from './components/TimeRangeTriggerContext';
import intlMessages from './intl';
import type {
  TimeRangeComponent,
  TimeRangeInstant,
  TimeRangeProps,
  TimeRangeRef,
  TimeRangeValue,
} from './types';
import { defaultTimeRangeTypes } from './types';
import {
  calculateTimeRange,
  checkAndCorrectTimeRangeValue,
  formatTimeRangeDuration,
  getDefaultRangeValue,
  getTimeRangeTypeConfig,
  isRangeValid,
  splitDateTime,
} from './utils';

type DraftAction<T extends DateValue> =
  | { type: 'SELECT_PRESET'; preset: string }
  | { type: 'SET_START'; instant: TimeRangeInstant<T> }
  | { type: 'SET_END'; instant: TimeRangeInstant<T> }
  | { type: 'SWAP_RANGE' }
  | { type: 'RESET'; draft: TimeRangeDraft<T> };

function draftReducer<T extends DateValue>(
  state: TimeRangeDraft<T>,
  action: DraftAction<T>
): TimeRangeDraft<T> {
  switch (action.type) {
    case 'SELECT_PRESET':
      return { ...state, type: action.preset };
    case 'SET_START':
      return { ...state, type: 'range', start: action.instant };
    case 'SET_END':
      return { ...state, type: 'range', end: action.instant };
    case 'SWAP_RANGE':
      return { ...state, start: state.end, end: state.start };
    case 'RESET':
      return action.draft;
    default:
      return state;
  }
}

function toDraft<T extends DateValue>(
  value: TimeRangeValue | null | undefined,
  defaultRangeValue:
    { start?: TimeRangeInstant<T>; end?: TimeRangeInstant<T> } | undefined,
  minValue?: T,
  maxValue?: T
): TimeRangeDraft<T> {
  if (value?.type === 'range' && value.start && value.end) {
    return {
      type: 'range',
      start: splitDateTime(
        value.start as CalendarDateTime | ZonedDateTime
      ) as TimeRangeInstant<T>,
      end: splitDateTime(
        value.end as CalendarDateTime | ZonedDateTime
      ) as TimeRangeInstant<T>,
    };
  }

  const fallback = getDefaultRangeValue(minValue, maxValue);

  return {
    type: value?.type ?? 'range',
    start: defaultRangeValue?.start ?? fallback.start,
    end: defaultRangeValue?.end ?? fallback.end,
  };
}

/** The initial committed value when neither `value` nor `defaultValue` is given. */
function getInitialValue<T extends DateValue>(
  availableTimeRangeTypes: string[],
  customTimeRangeTypes: TimeRangeProps<T>['customTimeRangeTypes'],
  defaultRangeValue:
    { start?: TimeRangeInstant<T>; end?: TimeRangeInstant<T> } | undefined,
  minValue?: T,
  maxValue?: T
): TimeRangeValue {
  const type = availableTimeRangeTypes[0] ?? 'range';

  if (type === 'range') {
    const { start, end } =
      defaultRangeValue ?? getDefaultRangeValue(minValue, maxValue);

    return {
      type,
      ...calculateTimeRange(type, customTimeRangeTypes, { start, end }),
    };
  }

  return { type, ...calculateTimeRange(type, customTimeRangeTypes) };
}

export function TimeRangeRender<T extends DateValue>(
  props: Omit<TimeRangeProps<T>, 'ref'>,
  ref: Ref<TimeRangeRef>
) {
  const {
    value: valueProp,
    defaultValue,
    defaultRangeValue,
    onChange,
    onValueCorrected,
    minValue,
    maxValue,
    availableTimeRangeTypes = defaultTimeRangeTypes,
    customTimeRangeTypes = [],
    hideArrow = true,
    hideRangeAsDefault = false,
    placeholder,
    children,
    renderOption,
    isDisabled = false,
    isReadOnly = false,
    className,
    style,
    'data-testid': testId,
    slotProps,
    ...other
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);
  const rangeFormatter = useDateFormatter({ month: 'long', day: 'numeric' });

  const [committed, setCommitted] = useControlledState<TimeRangeValue | null>(
    valueProp,
    defaultValue ??
      getInitialValue(
        availableTimeRangeTypes,
        customTimeRangeTypes,
        defaultRangeValue,
        minValue,
        maxValue
      ),
    onChange
  );

  const [isOpen, setIsOpen] = useState(false);

  const [draft, dispatch] = useReducer(draftReducer<T>, committed, (initial) =>
    toDraft(initial, defaultRangeValue, minValue, maxValue)
  );

  useEffect(() => {
    const { value: corrected, corrected: wasCorrected } =
      checkAndCorrectTimeRangeValue(
        valueProp !== undefined ? valueProp : committed,
        availableTimeRangeTypes,
        customTimeRangeTypes,
        minValue,
        maxValue
      );

    if (!wasCorrected || !corrected) return;

    onValueCorrected?.(corrected);

    // A controlled `value` is corrected by the consumer, via `onValueCorrected`.
    if (valueProp === undefined) setCommitted(corrected);
    // Only re-check when the incoming/committed value or preset configuration changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    valueProp,
    committed,
    availableTimeRangeTypes,
    customTimeRangeTypes,
    minValue,
    maxValue,
  ]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (open) {
      dispatch({
        type: 'RESET',
        draft: toDraft(committed, defaultRangeValue, minValue, maxValue),
      });
    }
  };

  const handleApply = () => {
    const resolved = calculateTimeRange(draft.type, customTimeRangeTypes, {
      start: draft.start,
      end: draft.end,
    });

    setCommitted({ type: draft.type, ...resolved });
  };

  const isEmpty = !committed;

  const formattedValue = committed
    ? formatTimeRangeDuration(
        committed.type,
        getTimeRangeTypeConfig(committed.type, customTimeRangeTypes),
        t,
        { start: committed.start, end: committed.end },
        rangeFormatter
      )
    : '';

  const isDraftInvalid =
    draft.type === 'range' && !isRangeValid(draft.start, draft.end);

  const popoverProps = mergeProps<(PopoverProps | undefined)[]>(
    {
      ...(other as PopoverProps),
      isOpen,
      onOpenChange: handleOpenChange,
      placement: 'bottom start',
      offset: 4,
      size: 'auto',
      hideArrow,
      className,
      style,
    },
    slotProps?.popover
  );

  return (
    <Popover
      {...popoverProps}
      control={(triggerProps) => (
        <TimeRangeTriggerContext.Provider
          value={{
            formattedValue,
            isOpen,
            isEmpty,
            isDisabled: isDisabled || isReadOnly,
            placeholder,
            buttonProps: {
              ...triggerProps,
              ref: mergeRefs(ref, triggerProps.ref),
            },
          }}
        >
          {children ?? (
            <TimeRangeTrigger
              data-testid={testId as string | number | undefined}
            />
          )}
        </TimeRangeTriggerContext.Provider>
      )}
    >
      {({ close }) => (
        <>
          <Popover.Body>
            <TimeRangeEditor
              draft={draft}
              onSelectPreset={(preset) =>
                dispatch({ type: 'SELECT_PRESET', preset })
              }
              onChangeStart={(instant) =>
                dispatch({ type: 'SET_START', instant })
              }
              onChangeEnd={(instant) => dispatch({ type: 'SET_END', instant })}
              onSwapRange={() => dispatch({ type: 'SWAP_RANGE' })}
              availableTimeRangeTypes={availableTimeRangeTypes}
              customTimeRangeTypes={customTimeRangeTypes}
              hideRangeAsDefault={hideRangeAsDefault}
              minValue={minValue}
              maxValue={maxValue}
              isDisabled={isReadOnly}
              renderOption={renderOption}
            />
          </Popover.Body>
          <Popover.Footer>
            <Button
              isDisabled={isDraftInvalid}
              onPress={() => {
                handleApply();
                close();
              }}
            >
              {t.format('apply')}
            </Button>
            <Button variant="fade-contrast-filled" onPress={close}>
              {t.format('cancel')}
            </Button>
          </Popover.Footer>
        </>
      )}
    </Popover>
  );
}

const TimeRangeComponentImpl = forwardRef(
  TimeRangeRender
) as TimeRangeComponent;

type CompoundedComponent = TimeRangeComponent & {
  Trigger: typeof TimeRangeTrigger;
};

/**
 * A time range picker: a popover trigger with relative-time presets
 * ("last 7 days", "current quarter", …) and a manual from/to editor.
 */
export const TimeRange = TimeRangeComponentImpl as CompoundedComponent;

TimeRange.Trigger = TimeRangeTrigger;
