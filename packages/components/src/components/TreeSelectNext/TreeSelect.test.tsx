import { Collection } from '@koobiq/react-primitives';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Provider } from '../Provider';
import { Tree } from '../Tree';

import { TreeSelect } from './TreeSelect';
import type { TreeSelectProps } from './types';

type FileNode = { id: number; title: string; children: FileNode[] };

const items: FileNode[] = [
  {
    id: 1,
    title: 'app',
    children: [{ id: 2, title: 'Http', children: [] }],
  },
  { id: 7, title: 'README.md', children: [] },
];

function renderTreeSelect(props: Partial<TreeSelectProps<FileNode>> = {}) {
  return render(
    <Provider>
      <TreeSelect
        items={items}
        label="Files"
        slotProps={{ control: { 'data-testid': 'control' } }}
        {...props}
      >
        {function renderItem(item: FileNode) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Collection items={item.children}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </TreeSelect>
    </Provider>
  );
}

const getControl = () => screen.getByTestId('control');

describe('TreeSelectNext value', () => {
  it('renders the selected values as tags in multiple mode', () => {
    renderTreeSelect({
      selectionMode: 'multiple',
      defaultSelectedKeys: new Set([1, 7]),
    });

    const control = getControl();

    expect(within(control).getByText('app')).toBeInTheDocument();
    expect(within(control).getByText('README.md')).toBeInTheDocument();
  });
});
