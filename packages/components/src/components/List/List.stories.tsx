import { useState } from 'react';

import { isString } from '@koobiq/react-core';

import { utilClasses } from '../../styles/utility';
import type { Selection } from '../../types';
import { Checkbox } from '../Checkbox';
import { FlexBox } from '../FlexBox';

import type { ListProps } from './index';
import { List } from './index';

export default {
  title: 'Components/List',
  component: List,
  subcomponents: {
    'List.Item': List.Item,
    'List.Section': List.Section,
    'List.ItemText': List.ItemText,
  },
  argTypes: {},
};

export const Base = {
  render: (args: ListProps<object>) => (
    <List
      aria-label="Numbers"
      selectionMode="single"
      defaultSelectedKeys={['first']}
      autoFocus
      {...args}
    >
      <List.Item key="first">
        <List.ItemText>First</List.ItemText>
      </List.Item>
      <List.Item key="second">
        <List.ItemText>Second</List.ItemText>
      </List.Item>
      <List.Item key="third">
        <List.ItemText>Third</List.ItemText>
      </List.Item>
      <List.Item key="fourth">
        <List.ItemText>Fourth</List.ItemText>
      </List.Item>
      <List.Item key="fifth">
        <List.ItemText>Fifth</List.ItemText>
      </List.Item>
    </List>
  ),
};

export const DynamicCollections = {
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
      <List selectionMode="single" items={options}>
        {(item) => <List.Item>{item.name}</List.Item>}
      </List>
    );
  },
};

export const SelectionStory = {
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

export const DisabledItems = {
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
        selectionMode="multiple"
        defaultSelectedKeys={[2, 3]}
        disabledKeys={[1, 2]}
      >
        {(item) => <List.Item>{item.name}</List.Item>}
      </List>
    );
  },
};

export const Links = {
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

export const Sections = {
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

export const OtherExamples = {
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
          <List.Item key="1">
            <List.ItemText caption="HelperText">First</List.ItemText>
          </List.Item>
          <List.Item key="2">
            <List.ItemText>Second</List.ItemText>
          </List.Item>
          <List.Item key="3">
            <List.ItemText>Third</List.ItemText>
          </List.Item>
          <List.Item key="4">
            <List.ItemText>Fourth</List.ItemText>
          </List.Item>
          <List.Item key="5">
            <List.ItemText>Fifth</List.ItemText>
          </List.Item>
          <List.Item key="6">
            <List.ItemText
              slotProps={{
                text: { ellipsis: true },
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
          <List.Item key="7">
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
            <List.Item>
              <Checkbox
                isSelected={!isString(selected) && selected.has(item.id)}
              />
              {item.name}
            </List.Item>
          )}
        </List>
      </FlexBox>
    );
  },
};
