import { useCallback, useEffect, useRef, useState } from 'react';

import { logger } from '@koobiq/logger';

import { useInterval } from '../useInterval';

export const USE_TIMER_ERROR_EQ_TIME =
  'useTimer: `startTime` must not be equal to `endTime`.';

export const USE_TIMER_ERROR_MULTIPLICITY_INTERVAL_TO_START_TIME =
  'useTimer: `interval` must evenly divide `startTime`.';

export const USE_TIMER_ERROR_MULTIPLICITY_INTERVAL_TO_END_TIME =
  'useTimer: `interval` must evenly divide `endTime`.';

export type TimerOptions = {
  /** Initial timer value in milliseconds */
  startTime?: number;
  /** Final timer value in milliseconds */
  endTime?: number;
  /** Tick interval in milliseconds */
  interval?: number;
  /** Callback fired when the timer reaches the end value */
  onTimerEnd?: () => void;
};

export type TimerValues = {
  /** Current timer value */
  count: number;
  /** Whether the timer is currently running */
  isTimerRunning: boolean;
  /** Start or resume the timer */
  startTimer: () => void;
  /** Pause the timer */
  pauseTimer: () => void;
  /** Reset the timer to the initial value and stop it */
  resetTimer: () => void;
};

export function useTimer({
  endTime = 0,
  startTime = 0,
  interval = 1000,
  onTimerEnd,
}: TimerOptions): TimerValues {
  const [state, setState] = useState<{
    count: number;
    isTimerRunning: boolean;
  }>({
    count: startTime,
    isTimerRunning: false,
  });

  const savedOnTimerEnd = useRef<TimerOptions['onTimerEnd']>(null);

  const timerCallback = () => {
    setState(({ count: prevCount }) => {
      const isDecrement = startTime > endTime;
      let newCount = isDecrement ? prevCount - interval : prevCount + interval;

      // Prevent overshooting the endTime
      if (
        (isDecrement && newCount < endTime) ||
        (!isDecrement && newCount > endTime)
      ) {
        newCount = endTime;
      }

      return {
        isTimerRunning: newCount !== endTime,
        count: newCount,
      };
    });
  };

  // Trigger timer ticks only while running
  useInterval(timerCallback, state.isTimerRunning ? interval : null);

  const resetTimer = useCallback(() => {
    setState(() => ({
      isTimerRunning: false,
      count: startTime,
    }));
  }, [startTime]);

  const pauseTimer = useCallback(() => {
    setState((state) => ({
      ...state,
      isTimerRunning: false,
    }));
  }, []);

  const startTimer = useCallback(() => {
    setState(({ count }) => ({
      // Restart if timer has reached the end; otherwise continue
      count: count === endTime ? startTime : count,
      isTimerRunning: startTime !== endTime,
    }));
  }, [startTime, endTime]);

  // Save onTimerEnd callback
  useEffect(() => {
    savedOnTimerEnd.current = onTimerEnd;
  }, [onTimerEnd]);

  // Dev-only validations
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (startTime === endTime) {
        logger.error(USE_TIMER_ERROR_EQ_TIME);
      }

      if (startTime % interval) {
        logger.error(USE_TIMER_ERROR_MULTIPLICITY_INTERVAL_TO_START_TIME);
      }

      if (endTime % interval) {
        logger.error(USE_TIMER_ERROR_MULTIPLICITY_INTERVAL_TO_END_TIME);
      }
    }
  }, [startTime, endTime, interval]);

  // Fire the completion callback
  useEffect(() => {
    if (state.count === endTime && startTime !== endTime) {
      savedOnTimerEnd.current?.();
    }
  }, [state.count, endTime, startTime]);

  return {
    count: state.count,
    isTimerRunning: state.isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}
