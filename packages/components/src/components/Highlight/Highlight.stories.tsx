import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { useFilter } from '../../index';
import { Autocomplete } from '../Autocomplete';
import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Link } from '../Link';
import { SearchInput } from '../SearchInput';
import { Table, TableContainer } from '../Table';
import { Typography } from '../Typography';

import {
  Highlight,
  type HighlightBaseProps,
  highlightPropVariant,
} from './index';

const meta = {
  title: 'Components/Highlight',
  component: Highlight,
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-08-18'],
} satisfies Meta<typeof Highlight>;

export default meta;
type Story = StoryObj<HighlightBaseProps>;

export const Base: Story = {
  render: (args) => (
    <Typography>
      <Highlight text="Manchester United" query="man" {...args} />
    </Typography>
  ),
};

export const Variant: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="column" alignItems="center">
      {highlightPropVariant.map((variant) => (
        <FlexBox key={variant} gap="xxs" direction="column" alignItems="center">
          <Typography>
            <Highlight
              {...args}
              text="Manchester United"
              query="man"
              variant={variant}
            />
          </Typography>
          <Typography variant="text-compact" color="contrast-secondary">
            {variant}
          </Typography>
        </FlexBox>
      ))}
    </FlexBox>
  ),
};

export const RootTag: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="column" style={{ maxInlineSize: 420 }}>
      <FlexBox gap="xxs" direction="column">
        <Typography>
          A default <Highlight {...args} text="inline span" query="inline" />{' '}
          stays in the surrounding text flow.
        </Typography>
        <Typography variant="text-compact" color="contrast-secondary">
          as = span (default)
        </Typography>
      </FlexBox>
      <FlexBox gap="xxs" direction="column">
        <Highlight
          {...args}
          as="p"
          style={{ margin: 0 }}
          text="A paragraph is a block of its own and takes the full width."
          query="block"
        />
        <Typography variant="text-compact" color="contrast-secondary">
          as = p
        </Typography>
      </FlexBox>
    </FlexBox>
  ),
};

export const Text: Story = {
  render: (args) => {
    const query = 'cub';

    const text =
      'The cube can be represented in many ways. One example is by drawing a graph,' +
      ' a structure in graph theory consisting of a set of vertices that are connected' +
      ' with an edge. This graph also represents the family of a cuboid, a polyhedron' +
      ' with six quadrilateral faces, which includes the cube as its special case.';

    return (
      <FlexBox gap="s" direction="column" style={{ maxInlineSize: 520 }}>
        <Typography variant="headline">
          <Highlight {...args} text="Cube" query={query} />
        </Typography>
        <Typography>
          <Highlight {...args} text={text} query={query} />
        </Typography>
      </FlexBox>
    );
  },
};

export const InAutocomplete: Story = {
  render: function Render(args) {
    const clubs = [
      'Manchester United',
      'Manchester 62 FC',
      'FC United of Manchester',
      'Manchester United Reserves',
      'Manchester United U23',
      'Manchester United Academy',
    ].map((name) => ({ key: name, name }));

    const { contains } = useFilter({ sensitivity: 'base' });

    const [inputValue, setInputValue] = useState('');

    const items = clubs.filter((club) => contains(club.name, inputValue));

    return (
      <Autocomplete
        items={items}
        label="Club"
        style={{ inlineSize: 320 }}
        placeholder="Choose a club"
        inputValue={inputValue}
        onInputChange={setInputValue}
      >
        {(item) => (
          <Autocomplete.Item key={item.key} textValue={item.name}>
            <Highlight {...args} text={item.name} query={inputValue} />
          </Autocomplete.Item>
        )}
      </Autocomplete>
    );
  },
};

export const SearchResults: Story = {
  render: function Render(args) {
    const results = [
      {
        title: 'Cube',
        url: 'https://en.wikipedia.org/wiki/Cube',
        snippet:
          'A cube is a three-dimensional solid object in geometry. A cube has eight' +
          ' vertices and twelve straight edges of the same length, so that these edges' +
          ' form six faces.',
      },
      {
        title: 'Cube (1997 film)',
        url: 'https://en.wikipedia.org/wiki/Cube_(1997_film)',
        snippet:
          'Cube is a 1997 Canadian science fiction horror film directed and co-written' +
          ' by Vincenzo Natali, produced by the Canadian Film Centre First Feature' +
          ' Project.',
      },
      {
        title: 'Cube (algebra)',
        url: 'https://en.wikipedia.org/wiki/Cube_(algebra)',
        snippet:
          'In arithmetic and algebra, the cube of a number n is its third power,' +
          ' that is, the result of multiplying three instances of n together.',
      },
    ];

    const [value, setValue] = useState('cube');

    const [query, setQuery] = useState('cube');

    return (
      <FlexBox gap="l" direction="column" style={{ maxInlineSize: 560 }}>
        <FlexBox gap="s" alignItems="flex-end">
          <SearchInput
            value={value}
            aria-label="Search"
            placeholder="Search"
            onChange={setValue}
            onSubmit={setQuery}
          />
          <Button variant="contrast-filled" onPress={() => setQuery(value)}>
            Search
          </Button>
        </FlexBox>
        {results.map((result) => (
          <FlexBox key={result.url} gap="xxs" direction="column">
            <Link href={result.url} target="_blank">
              <Typography as="span" variant="text-big-strong">
                <Highlight {...args} text={result.title} query={query} />
              </Typography>
            </Link>
            <Typography variant="text-compact" color="contrast-secondary">
              {result.url}
            </Typography>
            <Typography>
              <Highlight {...args} text={result.snippet} query={query} />
            </Typography>
          </FlexBox>
        ))}
      </FlexBox>
    );
  },
};

export const InTable: Story = {
  parameters: {
    layout: 'padded',
  },
  render: (args) => {
    const query = 'manc';

    const rows = [
      {
        city: 'Manchester',
        company: 'Blue Harbor Ltd',
        person: 'Alice Brown',
        notes: 'Annual review completed',
      },
      {
        city: 'Liverpool',
        company: 'Mancraft Studio',
        person: 'Daniel Reed',
        notes: 'New client onboarded',
      },
      {
        city: 'Bristol',
        company: 'GreenField Tech',
        person: 'Mancini Robert',
        notes: 'Budget approved',
      },
      {
        city: 'Leeds',
        company: 'Northwind Labs',
        person: 'Emma Stone',
        notes: 'Visit planned for Manchester office',
      },
      {
        city: 'York',
        company: 'Delta Systems',
        person: 'Michael Turner',
        notes: 'Contract with Mancorp signed',
      },
      {
        city: 'Oxford',
        company: 'Silver Bridge',
        person: 'Laura Green',
        notes: 'Archived in mancategory B',
      },
    ];

    return (
      <TableContainer>
        <Table aria-label="Companies matching the search query">
          <Table.Header>
            <Table.Column>City</Table.Column>
            <Table.Column>Company</Table.Column>
            <Table.Column>Person</Table.Column>
            <Table.Column>Notes</Table.Column>
          </Table.Header>
          <Table.Body items={rows}>
            {(row) => (
              <Table.Row key={row.city}>
                <Table.Cell>
                  <Highlight {...args} text={row.city} query={query} />
                </Table.Cell>
                <Table.Cell>
                  <Highlight {...args} text={row.company} query={query} />
                </Table.Cell>
                <Table.Cell>
                  <Highlight {...args} text={row.person} query={query} />
                </Table.Cell>
                <Table.Cell>
                  <Highlight {...args} text={row.notes} query={query} />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableContainer>
    );
  },
};
