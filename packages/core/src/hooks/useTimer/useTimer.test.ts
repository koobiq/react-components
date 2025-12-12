import { act, renderHook } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

import {
  useTimer,
  USE_TIMER_ERROR_EQ_TIME,
  USE_TIMER_ERROR_MULTIPLICITY_INTERVAL_TO_END_TIME,
  USE_TIMER_ERROR_MULTIPLICITY_INTERVAL_TO_START_TIME,
} from './index';

vi.useFakeTimers();

describe('useTimer', () => {
  it('should initialize the hook correctly', () => {
    const { result } = renderHook(() => useTimer({ startTime: 1000 }));

    const { startTimer, pauseTimer, resetTimer, isTimerRunning, count } =
      result.current;

    expect(typeof startTimer).toBe('function');
    expect(typeof pauseTimer).toBe('function');
    expect(typeof resetTimer).toBe('function');
    expect(isTimerRunning).toBe(false);
    expect(count).toBe(1000);
  });

  it('should NOT call onTimerEnd if unmounted before completion', () => {
    const callback = vi.fn();

    const { result, unmount } = renderHook(() =>
      useTimer({ startTime: 1000, onTimerEnd: callback })
    );

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      unmount();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(callback).not.toBeCalled();
  });

  describe('DEC (counting down)', () => {
    it('should correctly count down when startTime > 0 and endTime === 0', () => {
      const onTimerEnd = vi.fn();

      const { result } = renderHook(() =>
        useTimer({ startTime: 3000, onTimerEnd })
      );

      act(result.current.startTimer);

      act(() => vi.advanceTimersByTime(1000));

      expect(result.current.isTimerRunning).toBe(true);
      expect(onTimerEnd).not.toBeCalled();
      expect(result.current.count).toBe(2000);

      act(() => vi.advanceTimersByTime(2000));

      expect(result.current.isTimerRunning).toBe(false);
      expect(onTimerEnd).toHaveBeenCalledTimes(1);
      expect(result.current.count).toBe(0);
    });

    it('should correctly count down when startTime > endTime > 0', () => {
      const onTimerEnd = vi.fn();

      const { result } = renderHook(() =>
        useTimer({ startTime: 3000, endTime: 1000, onTimerEnd })
      );

      act(result.current.startTimer);

      act(() => vi.advanceTimersByTime(1000));

      expect(result.current.isTimerRunning).toBe(true);
      expect(result.current.count).toBe(2000);

      act(() => vi.advanceTimersByTime(1000));

      expect(result.current.isTimerRunning).toBe(false);
      expect(onTimerEnd).toHaveBeenCalledTimes(1);
      expect(result.current.count).toBe(1000);
    });

    it('should correctly count down when startTime > 0 and endTime < 0', () => {
      const onTimerEnd = vi.fn();

      const { result } = renderHook(() =>
        useTimer({ startTime: 1000, endTime: -1000, onTimerEnd })
      );

      act(result.current.startTimer);

      act(() => vi.advanceTimersByTime(1000));

      expect(result.current.count).toBe(0);

      act(() => vi.advanceTimersByTime(1000));

      expect(result.current.isTimerRunning).toBe(false);
      expect(onTimerEnd).toHaveBeenCalledTimes(1);
      expect(result.current.count).toBe(-1000);
    });

    it('should warn when interval does not divide startTime and endTime', () => {
      const onTimerEnd = vi.fn();
      const errMock = vi.fn();
      vi.spyOn(console, 'error').mockImplementation(errMock);

      const { result } = renderHook(() =>
        useTimer({ startTime: 1000, endTime: 1, interval: 550, onTimerEnd })
      );

      act(result.current.startTimer);

      expect(errMock).toHaveBeenCalledWith(
        expect.stringContaining(
          USE_TIMER_ERROR_MULTIPLICITY_INTERVAL_TO_START_TIME
        )
      );

      expect(errMock).toHaveBeenCalledWith(
        expect.stringContaining(
          USE_TIMER_ERROR_MULTIPLICITY_INTERVAL_TO_END_TIME
        )
      );

      act(() => vi.advanceTimersByTime(550));

      expect(result.current.count).toBe(450);

      act(() => vi.advanceTimersByTime(550));

      expect(result.current.isTimerRunning).toBe(false);
      expect(onTimerEnd).toHaveBeenCalledTimes(1);
      expect(result.current.count).toBe(1);
    });
  });

  describe('INC (counting up)', () => {
    it('should correctly count up when startTime === 0 and endTime > 0', () => {
      const onTimerEnd = vi.fn();

      const { result } = renderHook(() =>
        useTimer({ startTime: 0, endTime: 3000, onTimerEnd })
      );

      act(result.current.startTimer);

      act(() => vi.advanceTimersByTime(1000));

      expect(result.current.count).toBe(1000);

      act(() => vi.advanceTimersByTime(2000));

      expect(result.current.isTimerRunning).toBe(false);
      expect(onTimerEnd).toHaveBeenCalledTimes(1);
      expect(result.current.count).toBe(3000);
    });

    it('should correctly count up when startTime < endTime > 0', () => {
      const onTimerEnd = vi.fn();

      const { result } = renderHook(() =>
        useTimer({ startTime: 1000, endTime: 3000, onTimerEnd })
      );

      act(result.current.startTimer);

      act(() => vi.advanceTimersByTime(1000));

      expect(result.current.count).toBe(2000);

      act(() => vi.advanceTimersByTime(2000));

      expect(result.current.count).toBe(3000);
      expect(onTimerEnd).toHaveBeenCalledTimes(1);
    });

    it('should correctly count up when startTime < 0 and endTime < 0', () => {
      const onTimerEnd = vi.fn();

      const { result } = renderHook(() =>
        useTimer({ startTime: -1000, endTime: 1000, onTimerEnd })
      );

      act(result.current.startTimer);

      act(() => vi.advanceTimersByTime(1000));

      expect(result.current.count).toBe(0);

      act(() => vi.advanceTimersByTime(1000));

      expect(result.current.count).toBe(1000);
      expect(onTimerEnd).toHaveBeenCalledTimes(1);
    });

    it('should warn when interval does not divide startTime and endTime', () => {
      const onTimerEnd = vi.fn();
      const errMock = vi.fn();
      vi.spyOn(console, 'error').mockImplementation(errMock);

      const { result } = renderHook(() =>
        useTimer({ startTime: 1, endTime: 1000, interval: 550, onTimerEnd })
      );

      act(result.current.startTimer);

      expect(errMock).toHaveBeenCalledWith(
        expect.stringContaining(
          USE_TIMER_ERROR_MULTIPLICITY_INTERVAL_TO_START_TIME
        )
      );

      expect(errMock).toHaveBeenCalledWith(
        expect.stringContaining(
          USE_TIMER_ERROR_MULTIPLICITY_INTERVAL_TO_END_TIME
        )
      );

      act(() => vi.advanceTimersByTime(550));

      expect(result.current.count).toBe(551);

      act(() => vi.advanceTimersByTime(550));

      expect(result.current.count).toBe(1000);
      expect(onTimerEnd).toHaveBeenCalledTimes(1);
    });
  });

  it('should NOT start the timer if startTime equals endTime', () => {
    const onTimerEnd = vi.fn();
    const errMock = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(errMock);

    const startTime = 1000;
    const endTime = 1000;
    const interval = 500;

    const { result } = renderHook(() =>
      useTimer({ startTime, endTime, interval, onTimerEnd })
    );

    act(result.current.startTimer);

    expect(errMock).toHaveBeenCalledWith(
      expect.stringContaining(USE_TIMER_ERROR_EQ_TIME)
    );

    expect(result.current.count).toBe(startTime);
    expect(result.current.isTimerRunning).toBe(false);
    expect(onTimerEnd).toHaveBeenCalledTimes(0);

    act(() => vi.advanceTimersByTime(interval));
    expect(result.current.count).toBe(startTime);

    act(() => vi.advanceTimersByTime(interval));
    expect(result.current.count).toBe(startTime);
  });

  it('should correctly perform startTimer()', () => {
    const onTimerEnd = vi.fn();

    const { result } = renderHook(() =>
      useTimer({ startTime: 2000, endTime: 0, onTimerEnd })
    );

    act(result.current.startTimer);

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.count).toBe(1000);

    act(result.current.pauseTimer);

    expect(result.current.isTimerRunning).toBe(false);

    act(result.current.startTimer);

    act(() => vi.advanceTimersByTime(1000));

    expect(onTimerEnd).toHaveBeenCalledTimes(1);
    expect(result.current.count).toBe(0);

    act(result.current.startTimer);

    act(() => vi.advanceTimersByTime(2000));

    expect(onTimerEnd).toHaveBeenCalledTimes(2);
    expect(result.current.count).toBe(0);
  });

  it('should correctly perform pauseTimer()', () => {
    const onTimerEnd = vi.fn();

    const { result } = renderHook(() =>
      useTimer({ startTime: 1000, endTime: -1000, onTimerEnd })
    );

    act(result.current.startTimer);

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.count).toBe(0);

    act(result.current.pauseTimer);

    expect(result.current.isTimerRunning).toBe(false);
    expect(result.current.count).toBe(0);

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.count).toBe(0);
    expect(onTimerEnd).toHaveBeenCalledTimes(0);
  });

  it('should correctly perform resetTimer()', () => {
    const onTimerEnd = vi.fn();

    const { result } = renderHook(() =>
      useTimer({ startTime: 1000, endTime: -1000, onTimerEnd })
    );

    act(result.current.startTimer);

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.count).toBe(0);

    act(result.current.resetTimer);

    expect(result.current.isTimerRunning).toBe(false);
    expect(result.current.count).toBe(1000);

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.count).toBe(1000);
    expect(onTimerEnd).toHaveBeenCalledTimes(0);
  });
});
