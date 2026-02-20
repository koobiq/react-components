import { useCallback, useState } from 'react';

import { isString, useBoolean } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { SkeletonTypography, spacing, Toggle, Typography } from '../../index';
import type { Selection } from '../../index';
import { utilClasses } from '../../styles/utility';
import { Checkbox } from '../Checkbox';
import { FlexBox } from '../FlexBox';

import { List, type ListProps } from './index';

const meta = {
  title: 'Components/List',
  component: List,
  subcomponents: {
    'List.Item': List.Item,
    'List.Section': List.Section,
    'List.Divider': List.Divider,
    'List.ItemText': List.ItemText,
  },
  argTypes: {},
} satisfies Meta<typeof List>;

export default meta;

type Story = StoryObj<ListProps<unknown>>;

export const Base: Story = {
  render: (args) => (
    <List
      aria-label="Numbers"
      selectionMode="single"
      defaultSelectedKeys={['first']}
      autoFocus
      {...args}
    >
      <List.Item key="first" textValue="First">
        <List.ItemText>First</List.ItemText>
      </List.Item>
      <List.Item key="second" textValue="Second">
        <List.ItemText>Second</List.ItemText>
      </List.Item>
      <List.Item key="third" textValue="Third">
        <List.ItemText>Third</List.ItemText>
      </List.Item>
      <List.Item key="fourth" textValue="Fourth">
        <List.ItemText>Fourth</List.ItemText>
      </List.Item>
      <List.Item key="fifth" textValue="Fifth">
        <List.ItemText>Fifth</List.ItemText>
      </List.Item>
    </List>
  ),
};

export const DynamicCollections: Story = {
  render: () => {
    const options = [
      { id: 1, name: 'Bruteforce' },
      { id: 2, name: 'Complex Attack' },
      { id: 3, name: 'DDoS' },
      { id: 4, name: 'DoS' },
      { id: 5, name: 'HIPS Alert' },
      { id: 6, name: 'IDS/IPS Alert' },
      { id: 7, name: 'Identity Theft' },
      { id: 8, name: 'Miscellaneous' },
      { id: 9, name: 'Network Attack' },
      { id: 10, name: 'Post Compromise' },
      { id: 11, name: 'Potential Attack' },
    ];

    return (
      <List
        aria-label="Dynamic collections"
        selectionMode="single"
        items={options}
      >
        {(item) => <List.Item>{item.name}</List.Item>}
      </List>
    );
  },
};

export const SelectionStory: Story = {
  name: 'Selection',
  render: function Render() {
    const sectionStyle = {
      padding: '1em',
      marginTop: '1em',
      borderRadius: '1em',
      backgroundColor: 'var(--kbq-background-contrast-fade)',
    };

    const [selected, setSelected] = useState<Selection>(
      new Set(['Bruteforce'])
    );

    const options = [
      { id: 'Bruteforce' },
      { id: 'Complex Attack' },
      { id: 'DDoS' },
      { id: 'DoS' },
      { id: 'HIPS Alert' },
      { id: 'IDS/IPS Alert' },
      { id: 'Identity Theft' },
      { id: 'Miscellaneous' },
      { id: 'Network Attack' },
      { id: 'Post Compromise' },
      { id: 'Potential Attack' },
    ];

    return (
      <>
        <List
          items={options}
          aria-label="Selection"
          selectedKeys={selected}
          selectionMode="multiple"
          onSelectionChange={(selected) => {
            setSelected(selected);
          }}
        >
          {(item) => <List.Item>{item.id}</List.Item>}
        </List>
        <section
          style={sectionStyle}
          className={utilClasses.typography['text-normal']}
        >
          Current selection (controlled):{' '}
          {selected === 'all' ? 'all' : [...selected].join(', ')}
        </section>
      </>
    );
  },
};

export const DisabledItems: Story = {
  name: 'Disabled items',
  render: () => {
    const options = [
      { id: 1, name: 'Bruteforce' },
      { id: 2, name: 'Complex Attack' },
      { id: 3, name: 'DDoS' },
      { id: 4, name: 'DoS' },
      { id: 5, name: 'HIPS Alert' },
      { id: 6, name: 'IDS/IPS Alert' },
      { id: 7, name: 'Identity Theft' },
      { id: 8, name: 'Miscellaneous' },
      { id: 9, name: 'Network Attack' },
      { id: 10, name: 'Post Compromise' },
      { id: 11, name: 'Potential Attack' },
    ];

    return (
      <List
        items={options}
        disabledKeys={[1, 2]}
        selectionMode="multiple"
        aria-label="Disabled items"
        defaultSelectedKeys={[2, 3]}
      >
        {(item) => <List.Item>{item.name}</List.Item>}
      </List>
    );
  },
};

export const Links: Story = {
  render: () => (
    <List aria-label="Links">
      <List.Item href="https://react.dev/" target="_blank">
        React
      </List.Item>
      <List.Item href="https://www.typescriptlang.org/" target="_blank">
        Typescript
      </List.Item>
      <List.Item href="https://storybook.js.org/" target="_blank">
        Storybook
      </List.Item>
    </List>
  ),
};

export const Sections: Story = {
  render: function Render() {
    const options = [
      {
        name: 'Group 1',
        children: [
          { id: 2, name: 'Item 1' },
          { id: 3, name: 'Item 2' },
          { id: 4, name: 'Item 3' },
        ],
      },
      {
        name: 'Group 2',
        children: [
          { id: 6, name: 'Item 1' },
          { id: 7, name: 'Item 2' },
          { id: 8, name: 'Item 3' },
        ],
      },
    ];

    return (
      <FlexBox direction="column" alignItems="stretch" gap="l">
        <section>
          <List label="Static collections:" selectionMode="multiple">
            <List.Section title="Group 1">
              <List.Item>Item 1</List.Item>
              <List.Item>Item 2</List.Item>
              <List.Item>Item 3</List.Item>
            </List.Section>
            <List.Section title="Group 2">
              <List.Item>Item 1</List.Item>
              <List.Item>Item 2</List.Item>
              <List.Item>Item 3</List.Item>
            </List.Section>
          </List>
        </section>
        <section>
          <List
            label="Dynamic collections:"
            selectionMode="multiple"
            items={options}
          >
            {(item) => (
              <List.Section
                key={item.name}
                items={item.children}
                title={item.name}
              >
                {(item) => <List.Item>{item.name}</List.Item>}
              </List.Section>
            )}
          </List>
        </section>
      </FlexBox>
    );
  },
};

export const OtherExamples: Story = {
  name: 'Other examples',
  render: function Render() {
    const [selected, setSelected] = useState<Selection>(new Set([1, 2]));

    return (
      <FlexBox direction="column" alignItems="stretch" gap="l">
        <List
          aria-label="Numbers"
          selectionMode="single"
          defaultSelectedKeys={['1']}
        >
          <List.Item key="1" textValue="First">
            <List.ItemText caption="HelperText">First</List.ItemText>
          </List.Item>
          <List.Item key="2" textValue="Second">
            <List.ItemText>Second</List.ItemText>
          </List.Item>
          <List.Item key="3" textValue="Third">
            <List.ItemText>Third</List.ItemText>
          </List.Item>
          <List.Item key="4" textValue="Fourth">
            <List.ItemText>Fourth</List.ItemText>
          </List.Item>
          <List.Item key="5" textValue="Fifth">
            <List.ItemText>Fifth</List.ItemText>
          </List.Item>
          <List.Divider />
          <List.Item key="6" textValue="Sixth">
            <List.ItemText
              slotProps={{
                text: { ellipsis: false },
              }}
              caption={
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad atque distinctio praesentium quos veniam! Doloribus eum laudantium magnam placeat tempore?'
              }
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
              amet architecto, illo modi quam quia quisquam reiciendis sequi
              tempore totam! Aperiam beatae, distinctio dolores doloribus ea
              error explicabo iusto nam nobis, non nostrum quaerat quas quasi
              quibusdam quidem sapiente voluptas.
            </List.ItemText>
          </List.Item>
          <List.Item key="7" textValue="Seventh">
            <List.ItemText
              slotProps={{
                caption: { ellipsis: true },
              }}
              caption={
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad atque distinctio praesentium quos veniam! Doloribus eum laudantium magnam placeat tempore?'
              }
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
              amet architecto, illo modi quam quia quisquam reiciendis sequi
              tempore totam! Aperiam beatae, distinctio dolores doloribus ea
              error explicabo iusto nam nobis, non nostrum quaerat quas quasi
              quibusdam quidem sapiente voluptas.
            </List.ItemText>
          </List.Item>
        </List>
        <List
          aria-label="List"
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={(selected) => {
            setSelected(selected);
          }}
          items={[
            { id: 1, name: 'item 1' },
            { id: 2, name: 'item 2' },
            { id: 3, name: 'item 3' },
          ]}
        >
          {(item) => (
            <List.Item textValue={item.name}>
              <Checkbox
                isSelected={!isString(selected) && selected.has(item.id)}
                isReadOnly
              />
              {item.name}
            </List.Item>
          )}
        </List>
      </FlexBox>
    );
  },
};

export const NoItems: Story = {
  render: function Render() {
    const emptyBlockStyles = {
      border: '1px solid var(--kbq-line-contrast-fade)',
      borderRadius: '0.5em',
      blockSize: 200,
    };

    return (
      <List<{ name: string }>
        items={[]}
        aria-label="No items"
        slotProps={{ list: { autoFocus: false } }}
        noItemsText={
          <FlexBox
            style={emptyBlockStyles}
            alignItems="center"
            justifyContent="center"
          >
            <Typography color="inherit">No results found</Typography>
          </FlexBox>
        }
      >
        {(item) => <List.Item>{item.name}</List.Item>}
      </List>
    );
  },
};

export const Loading: Story = {
  render: function Render() {
    const listStyles = {
      border: '1px solid var(--kbq-line-contrast-fade)',
      borderRadius: '0.5em',
      inlineSize: 240,
      blockSize: 200,
    };

    const [isCustom, { toggle }] = useBoolean(false);

    return (
      <FlexBox gap="s" direction="column">
        <Toggle isSelected={isCustom} onChange={toggle}>
          Custom loading
        </Toggle>
        <List<{ id: string; title: string }>
          items={[]}
          label="Products"
          style={listStyles}
          {...(isCustom && {
            loadingText: (
              <>
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className={spacing({ pi: 'l', pb: 'xs' })}>
                    <SkeletonTypography
                      variant="text-normal"
                      inlineSize={`${60 + 10 * Math.floor(Math.random() * 5)}%`}
                    />
                  </div>
                ))}
              </>
            ),
          })}
          isPadded
          isLoading
        >
          {(item) => (
            <List.Item key={item.id} textValue={item.title}>
              <List.ItemText>{item.title}</List.ItemText>
            </List.Item>
          )}
        </List>
      </FlexBox>
    );
  },
};

export const AsynchronousLoading: Story = {
  render: function Render() {
    const listStyles = {
      border: '1px solid var(--kbq-line-contrast-fade)',
      borderRadius: '0.5em',
      inlineSize: 240,
      blockSize: 400,
    };

    type Product = {
      id: number;
      title: string;
      thumbnail: string;
    };

    const ITEMS_PER_PAGE = 5;

    const [products, setProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const fetchProducts = useCallback(async () => {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${ITEMS_PER_PAGE}&skip=${page * ITEMS_PER_PAGE}`
      );

      const data = await response.json();

      if (data.products.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setPage((prevPage) => prevPage + 1);
      }
    }, [page]);

    return (
      <List
        label="Products"
        items={products}
        style={listStyles}
        isLoading={hasMore}
        onLoadMore={fetchProducts}
        slotProps={{ label: { style: { paddingInlineStart: 0 } } }}
        isPadded
      >
        {(item) => (
          <List.Item key={item.id} textValue={item.title}>
            <List.ItemText>{item.title}</List.ItemText>
          </List.Item>
        )}
      </List>
    );
  },
};
