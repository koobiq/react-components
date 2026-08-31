'use client';

import type { ReactNode } from 'react';

import type { LocalizedStringFormatter } from '@koobiq/react-core';

import { Radio } from '../../RadioGroup';
import s from '../TimeRange.module.css';
import type { CustomTimeRangeType, TimeRangeOptionContext } from '../types';
import { formatTimeRangeDuration, getTimeRangeTypeConfig } from '../utils';

export type TimeRangePresetListProps = {
  types: string[];
  customTimeRangeTypes: CustomTimeRangeType[];
  renderOption?: (context: TimeRangeOptionContext) => ReactNode;
  t: LocalizedStringFormatter<string>;
};

/** The grid of preset `Radio` options shown in the editor. */
export function TimeRangePresetList({
  types,
  customTimeRangeTypes,
  renderOption,
  t,
}: TimeRangePresetListProps) {
  return (
    <div className={s.presetGrid}>
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
    </div>
  );
}
