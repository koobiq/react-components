import { useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { useDateSegment } from '@koobiq/react-primitives';
import type { DateSegment, DateFieldState } from '@koobiq/react-primitives';

import s from './DateSegment.module.css';

type DateSegmentProps = {
  segment: DateSegment;
  state: DateFieldState;
};

export function DateSegment({ segment, state }: DateSegmentProps) {
  const ref = useRef(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  const { text, isPlaceholder, type } = segment;

  return (
    <span
      {...segmentProps}
      ref={ref}
      className={clsx(
        s.base,
        s[type],
        state.value !== null && s.hasValue,
        isPlaceholder && s.placeholder
      )}
    >
      {text}
    </span>
  );
}
