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

  // Using any FormField-only prop switches the default trigger from a plain
  // link to a `FormField` control — FormField is an enhancement you opt into
  // by using it, not a separate flag to keep in sync with these props.
  const isFormFieldTrigger = Boolean(
    label !== undefined ||
    errorMessage !== undefined ||
    caption !== undefined ||
    isLabelHidden ||
    isRequired ||
    isInvalid ||
    fullWidth ||
    labelPlacement !== undefined ||
    labelAlign !== undefined ||
    slotProps?.root ||
    slotProps?.label ||
    slotProps?.group ||
    slotProps?.caption ||
    slotProps?.errorMessage
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

  const availableTypesKey = resolvedAvailableTypes.join(',');

  const customTypesKey = customTimeRangeTypes
    .map((entry) => entry.type)
    .join(',');

  const correction = checkAndCorrectTimeRangeValue(
    committed,
    resolvedAvailableTypes,
    customTimeRangeTypes,
    minValue,
    maxValue
  );

  // What's actually rendered: a correction is reflected right away, even for
  // a controlled `value` that the consumer hasn't updated yet, so the
  // trigger/editor never show a preset that isn't selectable. `committed`
  // itself only changes for an uncontrolled value (see the effect below) —
  // for a controlled one it always mirrors `value` as given.
  const displayValue = correction.corrected ? correction.value : committed;

  const [isOpen, setIsOpen] = useState(false);

  const [draft, dispatch] = useReducer(
    draftReducer<T>,
    displayValue,
    (initial) => toDraft(initial, defaultRangeValue, minValue, maxValue)
  );

  // Dedupes repeated `onValueCorrected` calls for the same incoming value —
  // keyed by what was corrected (not the corrected outcome), so two
  // different invalid values that happen to fall back to the same preset are
  // both still reported.
  const lastCorrectedInputRef = useRef<string | null>(null);

  useEffect(() => {
    if (!correction.corrected) return;

    const inputSignature = [
      committed?.type,
      committed?.start?.toString(),
      committed?.end?.toString(),
      availableTypesKey,
      customTypesKey,
      minValue?.toString(),
      maxValue?.toString(),
    ].join('|');

    if (lastCorrectedInputRef.current === inputSignature) return;

    lastCorrectedInputRef.current = inputSignature;

    // `onValueCorrected` only reports an actual fallback value — there's
    // nothing to hand the consumer when no preset is available at all.
    if (correction.value) onValueCorrected?.(correction.value);

    // Only an uncontrolled value is corrected in place — a controlled
    // `value` is owned by the consumer, so `onValueCorrected` above is how
    // it's told to update its own state to match instead.
    if (valueProp === undefined) setCommitted(correction.value);
    // Only re-check when the committed value or preset configuration changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    committed,
    availableTypesKey,
    customTypesKey,
    minValue,
    maxValue,
    valueProp,
  ]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (open) {
      dispatch({
        type: 'RESET',
        draft: toDraft(displayValue, defaultRangeValue, minValue, maxValue),
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

  const isEmpty = !displayValue;

  const formattedValue = displayValue
    ? formatTimeRangeDuration(
        displayValue.type,
        getTimeRangeTypeConfig(displayValue.type, customTimeRangeTypes),
        t,
        { start: displayValue.start, end: displayValue.end },
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
      hideCloseButton: true,
      hideArrow,
      className,
      style,
      // A custom trigger, or the plain link trigger, has no `ControlGroup`
      // to anchor to — fall back to the popover's own trigger-element ref in
      // that case.
      ...(children || !isFormFieldTrigger ? {} : { anchorRef: groupRef }),
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
            isFormFieldTrigger,
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
