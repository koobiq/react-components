import { useTreeSelectState } from '@koobiq/react-primitives';
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
import type { TreeSelectNode } from './types';

const data: TreeSelectNode[] = [
  {
    id: 'config',
    label: 'config',
    children: [
      { id: 'config-app', label: 'app.js' },
      { id: 'config-db', label: 'database.js' },
    ],
  },
  { id: 'readme', label: 'README.md' },
];

function renderTreeSelect(
  props: Partial<React.ComponentProps<typeof TreeSelect>> = {}
) {
  return render(
    <Provider>
      <TreeSelect aria-label="Files" items={data} {...props} />
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

    // A child of the expanded "config" branch is visible from the start.
    expect(within(tree).getByText('app.js')).toBeInTheDocument();
  });

  it('lets the user expand a collapsed branch', async () => {
    const user = userEvent.setup();
    renderTreeSelect();

    const tree = await openTreeSelect(user);

    // Collapsed by default → child hidden.
    expect(within(tree).queryByText('app.js')).not.toBeInTheDocument();

    // Click the chevron (the only button inside the "config" row).
    const configRow = within(tree).getByText('config').closest('[role="row"]');
    await user.click(within(configRow as HTMLElement).getByRole('button'));

    expect(within(tree).getByText('app.js')).toBeInTheDocument();
  });

  it('filters the tree as you type', async () => {
    const user = userEvent.setup();
    renderTreeSelect();

    await openTreeSelect(user);
    await user.type(screen.getByRole('searchbox'), 'README');

    const tree = screen.getByRole('treegrid');

    expect(within(tree).getByText('README.md')).toBeInTheDocument();
    expect(within(tree).queryByText('config')).not.toBeInTheDocument();
  });

  it('shows the no-results text when nothing matches', async () => {
    const user = userEvent.setup();
    renderTreeSelect({ noResultsText: 'No matches' });

    await openTreeSelect(user);
    await user.type(screen.getByRole('searchbox'), 'zzz');

    expect(screen.getByText('No matches')).toBeInTheDocument();
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

  it('keeps the selection when the selected node is filtered out — without warning', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const user = userEvent.setup();
    renderTreeSelect();

    // Select a top-level leaf, then filter it out of the collection.
    let tree = await openTreeSelect(user);
    await user.click(within(tree).getByText('README.md'));

    await waitFor(() =>
      expect(screen.queryByRole('treegrid')).not.toBeInTheDocument()
    );

    tree = await openTreeSelect(user);
    await user.type(screen.getByRole('searchbox'), 'config');
    expect(within(tree).queryByText('README.md')).not.toBeInTheDocument();

    // No controlled/uncontrolled or "key not in collection" complaints.
    expect(errSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();

    // Clear the query → the node reappears and is still selected.
    await user.clear(screen.getByRole('searchbox'));

    expect(
      within(tree).getByText('README.md').closest('[role="row"]')
    ).toHaveAttribute('aria-selected', 'true');

    vi.restoreAllMocks();
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
            config
            <TreeSelect.Item id="config-app" textValue="app.js">
              app.js
            </TreeSelect.Item>
          </TreeSelect.Item>
          <TreeSelect.Item id="readme" textValue="README.md">
            README.md
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
      useTreeSelectState({
        items: data,
        defaultSelectedKey: 'readme',
        defaultExpandedKeys: ['config'],
      })
    );

    expect(result.current.selectedKey).toBe('readme');
    expect(result.current.selectedNode?.label).toBe('README.md');
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
    expect(result.current.selectedNode?.label).toBe('app.js');
  });
});
