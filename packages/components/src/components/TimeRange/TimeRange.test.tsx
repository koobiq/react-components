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

import { TimeRangeEditor } from './components/TimeRangeEditor';
import { TimeRange } from './TimeRange';
import type { TimeRangeValue } from './types';
import {
  calculateTimeRange,
  checkAndCorrectTimeRangeValue,
  combineDateTime,
  getDefaultRangeValue,
  isRangeReversed,
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
    render(<TimeRange data-testid="control" className="foo" />);
    await open();

    await getDialog();

    expect(document.querySelector('.foo')).toBeInTheDocument();
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

  it('should render a range value formatted as its start–end span', () => {
    render(
      <TimeRange
        data-testid="control"
        defaultValue={{
          type: 'range',
          start: new CalendarDate(2026, 8, 31),
          end: new CalendarDate(2026, 9, 1),
        }}
      />
    );

    expect(getTrigger()).toHaveTextContent('August 31 – September 1');
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

  describe('form field', () => {
    it('should render the label above the trigger', () => {
      render(<TimeRange data-testid="control" label="Period" />);

      expect(screen.getByText('Period')).toBeInTheDocument();
    });

    it('should render the caption below the trigger', () => {
      render(<TimeRange data-testid="control" caption="Applies everywhere" />);

      expect(screen.getByText('Applies everywhere')).toBeInTheDocument();
    });

    it('should render the error message only when isInvalid is true', () => {
      const { rerender } = render(
        <TimeRange data-testid="control" errorMessage="Required" />
      );

      expect(screen.queryByText('Required')).not.toBeInTheDocument();

      rerender(
        <TimeRange data-testid="control" isInvalid errorMessage="Required" />
      );

      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('should open the popover when clicking the control group outside the button', async () => {
      render(<TimeRange data-testid="control" label="Period" />);

      // The group's own padding/chevron aren't part of the button, so a
      // click there must be forwarded to it to open the popover.
      await userEvent.click(screen.getByRole('group'));
      await getDialog();
    });

    it('should not apply label/caption/errorMessage to a custom trigger', () => {
      render(
        <TimeRange
          label="Period"
          caption="Applies everywhere"
          isInvalid
          errorMessage="Required"
        >
          <TimeRange.Trigger>
            {({ buttonProps }) => (
              <Button {...buttonProps} data-testid="control" />
            )}
          </TimeRange.Trigger>
        </TimeRange>
      );

      expect(screen.queryByText('Period')).not.toBeInTheDocument();
      expect(screen.queryByText('Applies everywhere')).not.toBeInTheDocument();
      expect(screen.queryByText('Required')).not.toBeInTheDocument();
    });
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

  it('should reflect isDisabled in the TimeRange.Trigger render function, e.g. for a custom FormField wrapper', () => {
    render(
      <TimeRange defaultValue={{ type: 'lastHour' }} isDisabled>
        <TimeRange.Trigger>
          {({ isDisabled, buttonProps }) => (
            <Button {...buttonProps} data-testid="control">
              {isDisabled ? 'disabled' : 'enabled'}
            </Button>
          )}
        </TimeRange.Trigger>
      </TimeRange>
    );

    expect(getTrigger()).toHaveTextContent('disabled');
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

  describe('value correction', () => {
    it('should immediately show a corrected value for a controlled out-of-range value, without mutating the value prop', () => {
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

      expect(getTrigger()).toHaveTextContent('Last hour');

      expect(onValueCorrected).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'lastHour' })
      );
    });

    it('should not call onValueCorrected again for the same invalid value on an unrelated re-render', () => {
      const onValueCorrected = vi.fn();

      const props = {
        'data-testid': 'control',
        availableTimeRangeTypes: ['lastHour', 'last24Hours', 'range'],
        onChange: () => {},
        onValueCorrected,
      };

      const { rerender } = render(
        <TimeRange {...props} value={{ type: 'last30Days' }} />
      );

      expect(onValueCorrected).toHaveBeenCalledTimes(1);

      // A new object with the same content, as a parent re-creating an
      // inline literal on every render would produce.
      rerender(<TimeRange {...props} value={{ type: 'last30Days' }} />);

      expect(onValueCorrected).toHaveBeenCalledTimes(1);
    });

    it('should call onValueCorrected again for a different invalid value that falls back to the same preset', () => {
      const onValueCorrected = vi.fn();

      const props = {
        'data-testid': 'control',
        availableTimeRangeTypes: ['lastHour', 'last24Hours', 'range'],
        onChange: () => {},
        onValueCorrected,
      };

      const { rerender } = render(
        <TimeRange {...props} value={{ type: 'last30Days' }} />
      );

      expect(onValueCorrected).toHaveBeenCalledTimes(1);

      rerender(<TimeRange {...props} value={{ type: 'currentYear' }} />);

      expect(onValueCorrected).toHaveBeenCalledTimes(2);
    });

    it('should recalculate missing start/end for an available range value and report it', () => {
      const onValueCorrected = vi.fn();

      render(
        <TimeRange
          data-testid="control"
          value={{ type: 'range' }}
          onChange={() => {}}
          onValueCorrected={onValueCorrected}
        />
      );

      expect(onValueCorrected).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'range',
          start: expect.anything(),
          end: expect.anything(),
        })
      );
    });
  });

  it('should self-correct an out-of-range defaultValue and select it when opened', async () => {
    render(
      <TimeRange
        data-testid="control"
        defaultValue={{ type: 'last30Days' }}
        availableTimeRangeTypes={['lastHour', 'last24Hours', 'range']}
      />
    );

    await waitFor(() => expect(getTrigger()).toHaveTextContent('Last hour'));

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
      within(dialog).getByRole('radio', { name: /^period$/i })
    );

    expect(fromDateField).not.toHaveAttribute('aria-disabled', 'true');
  });

  describe('manual range swap-on-blur', () => {
    const baseEditorProps = {
      onSelectPreset: () => {},
      onChangeStart: () => {},
      onChangeEnd: () => {},
      availableTimeRangeTypes: ['range'],
      customTimeRangeTypes: [],
      hideRangeAsDefault: false,
    };

    it('should swap a reversed range once focus leaves the fields', async () => {
      const onSwapRange = vi.fn();

      render(
        <>
          <TimeRangeEditor
            {...baseEditorProps}
            draft={{
              type: 'range',
              start: {
                date: new CalendarDate(2026, 6, 10),
                time: new Time(10),
              },
              end: { date: new CalendarDate(2026, 6, 5), time: new Time(9) },
            }}
            onSwapRange={onSwapRange}
          />
          <button type="button">outside</button>
        </>
      );

      await userEvent.click(screen.getByLabelText('from date'));
      await userEvent.click(screen.getByText('outside'));

      expect(onSwapRange).toHaveBeenCalledTimes(1);
    });

    it('should not swap an already-valid range', async () => {
      const onSwapRange = vi.fn();

      render(
        <>
          <TimeRangeEditor
            {...baseEditorProps}
            draft={{
              type: 'range',
              start: { date: new CalendarDate(2026, 6, 5), time: new Time(9) },
              end: { date: new CalendarDate(2026, 6, 10), time: new Time(10) },
            }}
            onSwapRange={onSwapRange}
          />
          <button type="button">outside</button>
        </>
      );

      await userEvent.click(screen.getByLabelText('from date'));
      await userEvent.click(screen.getByText('outside'));

      expect(onSwapRange).not.toHaveBeenCalled();
    });
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

    describe('isRangeReversed', () => {
      it('should be true when start is after end', () => {
        const start = { date: new CalendarDate(2026, 1, 5), time: new Time(9) };
        const end = { date: new CalendarDate(2026, 1, 1), time: new Time(9) };

        expect(isRangeReversed(start, end)).toBe(true);
      });

      it('should be false when start is before or equal to end', () => {
        const start = { date: new CalendarDate(2026, 1, 1), time: new Time(9) };
        const end = { date: new CalendarDate(2026, 1, 5), time: new Time(9) };

        expect(isRangeReversed(start, end)).toBe(false);
        expect(isRangeReversed(start, start)).toBe(false);
      });

      it('should be false when either side is incomplete, unlike !isRangeValid', () => {
        const incomplete = { date: null, time: null };
        const end = { date: new CalendarDate(2026, 1, 1), time: null };

        expect(isRangeReversed(incomplete, end)).toBe(false);
        expect(isRangeValid(incomplete, end)).toBe(false);
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
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 5, 15, 12, 0, 0));

        try {
          const { start, end } = getDefaultRangeValue();
          const zone = getLocalTimeZone();

          expect(end.date?.compare(today(zone))).toBe(0);

          expect(start.date?.compare(today(zone).subtract({ days: 1 }))).toBe(
            0
          );
        } finally {
          vi.useRealTimers();
        }
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

      it('should recalculate missing start/end for an available range value', () => {
        const result = checkAndCorrectTimeRangeValue({ type: 'range' }, [
          'lastHour',
          'range',
        ]);

        expect(result.corrected).toBe(true);
        expect(result.value?.type).toBe('range');
        expect(result.value?.start).toBeDefined();
        expect(result.value?.end).toBeDefined();
      });

      it('should pass through an available range value that already has start/end', () => {
        const value: TimeRangeValue = {
          type: 'range',
          start: new CalendarDate(2026, 1, 1),
          end: new CalendarDate(2026, 1, 5),
        };

        const result = checkAndCorrectTimeRangeValue(value, [
          'lastHour',
          'range',
        ]);

        expect(result.corrected).toBe(false);
        expect(result.value).toBe(value);
      });
    });
  });
});
