'use client';

import { forwardRef, useEffect, useReducer, useRef, useState } from 'react';
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

/**
 * The manual `'range'` option is rendered (and thus must be treated as
 * available for correction) whenever `hideRangeAsDefault` is `false`, even if
 * it isn't explicitly listed in `availableTimeRangeTypes` — mirrors
 * `TimeRangeEditor`'s own rendering rule so the two never disagree about
 * whether `'range'` is a valid, selectable type.
 */
function resolveAvailableTimeRangeTypes(
  availableTimeRangeTypes: string[],
  hideRangeAsDefault: boolean
): string[] {
  const showRange =
    !hideRangeAsDefault || availableTimeRangeTypes.includes('range');

  return showRange && !availableTimeRangeTypes.includes('range')
    ? [...availableTimeRangeTypes, 'range']
    : availableTimeRangeTypes;
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
    label,
    isLabelHidden = false,
    isRequired = false,
    isInvalid = false,
    errorMessage,
    caption,
    fullWidth,
    labelPlacement,
    labelAlign,
    className,
    style,
    'data-testid': testId,
    slotProps,
    ...other
  } = props;

  const groupRef = useRef<HTMLDivElement>(null);

  const t = useLocalizedStringFormatter(intlMessages);
  const rangeFormatter = useDateFormatter({ month: 'long', day: 'numeric' });

  const resolvedAvailableTypes = resolveAvailableTimeRangeTypes(
    availableTimeRangeTypes,
    hideRangeAsDefault
  );

  const [committed, setCommitted] = useControlledState<TimeRangeValue | null>(
    valueProp,
    'defaultValue' in props
      ? (defaultValue as TimeRangeValue | null)
      : getInitialValue(
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

  const availableTypesKey = resolvedAvailableTypes.join(',');

  const customTypesKey = customTimeRangeTypes
    .map((entry) => entry.type)
    .join(',');

  // Only an uncontrolled value is self-corrected: a controlled `value` is
  // owned by the consumer, so it's rendered as given rather than silently
  // rewritten via `setCommitted`.
  useEffect(() => {
    if (valueProp !== undefined) return;

    const { value: corrected, corrected: wasCorrected } =
      checkAndCorrectTimeRangeValue(
        committed,
        resolvedAvailableTypes,
        customTimeRangeTypes,
        minValue,
        maxValue
      );

    if (wasCorrected && corrected) setCommitted(corrected);
    // Only re-check when the committed value or preset configuration changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    valueProp,
    committed,
    availableTypesKey,
    customTypesKey,
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
      // A custom trigger has no `ControlGroup` to anchor to — fall back to
      // the popover's own trigger-element ref in that case.
      ...(children ? {} : { anchorRef: groupRef }),
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
            formField: {
              label,
              isLabelHidden,
              isRequired,
              isInvalid,
              errorMessage,
              caption,
              fullWidth,
              labelPlacement,
              labelAlign,
              groupRef,
              slotProps: {
                root: slotProps?.root,
                label: slotProps?.label,
                group: slotProps?.group,
                caption: slotProps?.caption,
                errorMessage: slotProps?.errorMessage,
              },
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
              availableTimeRangeTypes={resolvedAvailableTypes}
              customTimeRangeTypes={customTimeRangeTypes}
              minValue={minValue}
              maxValue={maxValue}
              isDisabled={isReadOnly}
              renderOption={renderOption}
              radioGroupProps={slotProps?.radioGroup}
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
