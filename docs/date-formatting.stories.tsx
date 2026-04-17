import { CalendarDateTime } from '@internationalized/date';
import { DateFormatter } from '@koobiq/date-formatter';
import { InternationalizedDateAdapter } from '@koobiq/internationalized-date-adapter';
import {
  FlexBox,
  Table,
  TableContainer,
  Typography,
  useLocale,
} from '@koobiq/react-components';
import type { StoryObj } from '@storybook/react';

const meta = {
  title: 'Date formatter',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<object>;

function createFormatter(locale: string) {
  const adapter = new InternationalizedDateAdapter(locale);

  return {
    adapter,
    formatter: new DateFormatter(adapter, locale),
  };
}

function FormatsTable({
  rows,
}: {
  rows: Array<{ name: string; value: string } | null>;
}) {
  const items = rows.filter(Boolean).map((row, index) => ({
    id: index,
    ...row,
  }));

  return (
    <TableContainer>
      <Table aria-label="Date formatter">
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Value</Table.Column>
        </Table.Header>
        <Table.Body items={items}>
          {(item) => (
            <Table.Row>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.value}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableContainer>
  );
}

function DurationShortestTable({
  rows,
}: {
  rows: Array<{ name: string; seconds: string; onlyMinutes?: string }>;
}) {
  const items = rows.map((row, index) => ({
    id: index,
    ...row,
  }));

  return (
    <TableContainer>
      <Table aria-label="Date formatter">
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Seconds</Table.Column>
          <Table.Column>Only minutes</Table.Column>
        </Table.Header>
        <Table.Body items={items}>
          {(item) => (
            <Table.Row>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.seconds}</Table.Cell>
              <Table.Cell>{item.onlyMinutes ?? ''}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableContainer>
  );
}

export const Base: Story = {
  render: function Render() {
    const { locale } = useLocale();
    const adapter = new InternationalizedDateAdapter(locale);
    const formatter = new DateFormatter(adapter, locale);

    return (
      <FlexBox direction="column" gap="xl">
        <Typography>
          {formatter.absoluteLongDateTime(adapter.parse(new Date(2026, 0, 1))!)}
        </Typography>
        <Typography>
          {formatter.absoluteShortDate(new CalendarDateTime(2026, 2, 1))}
        </Typography>
        <Typography>
          {formatter.rangeLongDate(
            new CalendarDateTime(2026, 2, 1),
            adapter.addCalendarDays(new CalendarDateTime(2026, 2, 1), 14)
          )}
        </Typography>
      </FlexBox>
    );
  },
};

export const AbsoluteDateFormats: Story = {
  render: function Render() {
    const { locale } = useLocale();
    const { adapter, formatter } = createFormatter(locale);
    const currentYearValue = adapter.parse(new Date())!;

    const notCurrentYearValue = adapter.addCalendarYears(currentYearValue, -1);

    return (
      <FlexBox direction="column" gap="xl">
        <Typography variant="subheading">Long format</Typography>

        <FormatsTable
          rows={[
            {
              name: 'absoluteLongDate (current year)',
              value: formatter.absoluteLongDate(currentYearValue),
            },
            {
              name: 'absoluteLongDate (not current year)',
              value: formatter.absoluteLongDate(notCurrentYearValue),
            },
            null,
            {
              name: 'absoluteLongDateTime (current year)',
              value: formatter.absoluteLongDateTime(currentYearValue),
            },
            {
              name: 'absoluteLongDateTime (current year) (with seconds)',
              value: formatter.absoluteLongDateTime(currentYearValue, {
                seconds: true,
              }),
            },
            {
              name: 'absoluteLongDateTime (current year) (with milliseconds)',
              value: formatter.absoluteLongDateTime(currentYearValue, {
                seconds: true,
                milliseconds: true,
              }),
            },
            null,
            {
              name: 'absoluteLongDateTime (not current year)',
              value: formatter.absoluteLongDateTime(notCurrentYearValue),
            },
            {
              name: 'absoluteLongDateTime (not current year) (with seconds)',
              value: formatter.absoluteLongDateTime(notCurrentYearValue, {
                seconds: true,
              }),
            },
            {
              name: 'absoluteLongDateTime (not current year) (with milliseconds)',
              value: formatter.absoluteLongDateTime(notCurrentYearValue, {
                seconds: true,
                milliseconds: true,
              }),
            },
          ]}
        />

        <Typography variant="subheading">Short format</Typography>

        <FormatsTable
          rows={[
            {
              name: 'absoluteShortDate (current year)',
              value: formatter.absoluteShortDate(currentYearValue),
            },
            {
              name: 'absoluteShortDate (not current year)',
              value: formatter.absoluteShortDate(notCurrentYearValue),
            },
            null,
            {
              name: 'absoluteShortDateTime (current year)',
              value: formatter.absoluteShortDateTime(currentYearValue),
            },
            {
              name: 'absoluteShortDateTime (current year) (with seconds)',
              value: formatter.absoluteShortDateTime(currentYearValue, {
                seconds: true,
              }),
            },
            {
              name: 'absoluteShortDateTime (current year) (with milliseconds)',
              value: formatter.absoluteShortDateTime(currentYearValue, {
                seconds: true,
                milliseconds: true,
              }),
            },
            null,
            {
              name: 'absoluteShortDateTime (not current year)',
              value: formatter.absoluteShortDateTime(notCurrentYearValue),
            },
            {
              name: 'absoluteShortDateTime (not current year) (with seconds)',
              value: formatter.absoluteShortDateTime(notCurrentYearValue, {
                seconds: true,
              }),
            },
            {
              name: 'absoluteShortDateTime (not current year) (with milliseconds)',
              value: formatter.absoluteShortDateTime(notCurrentYearValue, {
                seconds: true,
                milliseconds: true,
              }),
            },
          ]}
        />
      </FlexBox>
    );
  },
};

export const RelativeDateFormats: Story = {
  render: function Render() {
    const { locale } = useLocale();
    const { adapter, formatter } = createFormatter(locale);
    const currentMoment = adapter.parse(new Date())!;

    const beforeYesterdayCurrentYearValue = adapter.addCalendarDays(
      currentMoment,
      -2
    );

    const beforeYesterdayNotCurrentYearValue = adapter.addCalendarYears(
      beforeYesterdayCurrentYearValue,
      -1
    );

    const yesterdayValue = adapter.addCalendarDays(currentMoment, -1);

    const todayValue = currentMoment;

    const tomorrowValue = adapter.addCalendarDays(currentMoment, 1);

    const afterTomorrowCurrentYearValue = adapter.addCalendarDays(
      currentMoment,
      2
    );

    const afterTomorrowNotCurrentYearValue = adapter.addCalendarYears(
      afterTomorrowCurrentYearValue,
      1
    );

    return (
      <FlexBox direction="column" gap="xl">
        <Typography variant="subheading">Long format</Typography>

        <FormatsTable
          rows={[
            {
              name: 'Before yesterday (not current year)',
              value: formatter.relativeLongDate(
                beforeYesterdayNotCurrentYearValue
              ),
            },
            null,
            {
              name: 'Before yesterday (current year)',
              value: formatter.relativeLongDateTime(
                beforeYesterdayCurrentYearValue
              ),
            },
            {
              name: 'Before yesterday (current year) (with seconds)',
              value: formatter.relativeLongDateTime(
                beforeYesterdayCurrentYearValue,
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'Before yesterday (current year) (with milliseconds)',
              value: formatter.relativeLongDateTime(
                beforeYesterdayCurrentYearValue,
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'Yesterday',
              value: formatter.relativeLongDateTime(yesterdayValue),
            },
            {
              name: 'Yesterday (with seconds)',
              value: formatter.relativeLongDateTime(yesterdayValue, {
                seconds: true,
              }),
            },
            {
              name: 'Yesterday (with milliseconds)',
              value: formatter.relativeLongDateTime(yesterdayValue, {
                seconds: true,
                milliseconds: true,
              }),
            },
            null,
            {
              name: 'Today',
              value: formatter.relativeLongDateTime(todayValue),
            },
            {
              name: 'Today (with seconds)',
              value: formatter.relativeLongDateTime(todayValue, {
                seconds: true,
              }),
            },
            {
              name: 'Today (with milliseconds)',
              value: formatter.relativeLongDateTime(todayValue, {
                seconds: true,
                milliseconds: true,
              }),
            },
            null,
            {
              name: 'Tomorrow',
              value: formatter.relativeLongDateTime(tomorrowValue),
            },
            {
              name: 'Tomorrow (with seconds)',
              value: formatter.relativeLongDateTime(tomorrowValue, {
                seconds: true,
              }),
            },
            {
              name: 'Tomorrow (with milliseconds)',
              value: formatter.relativeLongDateTime(tomorrowValue, {
                seconds: true,
                milliseconds: true,
              }),
            },
            null,
            {
              name: 'After tomorrow (current year)',
              value: formatter.relativeLongDateTime(
                afterTomorrowCurrentYearValue
              ),
            },
            {
              name: 'After tomorrow (current year) (with seconds)',
              value: formatter.relativeLongDateTime(
                afterTomorrowCurrentYearValue,
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'After tomorrow (current year) (with milliseconds)',
              value: formatter.relativeLongDateTime(
                afterTomorrowCurrentYearValue,
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'After tomorrow (not current year)',
              value: formatter.relativeLongDate(
                afterTomorrowNotCurrentYearValue
              ),
            },
          ]}
        />

        <Typography variant="subheading">Short format</Typography>

        <FormatsTable
          rows={[
            {
              name: 'Before yesterday (not current year)',
              value: formatter.relativeShortDate(
                beforeYesterdayNotCurrentYearValue
              ),
            },
            null,
            {
              name: 'Before yesterday (current year)',
              value: formatter.relativeShortDateTime(
                beforeYesterdayCurrentYearValue
              ),
            },
            {
              name: 'Before yesterday (current year) (with seconds)',
              value: formatter.relativeShortDateTime(
                beforeYesterdayCurrentYearValue,
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'Before yesterday (current year) (with milliseconds)',
              value: formatter.relativeShortDateTime(
                beforeYesterdayCurrentYearValue,
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'Yesterday',
              value: formatter.relativeShortDateTime(yesterdayValue),
            },
            {
              name: 'Yesterday (with seconds)',
              value: formatter.relativeShortDateTime(yesterdayValue, {
                seconds: true,
              }),
            },
            {
              name: 'Yesterday (with milliseconds)',
              value: formatter.relativeShortDateTime(yesterdayValue, {
                seconds: true,
                milliseconds: true,
              }),
            },
            null,
            {
              name: 'Today',
              value: formatter.relativeShortDateTime(todayValue),
            },
            {
              name: 'Today (with seconds)',
              value: formatter.relativeShortDateTime(todayValue, {
                seconds: true,
              }),
            },
            {
              name: 'Today (with milliseconds)',
              value: formatter.relativeShortDateTime(todayValue, {
                seconds: true,
                milliseconds: true,
              }),
            },
            null,
            {
              name: 'Tomorrow',
              value: formatter.relativeShortDateTime(tomorrowValue),
            },
            {
              name: 'Tomorrow (with seconds)',
              value: formatter.relativeShortDateTime(tomorrowValue, {
                seconds: true,
              }),
            },
            {
              name: 'Tomorrow (with milliseconds)',
              value: formatter.relativeShortDateTime(tomorrowValue, {
                seconds: true,
                milliseconds: true,
              }),
            },
            null,
            {
              name: 'After tomorrow (current year)',
              value: formatter.relativeShortDateTime(
                afterTomorrowCurrentYearValue
              ),
            },
            {
              name: 'After tomorrow (current year) (with seconds)',
              value: formatter.relativeShortDateTime(
                afterTomorrowCurrentYearValue,
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'After tomorrow (current year) (with milliseconds)',
              value: formatter.relativeShortDateTime(
                afterTomorrowCurrentYearValue,
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'After tomorrow (not current year)',
              value: formatter.relativeShortDate(
                afterTomorrowNotCurrentYearValue
              ),
            },
          ]}
        />
      </FlexBox>
    );
  },
};

export const RangeDateFormats: Story = {
  render: function Render() {
    const { locale } = useLocale();
    const { formatter } = createFormatter(locale);

    return (
      <FlexBox direction="column" gap="xl">
        <Typography variant="subheading">Closed range</Typography>

        <Typography variant="text-big-strong">Long format</Typography>
        <FormatsTable
          rows={[
            {
              name: 'rangeLongDate (current month)',
              value: formatter.rangeLongDate(
                new CalendarDateTime(2026, 3, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 3, 10, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeLongDate (not current month)',
              value: formatter.rangeLongDate(
                new CalendarDateTime(2026, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 2, 1, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeLongDate (start date is not in current year)',
              value: formatter.rangeLongDate(
                new CalendarDateTime(2025, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 2, 1, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeLongDate (end date is not in current year)',
              value: formatter.rangeLongDate(
                new CalendarDateTime(2026, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2027, 2, 1, 11, 28, 20, 479)
              ),
            },
            null,
            {
              name: 'rangeLongDateTime (the same day, current year)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2026, 3, 10, 10, 14, 20, 479),
                new CalendarDateTime(2026, 3, 10, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeLongDateTime (the same day, current year) (with seconds)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2026, 3, 10, 10, 14, 20, 479),
                new CalendarDateTime(2026, 3, 10, 11, 28, 20, 479),
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'rangeLongDateTime (the same day, current year) (with milliseconds)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2026, 3, 10, 10, 14, 20, 479),
                new CalendarDateTime(2026, 3, 10, 11, 28, 20, 479),
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'rangeLongDateTime (the same day, not current year)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2025, 1, 11, 10, 14, 20, 479),
                new CalendarDateTime(2025, 1, 11, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeLongDateTime (not current month)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2026, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 2, 1, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeLongDateTime (start date is not in current year)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2025, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 2, 1, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeLongDateTime (end date is not in current year)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2026, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2027, 2, 1, 11, 28, 20, 479)
              ),
            },
          ]}
        />

        <Typography variant="text-big-strong">Short format</Typography>
        <FormatsTable
          rows={[
            {
              name: 'rangeShortDate (current month)',
              value: formatter.rangeShortDate(
                new CalendarDateTime(2026, 3, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 3, 10, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeShortDate (not current month)',
              value: formatter.rangeShortDate(
                new CalendarDateTime(2026, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 2, 1, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeShortDate (start date is not in current year)',
              value: formatter.rangeShortDate(
                new CalendarDateTime(2025, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 2, 1, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeShortDate (end date is not in current year)',
              value: formatter.rangeShortDate(
                new CalendarDateTime(2026, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2027, 2, 1, 11, 28, 20, 479)
              ),
            },
            null,
            {
              name: 'rangeShortDateTime (the same day, current year)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2026, 3, 10, 10, 14, 20, 479),
                new CalendarDateTime(2026, 3, 10, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeShortDateTime (the same day, current year) (with seconds)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2026, 3, 10, 10, 14, 20, 479),
                new CalendarDateTime(2026, 3, 10, 11, 28, 20, 479),
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'rangeShortDateTime (the same day, current year) (with milliseconds)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2026, 3, 10, 10, 14, 20, 479),
                new CalendarDateTime(2026, 3, 10, 11, 28, 20, 479),
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'rangeShortDateTime (the same day, not current year)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2025, 1, 11, 10, 14, 20, 479),
                new CalendarDateTime(2025, 1, 11, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeShortDateTime (not current month)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2026, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 2, 1, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeShortDateTime (start date is not in current year)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2025, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 2, 1, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeShortDateTime (end date is not in current year)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2026, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2027, 2, 1, 11, 28, 20, 479)
              ),
            },
          ]}
        />

        <Typography variant="text-big-strong">Middle format</Typography>
        <FormatsTable
          rows={[
            {
              name: 'rangeMiddleDateTime',
              value: formatter.rangeMiddleDateTime(
                new CalendarDateTime(2026, 3, 1, 10, 8, 20, 484),
                new CalendarDateTime(2026, 3, 10, 10, 8, 20, 484)
              ),
            },
            {
              name: 'rangeMiddleDateTime (with seconds)',
              value: formatter.rangeMiddleDateTime(
                new CalendarDateTime(2026, 3, 1, 10, 8, 20, 484),
                new CalendarDateTime(2026, 3, 10, 10, 8, 20, 484),
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'rangeMiddleDateTime (with milliseconds)',
              value: formatter.rangeMiddleDateTime(
                new CalendarDateTime(2026, 3, 1, 10, 8, 20, 484),
                new CalendarDateTime(2026, 3, 10, 10, 8, 20, 484),
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'rangeMiddleDateTime (the same day)',
              value: formatter.rangeMiddleDateTime(
                new CalendarDateTime(2026, 3, 10, 10, 14, 20, 484),
                new CalendarDateTime(2026, 3, 10, 10, 28, 20, 484)
              ),
            },
            {
              name: 'rangeMiddleDateTime (the same day) (with seconds)',
              value: formatter.rangeMiddleDateTime(
                new CalendarDateTime(2026, 3, 10, 10, 14, 20, 484),
                new CalendarDateTime(2026, 3, 10, 10, 28, 20, 484),
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'rangeMiddleDateTime (the same day) (with milliseconds)',
              value: formatter.rangeMiddleDateTime(
                new CalendarDateTime(2026, 3, 10, 10, 14, 20, 484),
                new CalendarDateTime(2026, 3, 10, 10, 28, 20, 484),
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'rangeMiddleDateTime (the same day, not current year)',
              value: formatter.rangeMiddleDateTime(
                new CalendarDateTime(2025, 1, 11, 10, 14, 20, 479),
                new CalendarDateTime(2025, 1, 11, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeMiddleDateTime (not current month)',
              value: formatter.rangeMiddleDateTime(
                new CalendarDateTime(2026, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 2, 1, 11, 28, 20, 479)
              ),
            },
            {
              name: 'rangeMiddleDateTime (start date is not in current year)',
              value: formatter.rangeMiddleDateTime(
                new CalendarDateTime(2025, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2026, 1, 1, 11, 28, 20, 484)
              ),
            },
            {
              name: 'rangeMiddleDateTime (end date is not in current year)',
              value: formatter.rangeMiddleDateTime(
                new CalendarDateTime(2026, 1, 1, 10, 14, 20, 479),
                new CalendarDateTime(2027, 1, 1, 11, 28, 20, 484)
              ),
            },
          ]}
        />

        <Typography variant="subheading">Opened range</Typography>

        <Typography variant="text-big-strong">Long format</Typography>
        <FormatsTable
          rows={[
            {
              name: 'rangeLongDate (only start)',
              value: formatter.rangeLongDate(
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                undefined
              ),
            },
            {
              name: 'rangeLongDate (only end)',
              value: formatter.rangeLongDate(
                null,
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492)
              ),
            },
            {
              name: 'rangeLongDate (only start, start date is not in current year)',
              value: formatter.rangeLongDate(
                new CalendarDateTime(2027, 3, 20, 10, 8, 20, 492),
                undefined
              ),
            },
            {
              name: 'rangeLongDate (only end, end date is not in current year)',
              value: formatter.rangeLongDate(
                null,
                new CalendarDateTime(2027, 3, 20, 10, 8, 20, 492)
              ),
            },
            null,
            {
              name: 'rangeLongDateTime (only start)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                undefined
              ),
            },
            {
              name: 'rangeLongDateTime (only start) (with seconds)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                undefined,
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'rangeLongDateTime (only start) (with milliseconds)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                undefined,
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'rangeLongDateTime (only start, start date is not in current year)',
              value: formatter.rangeLongDateTime(
                new CalendarDateTime(2027, 3, 20, 10, 8, 20, 492),
                undefined
              ),
            },
            {
              name: 'rangeLongDateTime (only end)',
              value: formatter.rangeLongDateTime(
                null,
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492)
              ),
            },
            {
              name: 'rangeLongDateTime (only end) (with seconds)',
              value: formatter.rangeLongDateTime(
                null,
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'rangeLongDateTime (only end) (with milliseconds)',
              value: formatter.rangeLongDateTime(
                null,
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'rangeLongDateTime (only end, end date is not in current year)',
              value: formatter.rangeLongDateTime(
                null,
                new CalendarDateTime(2027, 3, 20, 10, 8, 20, 492)
              ),
            },
          ]}
        />

        <Typography variant="text-big-strong">Short format</Typography>
        <FormatsTable
          rows={[
            {
              name: 'rangeShortDate (only start)',
              value: formatter.rangeShortDate(
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                undefined
              ),
            },
            {
              name: 'rangeShortDate (only end)',
              value: formatter.rangeShortDate(
                null,
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492)
              ),
            },
            {
              name: 'rangeShortDate (only start, start date is not in current year)',
              value: formatter.rangeShortDate(
                new CalendarDateTime(2027, 3, 20, 10, 8, 20, 492),
                undefined
              ),
            },
            {
              name: 'rangeShortDate (only end, end date is not in current year)',
              value: formatter.rangeShortDate(
                null,
                new CalendarDateTime(2027, 3, 20, 10, 8, 20, 492)
              ),
            },
            null,
            {
              name: 'rangeShortDateTime (only start)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                undefined
              ),
            },
            {
              name: 'rangeShortDateTime (only start) (with seconds)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                undefined,
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'rangeShortDateTime (only start) (with milliseconds)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                undefined,
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'rangeShortDateTime (only start, start date is not in current year)',
              value: formatter.rangeShortDateTime(
                new CalendarDateTime(2027, 3, 20, 10, 8, 20, 492),
                undefined
              ),
            },
            {
              name: 'rangeShortDateTime (only end)',
              value: formatter.rangeShortDateTime(
                null,
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492)
              ),
            },
            {
              name: 'rangeShortDateTime (only end) (with seconds)',
              value: formatter.rangeShortDateTime(
                null,
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                {
                  seconds: true,
                }
              ),
            },
            {
              name: 'rangeShortDateTime (only end) (with milliseconds)',
              value: formatter.rangeShortDateTime(
                null,
                new CalendarDateTime(2026, 3, 20, 10, 8, 20, 492),
                {
                  seconds: true,
                  milliseconds: true,
                }
              ),
            },
            null,
            {
              name: 'rangeShortDateTime (only end, end date is not in current year)',
              value: formatter.rangeShortDateTime(
                null,
                new CalendarDateTime(2027, 3, 20, 10, 8, 20, 492)
              ),
            },
          ]}
        />
      </FlexBox>
    );
  },
};

export const DurationFormats: Story = {
  render: function Render() {
    const { locale } = useLocale();
    const { formatter } = createFormatter(locale);

    return (
      <FlexBox direction="column" gap="xl">
        <Typography variant="text-big-strong">The shortest format</Typography>

        <DurationShortestTable
          rows={[
            {
              name: 'Seconds',
              seconds: formatter.durationShortest(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 0, 25, 0)
              ),
            },
            {
              name: 'Seconds and milliseconds',
              seconds: formatter.durationShortest(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 0, 25, 125),
                true,
                true
              ),
            },
            {
              name: 'Minutes and seconds',
              seconds: formatter.durationShortest(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 2, 25, 0)
              ),
              onlyMinutes: formatter.durationShortest(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 2, 25, 0),
                false
              ),
            },
            {
              name: 'Hours, minutes and seconds',
              seconds: formatter.durationShortest(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 3, 0, 2, 25, 0)
              ),
              onlyMinutes: formatter.durationShortest(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 3, 0, 2, 25, 0),
                false
              ),
            },
          ]}
        />

        <Typography variant="text-big-strong">Long format</Typography>

        <FormatsTable
          rows={[
            {
              name: 'Seconds',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 0, 21, 0)
              ),
            },
            {
              name: 'Minutes and seconds',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 1, 25, 0)
              ),
            },
            {
              name: 'Minutes',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 22, 0, 0)
              ),
            },
            {
              name: 'Minutes (more than hour)',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 2, 0, 0, 0),
                ['minutes']
              ),
            },
            {
              name: 'Hours and minutes',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 1, 21, 0, 0)
              ),
            },
            {
              name: 'Hours and minutes (more than day)',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 2, 8, 20, 0, 0),
                ['hours', 'minutes']
              ),
            },
            {
              name: 'Hours',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 2, 8, 0, 0, 0),
                ['hours']
              ),
            },
            {
              name: 'Days and hours',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 2, 8, 0, 0, 0)
              ),
            },
            {
              name: 'Days',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 3, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Days (more than week)',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 22, 0, 0, 0, 0),
                ['days']
              ),
            },
            {
              name: 'Weeks and days',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 16, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Weeks',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 15, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Months and weeks',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 2, 22, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Months',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 3, 1, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Months with fraction',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 2, 16, 0, 0, 0, 0),
                ['months'],
                true
              ),
            },
            {
              name: 'Years and months',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2029, 12, 1, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Years',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2031, 1, 1, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Years with fraction',
              value: formatter.durationLong(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2031, 7, 1, 0, 0, 0, 0),
                ['years'],
                true
              ),
            },
          ]}
        />

        <Typography variant="text-big-strong">Short format</Typography>

        <FormatsTable
          rows={[
            {
              name: 'Seconds and milliseconds',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 0, 21, 365),
                ['seconds', 'milliseconds']
              ),
            },
            {
              name: 'Seconds',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 0, 21, 0)
              ),
            },
            {
              name: 'Minutes and seconds',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 1, 25, 0)
              ),
            },
            {
              name: 'Minutes',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 0, 22, 0, 0)
              ),
            },
            {
              name: 'Minutes (more than hour)',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 2, 0, 0, 0),
                ['minutes']
              ),
            },
            {
              name: 'Hours and minutes',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 1, 1, 21, 0, 0)
              ),
            },
            {
              name: 'Hours and minutes (more than day)',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 2, 8, 20, 0, 0),
                ['hours', 'minutes']
              ),
            },
            {
              name: 'Hours',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 2, 8, 0, 0, 0),
                ['hours']
              ),
            },
            {
              name: 'Days and hours',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 2, 8, 0, 0, 0)
              ),
            },
            {
              name: 'Days',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 3, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Days (more than week)',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 16, 0, 0, 0, 0),
                ['days']
              ),
            },
            {
              name: 'Weeks and days',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 16, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Weeks',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 1, 15, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Months and weeks',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 2, 22, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Months',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 3, 1, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Months with fraction',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2026, 3, 16, 0, 0, 0, 0),
                ['months'],
                true
              ),
            },
            {
              name: 'Years and months',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2029, 12, 1, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Years',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2031, 1, 1, 0, 0, 0, 0)
              ),
            },
            {
              name: 'Years with fraction',
              value: formatter.durationShort(
                new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0),
                new CalendarDateTime(2031, 7, 1, 0, 0, 0, 0),
                ['years'],
                true
              ),
            },
          ]}
        />
      </FlexBox>
    );
  },
};
