import { render, screen, within } from '@testing-library/react';
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
  class ResizeObserverMock {
    observe = vi.fn();

    unobserve = vi.fn();

    disconnect = vi.fn();
  }

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

  it('should render default tags with the selected item text when renderTag is not provided', () => {
    render(renderComponent({ value: [1, 3] }));

    const selectedItems = screen.getByLabelText('Selected items');

    expect(selectedItems).toHaveTextContent('1');
    expect(selectedItems).toHaveTextContent('3');
  });

  it('should use renderTag to customize selected tags', () => {
    render(
      renderComponent({
        value: [1, 3],
        renderTag: (item, tagProps) => (
          <div data-testid={`custom-tag-${item.key}`} {...tagProps}>
            {item.key}
          </div>
        ),
      })
    );

    expect(screen.getByTestId('custom-tag-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-tag-3')).toBeInTheDocument();
  });

  it('should render Select.Tag inside renderTag and support removing via its button', async () => {
    const onChange = vi.fn();

    render(
      renderComponent({
        value: [1, 3],
        onChange,
        defaultOpen: false,
        renderTag: (item, tagProps) => (
          <Select.Tag {...tagProps} data-testid={`tag-${item.key}`}>
            {item.key}
          </Select.Tag>
        ),
      })
    );

    expect(screen.getByTestId('tag-1')).toHaveTextContent('1');
    expect(screen.getByTestId('tag-3')).toHaveTextContent('3');

    await userEvent.click(
      within(screen.getByTestId('tag-1')).getByRole('button', {
        hidden: true,
      })
    );

    expect(onChange).toHaveBeenCalled();

    const selection = onChange.mock.calls.at(-1)?.[0];

    expect([...selection]).toEqual([3]);
  });

  it('should ignore renderTag when renderValue is provided', () => {
    render(
      renderComponent({
        value: [1, 3],
        renderValue: () => <div data-testid="custom-value">custom value</div>,
        renderTag: (item) => (
          <div data-testid={`custom-tag-${item.key}`}>{item.key}</div>
        ),
      })
    );

    expect(screen.getByTestId('custom-value')).toBeInTheDocument();
    expect(screen.queryByTestId('custom-tag-1')).not.toBeInTheDocument();
  });
});
