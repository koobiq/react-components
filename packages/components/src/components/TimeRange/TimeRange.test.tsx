import { createRef, useState } from 'react';

import {
  CalendarDate,
  Time,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import { IconCalendarO16 } from '@koobiq/react-icons';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';
import { Form } from '../Form';
import { Link } from '../Link';

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

    render(
      <TimeRange ref={ref} data-testid="control">
        {({ formattedValue }) => <Button>{formattedValue}</Button>}
      </TimeRange>
    );

    expect(ref.current).toBe(getTrigger());
  });

  it('should merge a custom class name with the default ones', async () => {
    render(
      <TimeRange data-testid="control" className="foo">
        {({ formattedValue }) => <Button>{formattedValue}</Button>}
      </TimeRange>
    );

    await open();

    await getDialog();

    expect(document.querySelector('.foo')).toBeInTheDocument();
  });

  it('should not render the editor until the trigger is pressed', () => {
    render(
      <TimeRange data-testid="control">
        {({ formattedValue }) => <Button>{formattedValue}</Button>}
      </TimeRange>
    );

    expect(queryDialog()).not.toBeInTheDocument();
  });

  it('should render a default value formatted as its preset label', () => {
    render(
      <TimeRange data-testid="control" defaultValue={{ type: 'lastHour' }}>
        {({ formattedValue }) => <Button>{formattedValue}</Button>}
      </TimeRange>
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
      >
        {({ formattedValue }) => <Button>{formattedValue}</Button>}
      </TimeRange>
    );

    expect(getTrigger()).toHaveTextContent('August 31 – September 1');
  });

  it('should render the placeholder when the value is empty', () => {
    render(
      <TimeRange data-testid="control" value={null}>
        {({ formattedValue }) => (
          <Button>{formattedValue || 'Select period'}</Button>
        )}
      </TimeRange>
    );

    expect(getTrigger()).toHaveTextContent('Select period');
  });

  describe('composed triggers', () => {
    it('should support a trigger inside a layout without injecting text', async () => {
      const ref = createRef<HTMLElement>();

      render(
        <TimeRange ref={ref} defaultValue={{ type: 'lastHour' }}>
          <div>
            <span>Reporting period</span>
            <Button aria-label="Choose period" />
          </div>
        </TimeRange>
      );

      const button = screen.getByRole('button', { name: 'Choose period' });
      expect(button).not.toHaveTextContent('Last hour');
      expect(ref.current).toBe(button);
      await userEvent.click(button);
      const dialog = await getDialog();
      expect(button).toHaveAttribute('aria-controls', dialog.id);
    });

    it('should render formatted Link text with a user-provided icon', async () => {
      const rootRef = createRef<HTMLElement>();
      const linkRef = createRef<HTMLAnchorElement>();
      const onPress = vi.fn();

      render(
        <TimeRange ref={rootRef} defaultValue={{ type: 'lastHour' }}>
          {({ formattedValue }) => (
            <Link
              ref={linkRef}
              isPseudo
              endIcon={<IconCalendarO16 data-testid="icon" />}
              onPress={onPress}
            >
              {formattedValue}
            </Link>
          )}
        </TimeRange>
      );

      const link = screen.getByRole('button', { name: 'Last hour' });
      expect(rootRef.current).toBe(link);
      expect(linkRef.current).toBe(link);
      expect(within(link).getByTestId('icon')).toBeInTheDocument();
      expect(link).toHaveAttribute('aria-haspopup', 'dialog');
      expect(link).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(link);
      const dialog = await getDialog();
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(link).toHaveAttribute('aria-expanded', 'true');
      expect(link).toHaveAttribute('aria-controls', dialog.id);
    });

    it('should preserve explicit children and merge button refs and handlers', async () => {
      const rootRef = createRef<HTMLElement>();
      const buttonRef = createRef<HTMLButtonElement>();
      const onPress = vi.fn();
      const onClick = vi.fn();

      render(
        <TimeRange ref={rootRef} defaultValue={{ type: 'lastHour' }}>
          <Button ref={buttonRef} onPress={onPress} onClick={onClick}>
            Choose a period
          </Button>
        </TimeRange>
      );

      const button = screen.getByRole('button', { name: 'Choose a period' });
      expect(rootRef.current).toBe(button);
      expect(buttonRef.current).toBe(button);
      await userEvent.click(button);
      await getDialog();
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should preserve an icon-only button and its accessible name', async () => {
      render(
        <TimeRange defaultValue={{ type: 'lastHour' }}>
          <Button
            onlyIcon
            startIcon={<IconCalendarO16 />}
            aria-label="Choose period"
          />
        </TimeRange>
      );

      const button = screen.getByRole('button', { name: 'Choose period' });
      expect(button).not.toHaveTextContent('Last hour');
      await userEvent.click(button);
      await getDialog();
    });

    it.each([
      ['button', <Button key="0" />, '{Enter}'],
      ['button Space', <Button key="1" />, ' '],
      ['link', <Link key="2" isPseudo />, '{Enter}'],
      ['field', <TimeRange.Field key="3" label="Period" />, ' '],
    ])(
      'should open %s from the keyboard and restore focus after Escape',
      async (_, trigger, key) => {
        render(<TimeRange data-testid="control">{trigger}</TimeRange>);
        await userEvent.tab();
        expect(getTrigger()).toHaveFocus();
        await userEvent.keyboard(key);
        await getDialog();
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());
        await waitFor(() => expect(getTrigger()).toHaveFocus());
        expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
      }
    );

    it.each([
      ['Button', <Button key="4" isDisabled={false} />],
      ['Link', <Link key="5" isDisabled={false} />],
      ['Field', <TimeRange.Field key="6" isDisabled={false} />],
    ])(
      'should block a %s when the root is disabled or read-only',
      async (_, trigger) => {
        const { rerender } = render(
          <TimeRange isDisabled data-testid="control">
            {trigger}
          </TimeRange>
        );

        await userEvent.click(getTrigger());
        expect(queryDialog()).not.toBeInTheDocument();

        rerender(
          <TimeRange isReadOnly data-testid="control">
            {trigger}
          </TimeRange>
        );

        await userEvent.click(getTrigger());
        expect(queryDialog()).not.toBeInTheDocument();
        await userEvent.tab();
        expect(getTrigger()).not.toHaveFocus();
      }
    );

    it.each([
      <Button key="7" isDisabled />,
      <Link key="8" isDisabled />,
      <TimeRange.Field key="9" isDisabled />,
    ])('should preserve a disabled child', async (trigger) => {
      render(<TimeRange data-testid="control">{trigger}</TimeRange>);
      await userEvent.click(getTrigger());
      expect(queryDialog()).not.toBeInTheDocument();
    });

    it('should update render function text and preserve explicit empty content', () => {
      const { rerender } = render(
        <TimeRange value={null}>
          {({ formattedValue }) => (
            <Link>{formattedValue || 'Choose period'}</Link>
          )}
        </TimeRange>
      );

      expect(screen.getByRole('button')).toHaveTextContent('Choose period');

      rerender(
        <TimeRange value={{ type: 'lastHour' }}>
          {({ formattedValue }) => <Link>{formattedValue}</Link>}
        </TimeRange>
      );

      expect(screen.getByRole('button')).toHaveTextContent('Last hour');

      rerender(
        <TimeRange value={{ type: 'lastHour' }}>
          <Link aria-label="Choose period">{null}</Link>
        </TimeRange>
      );

      expect(screen.getByRole('button')).toBeEmptyDOMElement();
    });
  });

  describe('controlled popover', () => {
    it('should synchronize the trigger, dialog and open callback', async () => {
      const onOpenChange = vi.fn();

      function Fixture() {
        const [isOpen, setOpen] = useState(false);

        return (
          <TimeRange
            slotProps={{
              popover: {
                isOpen,
                onOpenChange: (open) => {
                  onOpenChange(open);
                  setOpen(open);
                },
                slotProps: { dialog: { id: 'range-dialog' } },
              },
            }}
          >
            <Button data-testid="control" />
          </TimeRange>
        );
      }

      render(<Fixture />);
      await open();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenLastCalledWith(true);
      expect(getTrigger()).toHaveAttribute('aria-controls', 'range-dialog');
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('should initialize the draft from the current value when opened externally', async () => {
      const { rerender } = render(
        <TimeRange
          value={{ type: 'lastHour' }}
          slotProps={{ popover: { isOpen: false } }}
        >
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

      rerender(
        <TimeRange
          value={{ type: 'last7Days' }}
          slotProps={{ popover: { isOpen: true } }}
        >
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

      const dialog = await getDialog();

      expect(
        within(dialog).getByRole('radio', {
          name: 'Last 7 days',
          checked: true,
        })
      ).toBeInTheDocument();
    });
  });

  describe('form field', () => {
    it('should associate label, caption, error and refs with the control', () => {
      const rootRef = createRef<HTMLElement>();
      const fieldRef = createRef<HTMLDivElement>();
      const controlRef = createRef<HTMLDivElement>();

      render(
        <TimeRange ref={rootRef} defaultValue={{ type: 'lastHour' }}>
          <TimeRange.Field
            ref={fieldRef}
            label="Period"
            caption="Applies everywhere"
            isRequired
            isInvalid
            errorMessage="Required"
            slotProps={{ control: { ref: controlRef } }}
          />
        </TimeRange>
      );

      const control = screen.getByRole('button', { name: /Period/ });
      expect(rootRef.current).toBe(control);
      expect(fieldRef.current).toBe(control);
      expect(controlRef.current).toBe(control);
      expect(control).toHaveAttribute('aria-invalid', 'true');

      expect(control).toHaveAccessibleDescription(
        'Applies everywhere Required'
      );

      expect(control).toHaveTextContent('Last hour');
    });

    it('should show errors only when invalid and use its own placeholder', () => {
      const { rerender } = render(
        <TimeRange value={null}>
          <TimeRange.Field
            label="Period"
            placeholder="Select period"
            errorMessage="Required"
          />
        </TimeRange>
      );

      expect(screen.getByRole('button')).toHaveTextContent('Select period');
      expect(screen.queryByText('Required')).not.toBeInTheDocument();

      rerender(
        <TimeRange value={null}>
          <TimeRange.Field label="Period" isInvalid errorMessage="Required" />
        </TimeRange>
      );

      expect(screen.getByRole('button')).toHaveAccessibleDescription(
        'Required'
      );
    });

    it('should inherit form layout and allow local overrides with a hidden label', () => {
      const { rerender } = render(
        <Form labelPlacement="side" labelAlign="end">
          <TimeRange>
            <TimeRange.Field
              label="Period"
              isLabelHidden
              fullWidth
              slotProps={{ root: { 'data-testid': 'field' } }}
            />
          </TimeRange>
        </Form>
      );

      expect(screen.getByTestId('field')).toHaveAttribute(
        'data-label-placement',
        'side'
      );

      expect(screen.getByTestId('field')).toHaveAttribute(
        'data-label-align',
        'end'
      );

      expect(screen.getByTestId('field')).toHaveAttribute('data-fullwidth');
      expect(screen.getByRole('button')).toHaveAccessibleName('Period');

      rerender(
        <Form labelPlacement="side">
          <TimeRange>
            <TimeRange.Field
              label="Period"
              labelPlacement="top"
              slotProps={{ root: { 'data-testid': 'field' } }}
            />
          </TimeRange>
        </Form>
      );

      expect(screen.getByTestId('field')).toHaveAttribute(
        'data-label-placement',
        'top'
      );
    });

    it('should support slot content, ids, styling and handlers', async () => {
      const onPress = vi.fn();
      const groupRef = createRef<HTMLDivElement>();

      render(
        <TimeRange>
          <TimeRange.Field
            isInvalid
            slotProps={{
              root: { className: 'field-root' },
              label: { id: 'period-label', children: 'Custom label' },
              group: { className: 'field-group', ref: groupRef },
              control: {
                id: 'period-control',
                onPress,
                'aria-describedby': 'extra-description',
              },
              caption: { id: 'period-caption', children: 'Custom caption' },
              errorMessage: { id: 'period-error', children: 'Custom error' },
            }}
          />
        </TimeRange>
      );

      const control = screen.getByRole('button', { name: 'Custom label' });
      expect(control.id).toBe('period-control');
      expect(screen.getByText('Custom error').id).toBe('period-error');
      expect(screen.getByText('Custom caption').id).toBe('period-caption');

      expect(control).toHaveAccessibleDescription(
        'Custom caption Custom error'
      );

      expect(control.closest('[data-slot="form-field"]')).toHaveClass(
        'field-root'
      );

      expect(screen.getByRole('group')).toHaveClass('field-group');
      expect(groupRef.current).toBe(screen.getByRole('group'));
      await userEvent.click(control);
      await getDialog();
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should open when clicking the group outside the control', async () => {
      render(
        <TimeRange>
          <TimeRange.Field label="Period" />
        </TimeRange>
      );

      await userEvent.click(screen.getByRole('group'));
      await getDialog();
    });

    it('should keep links in field decorations independent', async () => {
      const ref = createRef<HTMLElement>();
      const onPress = vi.fn();

      render(
        <TimeRange ref={ref}>
          <TimeRange.Field
            label="Period"
            caption={
              <Link as="button" onPress={onPress}>
                Help
              </Link>
            }
            slotProps={{
              group: { startAddon: <Button onPress={onPress}>Action</Button> },
            }}
          />
        </TimeRange>
      );

      const control = screen.getByRole('button', { name: 'Period' });
      expect(ref.current).toBe(control);
      await userEvent.click(screen.getByRole('link', { name: 'Help' }));
      await userEvent.click(screen.getByRole('button', { name: 'Action' }));
      expect(onPress).toHaveBeenCalledTimes(2);
      expect(queryDialog()).not.toBeInTheDocument();
      expect(ref.current).toBe(control);
    });
  });

  it('should render the presets radio group and manual range fields when open', async () => {
    render(
      <TimeRange data-testid="control" defaultValue={{ type: 'lastHour' }}>
        {({ formattedValue }) => <Button>{formattedValue}</Button>}
      </TimeRange>
    );

    await open();

    const dialog = await getDialog();

    expect(within(dialog).getByRole('radiogroup')).toBeInTheDocument();
    expect(within(dialog).getByText('from')).toBeInTheDocument();
    expect(within(dialog).getByText('to')).toBeInTheDocument();
  });

  it('should hide the presets radio group when availableTimeRangeTypes is empty', async () => {
    render(
      <TimeRange data-testid="control" availableTimeRangeTypes={[]}>
        {({ formattedValue }) => <Button>{formattedValue}</Button>}
      </TimeRange>
    );

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
        >
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

      // `lastHour` starts with no `start`/`end`, so mount fills them in via
      // the self-correction effect — an unrelated `onChange` call to clear
      // before checking the Apply/Cancel behavior below.
      onChange.mockClear();

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
        >
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
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
        >
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

      // `lastHour` starts with no `start`/`end`, so mount fills them in via
      // the self-correction effect — an unrelated `onChange` call to clear
      // before checking the Apply/Cancel behavior below.
      onChange.mockClear();

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
        >
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

      expect(getTrigger()).toHaveTextContent('Last hour');

      rerender(
        <TimeRange
          data-testid="control"
          value={{ type: 'currentYear' }}
          onChange={() => {}}
        >
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

      expect(getTrigger()).toHaveTextContent('Current year');
    });

    it('should stay uncontrolled with defaultValue', function () {
      function Fixture() {
        const [value, setValue] = useState<TimeRangeValue | null>({
          type: 'lastHour',
        });

        return (
          <TimeRange data-testid="control" value={value} onChange={setValue}>
            {({ formattedValue }) => <Button>{formattedValue}</Button>}
          </TimeRange>
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
        >
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
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
        <TimeRange {...props} value={{ type: 'last30Days' }}>
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

      expect(onValueCorrected).toHaveBeenCalledTimes(1);

      // A new object with the same content, as a parent re-creating an
      // inline literal on every render would produce.
      rerender(
        <TimeRange {...props} value={{ type: 'last30Days' }}>
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

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
        <TimeRange {...props} value={{ type: 'last30Days' }}>
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

      expect(onValueCorrected).toHaveBeenCalledTimes(1);

      rerender(
        <TimeRange {...props} value={{ type: 'currentYear' }}>
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

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
        >
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

      expect(onValueCorrected).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'range',
          start: expect.anything(),
          end: expect.anything(),
        })
      );
    });

    it('should fill in missing start/end for an uncontrolled defaultValue on mount', () => {
      const onValueCorrected = vi.fn();

      render(
        <TimeRange
          data-testid="control"
          defaultValue={{ type: 'lastHour' }}
          onValueCorrected={onValueCorrected}
        >
          {({ formattedValue }) => <Button>{formattedValue}</Button>}
        </TimeRange>
      );

      expect(onValueCorrected).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'lastHour',
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
      >
        {({ formattedValue }) => <Button>{formattedValue}</Button>}
      </TimeRange>
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
      >
        {({ formattedValue }) => <Button>{formattedValue}</Button>}
      </TimeRange>
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
      it('should pass through an available type that already has start/end unchanged', () => {
        const value: TimeRangeValue = {
          type: 'lastHour',
          start: new CalendarDate(2026, 1, 1),
          end: new CalendarDate(2026, 1, 1),
        };

        const result = checkAndCorrectTimeRangeValue(value, [
          'lastHour',
          'range',
        ]);

        expect(result.corrected).toBe(false);
        expect(result.value).toBe(value);
      });

      it('should fill in missing start/end for an available duration preset', () => {
        const result = checkAndCorrectTimeRangeValue({ type: 'lastHour' }, [
          'lastHour',
          'range',
        ]);

        expect(result.corrected).toBe(true);
        expect(result.value?.type).toBe('lastHour');
        expect(result.value?.start).toBeDefined();
        expect(result.value?.end).toBeDefined();
      });

      it('should not correct allTime even though it has no dates', () => {
        const result = checkAndCorrectTimeRangeValue({ type: 'allTime' }, [
          'allTime',
          'range',
        ]);

        expect(result.corrected).toBe(false);
        expect(result.value).toEqual({ type: 'allTime' });
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
