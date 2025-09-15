import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest';

import { Select } from '../Select';
import type { SelectProps } from '../types';

const renderComponent = (
  props: Omit<SelectProps<{ key: number }>, 'children'>
) => {
  const options = [{ key: 1 }, { key: 2 }, { key: 3 }];

  return (
    <Select
      items={options}
      label="Select"
      selectionMode="multiple"
      defaultOpen
      {...props}
    >
      {(item) => (
        <Select.Item
          data-testid={`option-${item.key}`}
          textValue={String(item.key)}
        >
          {item.key}
        </Select.Item>
      )}
    </Select>
  );
};

describe('Select_multiple', () => {
  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('should update selection when a different item is clicked', async () => {
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        onSelectionChange,
        selectedKeys: [1, 3],
      })
    );

    const second = screen.getByTestId('option-2');

    if (second) await userEvent.click(second);

    const selection = onSelectionChange.mock.calls?.[0]?.[0];

    expect([...selection]).toEqual([1, 3, 2]);
  });

  it('should not trigger onSelectionChange when clicking a disabled item', async () => {
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        selectedKeys: [1, 3],
        onSelectionChange,
        disabledKeys: [1],
      })
    );

    const first = screen.getByTestId('option-1');

    if (first) await userEvent.click(first);

    expect(onSelectionChange).toBeCalledTimes(0);
  });
});
