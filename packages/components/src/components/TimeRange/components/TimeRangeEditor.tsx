'use client';

import type { ReactNode } from 'react';

import {
  mergeProps,
  useFocusWithin,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import type { DateValue } from '@koobiq/react-primitives';

import { Radio, RadioGroup } from '../../RadioGroup';
import type { RadioGroupProps } from '../../RadioGroup';
import intlMessages from '../intl';
import s from '../TimeRange.module.css';
import type {
  CustomTimeRangeType,
  TimeRangeInstant,
  TimeRangeOptionContext,
} from '../types';
import { isRangeReversed, isRangeValid } from '../utils';

import { TimeRangeDateTimeField } from './TimeRangeDateTimeField';
import { TimeRangePresetList } from './TimeRangePresetList';

export type TimeRangeDraft<T extends DateValue = DateValue> = {
  type: string;
  start: TimeRangeInstant<T>;
  end: TimeRangeInstant<T>;
};

export type TimeRangeEditorProps<T extends DateValue> = {
  draft: TimeRangeDraft<T>;
  onSelectPreset: (type: string) => void;
  onChangeStart: (instant: TimeRangeInstant<T>) => void;
  onChangeEnd: (instant: TimeRangeInstant<T>) => void;
  onSwapRange: () => void;
  availableTimeRangeTypes: string[];
  customTimeRangeTypes: CustomTimeRangeType[];
  minValue?: T;
  maxValue?: T;
  isDisabled?: boolean;
  renderOption?: (context: TimeRangeOptionContext) => ReactNode;
  radioGroupProps?: RadioGroupProps;
};

/**
 * The popover body: a `RadioGroup` of presets, plus a manual from/to editor
 * grouped with the `'range'` option itself (rendered whenever `'range'` is
 * present in `availableTimeRangeTypes`, which `TimeRange` resolves according
 * to `hideRangeAsDefault`). The manual date/time fields are only interactive
 * while `'range'` is the selected preset.
 */
export function TimeRangeEditor<T extends DateValue>({
  draft,
  onSelectPreset,
  onChangeStart,
  onChangeEnd,
  onSwapRange,
  availableTimeRangeTypes,
  customTimeRangeTypes,
  minValue,
  maxValue,
  isDisabled,
  renderOption,
  radioGroupProps,
}: TimeRangeEditorProps<T>) {
  const t = useLocalizedStringFormatter(intlMessages);

  const presets = availableTimeRangeTypes.filter((type) => type !== 'range');
  const hasPresets = presets.length > 0;

  const showRangeSection = availableTimeRangeTypes.includes('range');

  const isRangeSelected = draft.type === 'range';
  const isInvalid = isRangeSelected && !isRangeValid(draft.start, draft.end);
  const areFieldsDisabled = isDisabled || !isRangeSelected;

  // Once the user finishes editing (focus leaves the from/to fields), a
  // reversed range is silently swapped back into order instead of showing a
  // validation error.
  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: () => {
      if (isRangeSelected && isRangeReversed(draft.start, draft.end)) {
        onSwapRange();
      }
    },
  });

  const content = (
    <>
      {hasPresets && (
        <TimeRangePresetList
          types={presets}
          customTimeRangeTypes={customTimeRangeTypes}
          renderOption={renderOption}
          t={t}
        />
      )}
      {showRangeSection && (
        <div
          className={s.manualRange}
          data-no-presets={!hasPresets || undefined}
          {...focusWithinProps}
        >
          {hasPresets && <Radio value="range">{t.format('range')}</Radio>}
          <TimeRangeDateTimeField
            label={t.format('from')}
            timeLabel={t.format('fromTimeLabel')}
            dateLabel={t.format('fromDateLabel')}
            instant={draft.start}
            onChange={onChangeStart}
            minValue={minValue}
            maxValue={maxValue}
            isInvalid={isInvalid}
            isDisabled={areFieldsDisabled}
          />
          <TimeRangeDateTimeField
            label={t.format('to')}
            timeLabel={t.format('toTimeLabel')}
            dateLabel={t.format('toDateLabel')}
            instant={draft.end}
            onChange={onChangeEnd}
            minValue={minValue}
            maxValue={maxValue}
            isInvalid={isInvalid}
            isDisabled={areFieldsDisabled}
          />
        </div>
      )}
    </>
  );

  if (!hasPresets) {
    return <div className={s.editor}>{content}</div>;
  }

  return (
    <RadioGroup
      {...mergeProps<(RadioGroupProps | undefined)[]>(
        {
          isLabelHidden: true,
          label: t.format('presets'),
          value: draft.type,
          onChange: onSelectPreset,
          isDisabled,
          className: s.editor,
        },
        radioGroupProps
      )}
    >
      {content}
    </RadioGroup>
  );
}
