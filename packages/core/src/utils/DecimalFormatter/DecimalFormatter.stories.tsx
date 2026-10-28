import { Table, TableContainer } from '@koobiq/react-components';
import type { Meta, StoryObj } from '@storybook/react';

import { useDecimalFormatter } from '../../hooks/useDecimalFormatter';

import { DecimalFormatter } from './DecimalFormatter';

const meta = {
  title: 'Utilities/DecimalFormatter',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Base: Story = {
  render: function Render() {
    const formatter = useDecimalFormatter();

    const columns = [
      { id: 'value', name: 'Value' },
      { id: 'format', name: 'format' },
      { id: 'formatTable', name: 'formatTable' },
      { id: 'formatRounded', name: 'formatRounded' },
    ];

    const rows: Array<Record<string, string | number | null>> = [
      1234, 56_789, 987_654.321, 1_000_000_000,
    ].map((value) => ({
      id: value,
      value,
      format: formatter.format(value),
      formatTable: formatter.formatTable(value),
      formatRounded: formatter.formatRounded(value),
    }));

    return (
      <TableContainer>
        <Table aria-label="Decimal formatter" divider="row" fullWidth>
          <Table.Header columns={columns}>
            {(column) => <Table.Column>{column.name}</Table.Column>}
          </Table.Header>
          <Table.Body items={rows}>
            {(row) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{row[String(columnKey)]}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableContainer>
    );
  },
};

export const DigitsInfo: Story = {
  render: () => {
    const en = new DecimalFormatter('en-US');
    const ru = new DecimalFormatter('ru-RU');

    const columns = [
      { id: 'digitsInfo', name: 'digitsInfo' },
      { id: 'en', name: 'en-US' },
      { id: 'ru', name: 'ru-RU' },
    ];

    const rows: Array<Record<string, string | number | null>> = [
      '1.0-3',
      '1.0-0',
      '1.2-2',
      '6.0-1',
      '4.0-2-false',
      '1.0-3-true',
    ].map((digitsInfo) => ({
      id: digitsInfo,
      digitsInfo,
      en: en.format(1234.5678, digitsInfo),
      ru: ru.format(1234.5678, digitsInfo),
    }));

    return (
      <TableContainer>
        <Table aria-label="Digits info" divider="row" fullWidth>
          <Table.Header columns={columns}>
            {(column) => <Table.Column>{column.name}</Table.Column>}
          </Table.Header>
          <Table.Body items={rows}>
            {(row) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{row[String(columnKey)]}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableContainer>
    );
  },
};

export const Rounding: Story = {
  render: () => {
    const en = new DecimalFormatter('en-US');
    const ru = new DecimalFormatter('ru-RU');

    const columns = [
      { id: 'value', name: 'Value' },
      { id: 'en', name: 'en-US' },
      { id: 'ru', name: 'ru-RU' },
    ];

    const rows: Array<Record<string, string | number | null>> = [
      152, 1515, 2015, 152_352, 1_034_000, 10_434_000, 1_500_000_000,
      2_500_000_000_000,
    ].map((value) => ({
      id: value,
      value,
      en: en.formatRounded(value),
      ru: ru.formatRounded(value),
    }));

    return (
      <TableContainer>
        <Table aria-label="Rounding" divider="row" fullWidth>
          <Table.Header columns={columns}>
            {(column) => <Table.Column>{column.name}</Table.Column>}
          </Table.Header>
          <Table.Body items={rows}>
            {(row) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{row[String(columnKey)]}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableContainer>
    );
  },
};

export const Localization: Story = {
  render: () => {
    const en = new DecimalFormatter('en-US');
    const ru = new DecimalFormatter('ru-RU');

    const columns = [
      { id: 'value', name: 'Value' },
      { id: 'enText', name: 'en-US format' },
      { id: 'enTable', name: 'en-US formatTable' },
      { id: 'ruText', name: 'ru-RU format' },
      { id: 'ruTable', name: 'ru-RU formatTable' },
    ];

    const rows: Array<Record<string, string | number | null>> = [
      1234, 56_789, 987_654.321,
    ].map((value) => ({
      id: value,
      value,
      enText: en.format(value),
      enTable: en.formatTable(value),
      ruText: ru.format(value),
      ruTable: ru.formatTable(value),
    }));

    return (
      <TableContainer>
        <Table aria-label="Localization" divider="row" fullWidth>
          <Table.Header columns={columns}>
            {(column) => <Table.Column>{column.name}</Table.Column>}
          </Table.Header>
          <Table.Body items={rows}>
            {(row) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{row[String(columnKey)]}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableContainer>
    );
  },
};
