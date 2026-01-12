import { useState } from 'react';

import {
  ButtonToggle,
  ButtonToggleGroup,
  FlexBox,
  Table,
  Alert,
  Typography,
} from '@koobiq/react-components';
import { clsx } from '@koobiq/react-core';

import { columns, rows } from './data';
import s from './Roadmap.module.css';

type RoadmapYear = '2024' | '2025' | '2026';

export function Roadmap() {
  const [selectedYear, setSelectedYear] = useState<RoadmapYear>('2026');

  const filteredRows = rows.filter((row) => row.planned.includes(selectedYear));

  return (
    <FlexBox direction="column" gap="l" className={clsx(s.box, 'sb-unstyled')}>
      <ButtonToggleGroup
        selectedKey={selectedYear}
        onSelectionChange={(key) => setSelectedYear(key as RoadmapYear)}
      >
        <ButtonToggle id="2024">2024</ButtonToggle>
        <ButtonToggle id="2025">2025</ButtonToggle>
        <ButtonToggle id="2026">2026</ButtonToggle>
      </ButtonToggleGroup>
      {selectedYear === '2026' && (
        <Alert isCompact isColored>
          We&#39;re still working on the 2026 roadmap — we&#39;ll share an
          update soon.
        </Alert>
      )}
      <Table
        selectionMode="single"
        divider="row"
        aria-label="Components Status Table"
        className={clsx(s.base)}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column key={column.key}>{column.name}</Table.Column>
          )}
        </Table.Header>
        <Table.Body items={filteredRows}>
          {(item) => (
            <Table.Row
              key={item.component}
              href={`/Components/${item.component}`}
            >
              {(columnKey) => (
                <Table.Cell>
                  {columnKey === 'component' && item.component ? (
                    <Typography variant="text-normal-strong">
                      {item.component}
                    </Typography>
                  ) : (
                    item[columnKey]
                  )}
                </Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </FlexBox>
  );
}
