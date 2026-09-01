'use client';

import type { ReactNode } from 'react';

import {
  useFocusWithin,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import type { DateValue } from '@koobiq/react-primitives';

import { Radio, RadioGroup } from '../../RadioGroup';
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
  hideRangeAsDefault: boolean;
  minValue?: T;
  maxValue?: T;
  isDisabled?: boolean;
  renderOption?: (context: TimeRangeOptionContext) => ReactNode;
};

/**
 * The popover body: a `RadioGroup` of presets, plus a manual from/to editor
 * grouped with the `'range'` option itself (unless `hideRangeAsDefault` and
 * no `'range'` preset is registered). The manual date/time fields are only
 * interactive while `'range'` is the selected preset.
 */
export function TimeRangeEditor<T extends DateValue>({
  draft,
  onSelectPreset,
  onChangeStart,
  onChangeEnd,
  onSwapRange,
  availableTimeRangeTypes,
  customTimeRangeTypes,
  hideRangeAsDefault,
  minValue,
  maxValue,
  isDisabled,
  renderOption,
}: TimeRangeEditorProps<T>) {
  const t = useLocalizedStringFormatter(intlMessages);

  const presets = availableTimeRangeTypes.filter((type) => type !== 'range');
  const hasPresets = presets.length > 0;

  const showRangeSection =
    !hideRangeAsDefault || availableTimeRangeTypes.includes('range');

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
        <div className={s.manualRange} {...focusWithinProps}>
          {hasPresets && <Radio value="range">{t.format('range')}</Radio>}
          <TimeRangeDateTimeField
            label={t.format('from')}
            instant={draft.start}
            onChange={onChangeStart}
            minValue={minValue}
            maxValue={maxValue}
            isInvalid={isInvalid}
            isDisabled={areFieldsDisabled}
          />
          <TimeRangeDateTimeField
            label={t.format('to')}
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
      isLabelHidden
      label={t.format('presets')}
      value={draft.type}
      onChange={onSelectPreset}
      isDisabled={isDisabled}
      className={s.editor}
    >
      {content}
    </RadioGroup>
  );
}
