import { useState } from 'react';

import { isString } from '@koobiq/react-core';

import { utilClasses } from '../../styles/utility';
import type { Selection } from '../../types';
import { Checkbox } from '../Checkbox';
import { FlexBox } from '../FlexBox';

import { ListItemText } from './components';
import type { ListProps } from './index';
import { List, ListItem, ListSection } from './index';

export default {
  title: 'Components/List',
  component: List,
  subcomponents: { ListItem, ListSection, ListItemText },
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
      <ListItem key="first">
        <ListItemText>First</ListItemText>
      </ListItem>
      <ListItem key="second">
        <ListItemText>Second</ListItemText>
      </ListItem>
      <ListItem key="third">
        <ListItemText>Third</ListItemText>
      </ListItem>
      <ListItem key="fourth">
        <ListItemText>Fourth</ListItemText>
      </ListItem>
      <ListItem key="fifth">
        <ListItemText>Fifth</ListItemText>
      </ListItem>
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
        {(item) => <ListItem>{item.name}</ListItem>}
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
          {(item) => <ListItem>{item.id}</ListItem>}
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
        {(item) => <ListItem>{item.name}</ListItem>}
      </List>
    );
  },
};

export const Links = {
  render: () => (
    <List aria-label="Links">
      <ListItem href="https://apple.com/" target="_blank">
        Apple
      </ListItem>
      <ListItem href="https://google.com/" target="_blank">
        Google
      </ListItem>
      <ListItem href="https://microsoft.com/" target="_blank">
        Microsoft
      </ListItem>
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
            <ListSection title="Group 1">
              <ListItem>Item 1</ListItem>
              <ListItem>Item 2</ListItem>
              <ListItem>Item 3</ListItem>
            </ListSection>
            <ListSection title="Group 2">
              <ListItem>Item 1</ListItem>
              <ListItem>Item 2</ListItem>
              <ListItem>Item 3</ListItem>
            </ListSection>
          </List>
        </section>
        <section>
          <List
            label="Dynamic collections:"
            selectionMode="multiple"
            items={options}
          >
            {(item) => (
              <ListSection
                key={item.name}
                items={item.children}
                title={item.name}
              >
                {(item) => <ListItem>{item.name}</ListItem>}
              </ListSection>
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
          <ListItem key="1">
            <ListItemText caption="HelperText">First</ListItemText>
          </ListItem>
          <ListItem key="2">
            <ListItemText>Second</ListItemText>
          </ListItem>
          <ListItem key="3">
            <ListItemText>Third</ListItemText>
          </ListItem>
          <ListItem key="4">
            <ListItemText>Fourth</ListItemText>
          </ListItem>
          <ListItem key="5">
            <ListItemText>Fifth</ListItemText>
          </ListItem>
          <ListItem key="6">
            <ListItemText
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
            </ListItemText>
          </ListItem>
          <ListItem key="7">
            <ListItemText
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
            </ListItemText>
          </ListItem>
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
            <ListItem>
              <Checkbox
                checked={!isString(selected) && selected.has(item.id)}
              />
              {item.name}
            </ListItem>
          )}
        </List>
      </FlexBox>
    );
  },
};
