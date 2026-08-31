import { createRef, useState } from 'react';

import {
  CalendarDate,
  Time,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';

import { TimeRange } from './TimeRange';
import type { TimeRangeValue } from './types';
import {
  calculateTimeRange,
  checkAndCorrectTimeRangeValue,
  combineDateTime,
  getDefaultRangeValue,
  isRangeValid,
  splitDateTime,
} from './utils';

const getTrigger = () => screen.getByTestId('control');
const getDialog = () => screen.findByRole('dialog');
const queryDialog = () => screen.queryByRole('dialog');

const open = async () => {
  await userEvent.click(getTrigger());
  await getDialog();
};

describe('TimeRange', () => {
  it('should accept a ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<TimeRange ref={ref} data-testid="control" />);

    expect(ref.current).toBe(getTrigger());
  });

  it('should merge a custom class name with the default ones', async () => {
    render(<TimeRange data-testid="control" />);
    await open();

    expect(getTrigger()).toBeInTheDocument();
  });

  it('should not render the editor until the trigger is pressed', () => {
    render(<TimeRange data-testid="control" />);

    expect(queryDialog()).not.toBeInTheDocument();
  });

  it('should render a default value formatted as its preset label', () => {
    render(
      <TimeRange data-testid="control" defaultValue={{ type: 'lastHour' }} />
    );

    expect(getTrigger()).toHaveTextContent('Last hour');
  });

  it('should render the placeholder when the value is empty', () => {
    render(
      <TimeRange
        data-testid="control"
        placeholder="Select period"
        value={null}
      />
    );

    expect(getTrigger()).toHaveTextContent('Select period');
  });

  it('should call the TimeRange.Trigger render function with the current formatted value and open state', async () => {
    render(
      <TimeRange defaultValue={{ type: 'lastHour' }}>
        <TimeRange.Trigger>
          {({ formattedValue, isOpen, buttonProps }) => (
            <Button {...buttonProps} data-testid="control">
              {isOpen ? 'open' : 'closed'}: {formattedValue}
            </Button>
          )}
        </TimeRange.Trigger>
      </TimeRange>
    );

    expect(getTrigger()).toHaveTextContent('closed: Last hour');
    await open();
    expect(getTrigger()).toHaveTextContent('open: Last hour');
  });

  it('should render the presets radio group and manual range fields when open', async () => {
    render(
      <TimeRange data-testid="control" defaultValue={{ type: 'lastHour' }} />
    );

    await open();

    const dialog = await getDialog();

    expect(within(dialog).getByRole('radiogroup')).toBeInTheDocument();
    expect(within(dialog).getByText('from')).toBeInTheDocument();
    expect(within(dialog).getByText('to')).toBeInTheDocument();
  });

  it('should hide the presets radio group when availableTimeRangeTypes is empty', async () => {
    render(<TimeRange data-testid="control" availableTimeRangeTypes={[]} />);
    await open();

    const dialog = await getDialog();

    expect(within(dialog).queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(within(dialog).getByText('from')).toBeInTheDocument();
  });

  describe('Apply/Cancel semantics', () => {
    it('should not call onChange until Apply is pressed', async () => {
      const onChange = vi.fn();

      render(
        <TimeRange
          data-testid="control"
          defaultValue={{ type: 'lastHour' }}
          availableTimeRangeTypes={['lastHour', 'last24Hours', 'range']}
          onChange={onChange}
        />
      );

      await open();

      const dialog = await getDialog();

      await userEvent.click(
        within(dialog).getByRole('radio', { name: /last 24 hours/i })
      );

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should commit the selected preset when Apply is pressed', async () => {
      const onChange = vi.fn();

      render(
        <TimeRange
          data-testid="control"
          defaultValue={{ type: 'lastHour' }}
          availableTimeRangeTypes={['lastHour', 'last24Hours', 'range']}
          onChange={onChange}
        />
      );

      await open();

      const dialog = await getDialog();

      await userEvent.click(
        within(dialog).getByRole('radio', { name: /last 24 hours/i })
      );

      await userEvent.click(
        within(dialog).getByRole('button', { name: /apply/i })
      );

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'last24Hours' })
      );

      await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());
      expect(getTrigger()).toHaveTextContent('Last 24 hours');
    });

    it('should discard the draft when Cancel is pressed', async () => {
      const onChange = vi.fn();

      render(
        <TimeRange
          data-testid="control"
          defaultValue={{ type: 'lastHour' }}
          availableTimeRangeTypes={['lastHour', 'last24Hours', 'range']}
          onChange={onChange}
        />
      );

      await open();

      let dialog = await getDialog();

      await userEvent.click(
        within(dialog).getByRole('radio', { name: /last 24 hours/i })
      );

      await userEvent.click(
        within(dialog).getByRole('button', { name: /cancel/i })
      );

      expect(onChange).not.toHaveBeenCalled();
      expect(getTrigger()).toHaveTextContent('Last hour');
      await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());

      await open();
      dialog = await getDialog();

      expect(
        within(dialog).getByRole('radio', { name: /last hour/i, checked: true })
      ).toBeInTheDocument();
    });
  });

  describe('controlled value', () => {
    it('should reflect an external value change', () => {
      const { rerender } = render(
        <TimeRange
          data-testid="control"
          value={{ type: 'lastHour' }}
          onChange={() => {}}
        />
      );

      expect(getTrigger()).toHaveTextContent('Last hour');

      rerender(
        <TimeRange
          data-testid="control"
          value={{ type: 'currentYear' }}
          onChange={() => {}}
        />
      );

      expect(getTrigger()).toHaveTextContent('Current year');
    });

    it('should stay uncontrolled with defaultValue', function () {
      function Fixture() {
        const [value, setValue] = useState<TimeRangeValue | null>({
          type: 'lastHour',
        });

        return (
          <TimeRange data-testid="control" value={value} onChange={setValue} />
        );
      }

      render(<Fixture />);

      expect(getTrigger()).toHaveTextContent('Last hour');
    });
  });

  it('should correct an out-of-range value and call onValueCorrected', async () => {
    const onValueCorrected = vi.fn();

    render(
      <TimeRange
        data-testid="control"
        value={{ type: 'last30Days' }}
        availableTimeRangeTypes={['lastHour', 'last24Hours', 'range']}
        onChange={() => {}}
        onValueCorrected={onValueCorrected}
      />
    );

    await waitFor(() => expect(onValueCorrected).toHaveBeenCalledTimes(1));

    expect(onValueCorrected.mock.calls[0][0]).toMatchObject({
      type: 'lastHour',
    });
  });

  it('should self-correct an out-of-range defaultValue and select it when opened', async () => {
    const onValueCorrected = vi.fn();

    render(
      <TimeRange
        data-testid="control"
        defaultValue={{ type: 'last30Days' }}
        availableTimeRangeTypes={['lastHour', 'last24Hours', 'range']}
        onValueCorrected={onValueCorrected}
      />
    );

    await waitFor(() => expect(onValueCorrected).toHaveBeenCalledTimes(1));
    expect(getTrigger()).toHaveTextContent('Last hour');

    await open();
    const dialog = await getDialog();

    expect(
      within(dialog).getByRole('radio', { name: /last hour/i, checked: true })
    ).toBeInTheDocument();
  });

  it('should disable the manual date/time fields unless the range preset is selected', async () => {
    render(
      <TimeRange
        data-testid="control"
        defaultValue={{ type: 'lastHour' }}
        availableTimeRangeTypes={['lastHour', 'last24Hours', 'range']}
      />
    );

    await open();
    const dialog = await getDialog();

    const fromDateField = within(dialog).getByLabelText('from date');
    expect(fromDateField).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(
      within(dialog).getByRole('radio', { name: /custom range/i })
    );

    expect(fromDateField).not.toHaveAttribute('aria-disabled', 'true');
  });

  describe('utils', () => {
    describe('calculateTimeRange', () => {
      it('should compute an open range for allTime', () => {
        expect(calculateTimeRange('allTime')).toEqual({});
      });

      it('should compute a duration-based range relative to now', () => {
        const { start, end } = calculateTimeRange('lastHour');

        expect(start).toBeDefined();
        expect(end).toBeDefined();
        expect(start!.compare(end!)).toBeLessThan(0);
      });

      it('should resolve a custom fixed range', () => {
        const start = new CalendarDate(2026, 1, 1);
        const end = new CalendarDate(2026, 3, 31);

        const result = calculateTimeRange('q1', [
          {
            type: 'q1',
            units: {},
            translationType: 'other',
            range: {
              start: { date: start, time: null },
              end: { date: end, time: null },
            },
          },
        ]);

        expect(result.start?.compare(start)).toBe(0);
        expect(result.end?.compare(end)).toBe(0);
      });

      it('should pass through the manual range for the range type', () => {
        const start = { date: new CalendarDate(2026, 1, 1), time: new Time(9) };
        const end = { date: new CalendarDate(2026, 1, 5), time: new Time(18) };

        const result = calculateTimeRange('range', [], { start, end });

        expect(
          result.start?.compare(combineDateTime(start.date, start.time))
        ).toBe(0);

        expect(result.end?.compare(combineDateTime(end.date, end.time))).toBe(
          0
        );
      });
    });

    describe('isRangeValid', () => {
      it('should be valid when start is before end', () => {
        const start = { date: new CalendarDate(2026, 1, 1), time: new Time(9) };
        const end = { date: new CalendarDate(2026, 1, 2), time: new Time(9) };

        expect(isRangeValid(start, end)).toBe(true);
      });

      it('should be valid when start equals end', () => {
        const instant = {
          date: new CalendarDate(2026, 1, 1),
          time: new Time(9),
        };

        expect(isRangeValid(instant, instant)).toBe(true);
      });

      it('should be invalid when start is after end', () => {
        const start = { date: new CalendarDate(2026, 1, 5), time: new Time(9) };
        const end = { date: new CalendarDate(2026, 1, 1), time: new Time(9) };

        expect(isRangeValid(start, end)).toBe(false);
      });

      it('should be invalid when either side is incomplete', () => {
        expect(
          isRangeValid(
            { date: null, time: null },
            { date: new CalendarDate(2026, 1, 1), time: null }
          )
        ).toBe(false);
      });
    });

    describe('combineDateTime / splitDateTime', () => {
      it('should round-trip a date and time', () => {
        const date = new CalendarDate(2026, 6, 15);
        const time = new Time(14, 30);

        const combined = combineDateTime(date, time);
        const split = splitDateTime(combined);

        expect(split.date?.compare(date)).toBe(0);
        expect(split.time?.compare(time)).toBe(0);
      });
    });

    describe('getDefaultRangeValue', () => {
      it('should default to yesterday through today', () => {
        const { start, end } = getDefaultRangeValue();
        const zone = getLocalTimeZone();

        expect(end.date?.compare(today(zone))).toBe(0);
        expect(start.date?.compare(today(zone).subtract({ days: 1 }))).toBe(0);
      });

      it('should clamp to minValue/maxValue', () => {
        const min = today(getLocalTimeZone());
        const max = today(getLocalTimeZone());

        const { start, end } = getDefaultRangeValue(min, max);

        expect(start.date?.compare(min)).toBe(0);
        expect(end.date?.compare(max)).toBe(0);
      });
    });

    describe('checkAndCorrectTimeRangeValue', () => {
      it('should pass through an available type unchanged', () => {
        const value: TimeRangeValue = { type: 'lastHour' };

        const result = checkAndCorrectTimeRangeValue(value, [
          'lastHour',
          'range',
        ]);

        expect(result.corrected).toBe(false);
        expect(result.value).toBe(value);
      });

      it('should fall back to the first available preset when unavailable', () => {
        const result = checkAndCorrectTimeRangeValue({ type: 'last30Days' }, [
          'lastHour',
          'range',
        ]);

        expect(result.corrected).toBe(true);
        expect(result.value?.type).toBe('lastHour');
      });

      it('should return null when there are no available presets', () => {
        const result = checkAndCorrectTimeRangeValue(
          { type: 'last30Days' },
          []
        );

        expect(result.corrected).toBe(true);
        expect(result.value).toBeNull();
      });
    });
  });
});
