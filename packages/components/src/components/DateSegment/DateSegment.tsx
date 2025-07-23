import { useRef } from 'react';

import { clsx, useLocalizedStringFormatter } from '@koobiq/react-core';
import { useDateSegment } from '@koobiq/react-primitives';
import type { DateSegment, DateFieldState } from '@koobiq/react-primitives';

import { useLocale } from '../../index';

import s from './DateSegment.module.css';
import intlMessages from './intl.json';
import { isTime } from './utils';

type DateSegmentProps = {
  segment: DateSegment;
  state: DateFieldState;
};

export function DateSegment({ segment, state }: DateSegmentProps) {
  const ref = useRef(null);
  const { locale } = useLocale();
  const { segmentProps } = useDateSegment(segment, state, ref);

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  const { text, type, isPlaceholder } = segment;

  const hasValue = state.value !== null;

  const content =
    isTime(type) && isPlaceholder && locale in intlMessages
      ? stringFormatter.format(type)
      : text;

  return (
    <span
      {...segmentProps}
      ref={ref}
      className={clsx(
        s.base,
        s[type],
        hasValue && s.hasValue,
        isPlaceholder && s.placeholder
      )}
    >
      {content}
    </span>
  );
}
