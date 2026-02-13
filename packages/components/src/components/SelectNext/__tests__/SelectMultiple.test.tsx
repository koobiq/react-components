import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest';

import { SelectNext as Select } from '../Select';
import type { SelectNextProps as SelectProps } from '../types';

const renderComponent = (
  props: Omit<SelectProps<{ key: number }, 'multiple'>, 'children'>
) => {
  const options = [{ key: 1 }, { key: 2 }, { key: 3 }];

  return (
    <Select
      label="Select"
      items={options}
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
    const onChange = vi.fn();

    render(
      renderComponent({
        onChange,
        value: [1, 3],
      })
    );

    const second = screen.getByTestId('option-2');

    if (second) await userEvent.click(second);

    const selection = onChange.mock.calls?.[0]?.[0];

    expect([...selection]).toEqual([1, 3, 2]);
  });

  it('should not trigger onChange when clicking a disabled item', async () => {
    const onChange = vi.fn();

    render(
      renderComponent({
        value: [1, 3],
        onChange,
        disabledKeys: [1],
      })
    );

    const first = screen.getByTestId('option-1');

    if (first) await userEvent.click(first);

    expect(onChange).toBeCalledTimes(0);
  });
});
