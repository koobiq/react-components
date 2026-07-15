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

  it('should not update selection when an item is clicked in read-only state', async () => {
    const onChange = vi.fn();

    render(
      renderComponent({
        value: [1, 3],
        onChange,
        isReadOnly: true,
      })
    );

    await userEvent.click(screen.getByTestId('option-2'));

    const selectedItems = screen.getByLabelText('Selected items');

    expect(onChange).not.toHaveBeenCalled();
    expect(selectedItems).toHaveTextContent('1');
    expect(selectedItems).toHaveTextContent('3');
    expect(selectedItems).not.toHaveTextContent('2');
  });

  it('should render a disabled clear button in read-only state', async () => {
    const onChange = vi.fn();
    const onClear = vi.fn();

    render(
      renderComponent({
        value: [1, 3],
        onChange,
        onClear,
        isClearable: true,
        isReadOnly: true,
        slotProps: {
          clearButton: {
            'aria-label': 'clear-button',
          },
        },
      })
    );

    const clearButton = screen.getByLabelText('clear-button');

    expect(clearButton).toBeInTheDocument();
    expect(clearButton).not.toHaveAttribute('aria-hidden', 'true');
    expect(clearButton).toBeDisabled();

    await userEvent.click(clearButton);

    expect(onChange).not.toHaveBeenCalled();
    expect(onClear).not.toHaveBeenCalled();
  });

  it.each(['responsive', 'multiline'] as const)(
    'should render disabled tag remove actions with %s overflow in read-only state',
    (selectedTagsOverflow) => {
      render(
        renderComponent({
          value: [1, 3],
          defaultOpen: false,
          isReadOnly: true,
          selectedTagsOverflow,
        })
      );

      const removeButtons = within(
        screen.getByLabelText('Selected items')
      ).getAllByRole('button', { hidden: true });

      expect(removeButtons).toHaveLength(2);

      removeButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).toHaveAttribute('data-disabled', 'true');
      });
    }
  );

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
        renderTag: (item, { className, ref, 'aria-hidden': ariaHidden }) => (
          <div
            ref={ref}
            className={className}
            aria-hidden={ariaHidden}
            data-testid={`custom-tag-${item.key}`}
          >
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
