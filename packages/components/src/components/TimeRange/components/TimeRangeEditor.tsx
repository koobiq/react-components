'use client';

import type { ReactNode } from 'react';

import { useLocalizedStringFormatter } from '@koobiq/react-core';
import type { DateValue } from '@koobiq/react-primitives';

import intlMessages from '../intl';
import s from '../TimeRange.module.css';
import type {
  CustomTimeRangeType,
  TimeRangeInstant,
  TimeRangeOptionContext,
} from '../types';
import { isRangeValid } from '../utils';

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
 * that's always available (unless `hideRangeAsDefault` and no `'range'` preset
 * is registered) and takes over as soon as either of its fields is edited.
 */
export function TimeRangeEditor<T extends DateValue>({
  draft,
  onSelectPreset,
  onChangeStart,
  onChangeEnd,
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

  const showRangeSection =
    !hideRangeAsDefault || availableTimeRangeTypes.includes('range');

  const radioTypes =
    presets.length > 0
      ? [...presets, ...(showRangeSection ? ['range'] : [])]
      : [];

  const isInvalid =
    draft.type === 'range' && !isRangeValid(draft.start, draft.end);

  return (
    <div className={s.editor}>
      {radioTypes.length > 0 && (
        <TimeRangePresetList
          types={radioTypes}
          customTimeRangeTypes={customTimeRangeTypes}
          value={draft.type}
          onChange={onSelectPreset}
          isDisabled={isDisabled}
          renderOption={renderOption}
          t={t}
        />
      )}
      {showRangeSection && (
        <div className={s.manualRange}>
          <TimeRangeDateTimeField
            label={t.format('from')}
            instant={draft.start}
            onChange={onChangeStart}
            minValue={minValue}
            maxValue={maxValue}
            isInvalid={isInvalid}
            isDisabled={isDisabled}
          />
          <TimeRangeDateTimeField
            label={t.format('to')}
            instant={draft.end}
            onChange={onChangeEnd}
            minValue={minValue}
            maxValue={maxValue}
            isInvalid={isInvalid}
            isDisabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
}
