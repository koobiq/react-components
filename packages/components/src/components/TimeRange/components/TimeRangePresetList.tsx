'use client';

import type { ReactNode } from 'react';

import type { LocalizedStringFormatter } from '@koobiq/react-core';

import { Radio, RadioGroup } from '../../RadioGroup';
import s from '../TimeRange.module.css';
import type { CustomTimeRangeType, TimeRangeOptionContext } from '../types';
import { formatTimeRangeDuration, getTimeRangeTypeConfig } from '../utils';

export type TimeRangePresetListProps = {
  types: string[];
  customTimeRangeTypes: CustomTimeRangeType[];
  value: string;
  onChange: (type: string) => void;
  isDisabled?: boolean;
  renderOption?: (context: TimeRangeOptionContext) => ReactNode;
  t: LocalizedStringFormatter<string>;
};

/** The `RadioGroup` of preset options shown in the editor. */
export function TimeRangePresetList({
  types,
  customTimeRangeTypes,
  value,
  onChange,
  isDisabled,
  renderOption,
  t,
}: TimeRangePresetListProps) {
  return (
    <RadioGroup
      isLabelHidden
      label={t.format('presets')}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      slotProps={{ radioGroup: { className: s.presetGrid } }}
    >
      {types.map((type) => {
        const entry = getTimeRangeTypeConfig(type, customTimeRangeTypes);
        const formattedValue = formatTimeRangeDuration(type, entry, t);

        const context: TimeRangeOptionContext = {
          type,
          translationType: entry?.translationType ?? 'other',
          formattedValue,
          units: entry?.units ?? {},
        };

        return (
          <Radio key={type} value={type}>
            {renderOption ? renderOption(context) : formattedValue}
          </Radio>
        );
      })}
    </RadioGroup>
  );
}
