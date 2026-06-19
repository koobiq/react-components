import { Collection, useTreeSelectState } from '@koobiq/react-primitives';
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Provider } from '../Provider';

import { TreeSelect } from './TreeSelect';

type FileItem = {
  id: string;
  name: string;
  isDisabled?: boolean;
  children?: FileItem[];
};

const data: FileItem[] = [
  {
    id: 'config',
    name: 'config',
    children: [
      { id: 'config-app', name: 'app.js' },
      { id: 'config-db', name: 'database.js' },
    ],
  },
  { id: 'readme', name: 'README.md' },
];

function renderItem(item: FileItem) {
  return (
    <TreeSelect.Item
      key={item.id}
      textValue={item.name}
      isDisabled={item.isDisabled}
    >
      <TreeSelect.ItemContent>{item.name}</TreeSelect.ItemContent>
      <Collection items={item.children}>{renderItem}</Collection>
    </TreeSelect.Item>
  );
}

function renderTreeSelect(
  props: Partial<React.ComponentProps<typeof TreeSelect<FileItem>>> = {}
) {
  return render(
    <Provider>
      <TreeSelect aria-label="Files" items={data} {...props}>
        {renderItem}
      </TreeSelect>
    </Provider>
  );
}

function getTrigger() {
  return document.querySelector('[data-slot="select-value"]') as HTMLElement;
}

async function openTreeSelect(user: ReturnType<typeof userEvent.setup>) {
  await user.click(getTrigger());

  return screen.findByRole('treegrid');
}

describe('TreeSelect', () => {
  beforeAll(() => {
    // Tree internals reference IntersectionObserver (LoadMore sentinel).
    globalThis.IntersectionObserver = class {
      disconnect = vi.fn();
      observe = vi.fn();
      takeRecords = vi.fn(() => []);
      unobserve = vi.fn();
    } as unknown as typeof IntersectionObserver;
  });

  it('renders root nodes in the dropdown', async () => {
    const user = userEvent.setup();
    renderTreeSelect();

    const tree = await openTreeSelect(user);

    expect(within(tree).getByText('config')).toBeInTheDocument();
    expect(within(tree).getByText('README.md')).toBeInTheDocument();
  });

  it('expands the branches listed in defaultExpandedKeys', async () => {
    const user = userEvent.setup();
    renderTreeSelect({ defaultExpandedKeys: ['config'] });

    const tree = await openTreeSelect(user);

    expect(within(tree).getByText('app.js')).toBeInTheDocument();
  });

  it('lets the user expand a collapsed branch', async () => {
    const user = userEvent.setup();
    renderTreeSelect();

    const tree = await openTreeSelect(user);

    expect(within(tree).queryByText('app.js')).not.toBeInTheDocument();

    const configRow = within(tree).getByText('config').closest('[role="row"]');
    await user.click(within(configRow as HTMLElement).getByRole('button'));

    expect(within(tree).getByText('app.js')).toBeInTheDocument();
  });

  it('selects a single node and reports the id', async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();
    renderTreeSelect({ onSelectionChange });

    const tree = await openTreeSelect(user);
    await user.click(within(tree).getByText('README.md'));

    expect(onSelectionChange).toHaveBeenLastCalledWith('readme');
    expect(getTrigger()).toHaveTextContent('README.md');

    await waitFor(() =>
      expect(screen.queryByRole('treegrid')).not.toBeInTheDocument()
    );
  });

  it('closes the dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    renderTreeSelect();

    await openTreeSelect(user);
    await user.click(document.body);

    await waitFor(() =>
      expect(screen.queryByRole('treegrid')).not.toBeInTheDocument()
    );
  });

  it('respects a controlled selectedKey', async () => {
    const user = userEvent.setup();
    renderTreeSelect({ selectedKey: 'readme' });

    expect(getTrigger()).toHaveTextContent('README.md');

    const tree = await openTreeSelect(user);

    expect(
      within(tree).getByText('README.md').closest('[role="row"]')
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('supports static collection items', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <TreeSelect
          aria-label="Files"
          defaultExpandedKeys={['config']}
          placeholder="Select file"
        >
          <TreeSelect.Item id="config" textValue="config">
            <TreeSelect.ItemContent>config</TreeSelect.ItemContent>
            <TreeSelect.Item id="config-app" textValue="app.js">
              <TreeSelect.ItemContent>app.js</TreeSelect.ItemContent>
            </TreeSelect.Item>
          </TreeSelect.Item>
          <TreeSelect.Item id="readme" textValue="README.md">
            <TreeSelect.ItemContent>README.md</TreeSelect.ItemContent>
          </TreeSelect.Item>
        </TreeSelect>
      </Provider>
    );

    const tree = await openTreeSelect(user);

    expect(within(tree).getByText('app.js')).toBeInTheDocument();

    await user.click(within(tree).getByText('app.js'));

    expect(getTrigger()).toHaveTextContent('app.js');
  });

  it('keeps selection, expansion, and overlay state in useTreeSelectState', () => {
    const { result } = renderHook(() =>
      useTreeSelectState<FileItem>({
        items: data,
        defaultSelectedKey: 'readme',
        defaultExpandedKeys: ['config'],
      })
    );

    expect(result.current.selectedKey).toBe('readme');
    expect(result.current.selectedNode?.name).toBe('README.md');
    expect(result.current.selectedKeys).toEqual(new Set(['readme']));
    expect(result.current.expandedKeys).toEqual(new Set(['config']));

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.setSelectedKey('config-app');
    });

    expect(result.current.selectedKey).toBe('config-app');
    expect(result.current.selectedNode?.name).toBe('app.js');
  });
});
