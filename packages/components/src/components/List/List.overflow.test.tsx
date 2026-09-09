import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Menu } from '../Menu';
import { Select } from '../Select';
import { SelectNext } from '../SelectNext';

import { List } from './index';

describe('overflow tooltips in list items', () => {
  const label = 'A long description of a security incident';
  const user = userEvent.setup();

  const hover = async (element: HTMLElement) => {
    fireEvent.pointerMove(element, { pointerType: 'mouse' });
    fireEvent.mouseMove(element);
    await user.hover(element);
  };

  beforeEach(() => {
    // Exercise the browser path: React Aria's jsdom mouse fallback stops
    // mouseenter propagation at the pressable option before reaching its text.
    class PointerEventMock extends MouseEvent {
      pointerType: string;
      pointerId: number;

      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerType = init.pointerType ?? 'mouse';
        this.pointerId = init.pointerId ?? 1;
      }
    }

    vi.stubGlobal('PointerEvent', PointerEventMock);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);

    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(
      function (this: HTMLElement) {
        return (this.textContent?.length ?? 0) * 10;
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('shows a tooltip for ItemText and preserves selection and keyboard navigation', async () => {
    const onSelectionChange = vi.fn();

    render(
      <List
        aria-label="Incidents"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      >
        <List.Item key="long">
          <List.ItemText>{label}</List.ItemText>
        </List.Item>
        <List.Item key="short">
          <List.ItemText>Short</List.ItemText>
        </List.Item>
      </List>
    );

    const option = screen.getByRole('option', { name: label });
    expect(option).toHaveAttribute('data-slot', 'list-item');
    await hover(within(option).getByText(label));
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(label);
    expect(tooltip).toHaveStyle({ pointerEvents: 'none' });

    fireEvent.pointerLeave(option);

    await waitFor(() =>
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    );

    await user.click(within(option).getByText(label));
    expect([...onSelectionChange.mock.calls[0]![0]]).toEqual(['long']);
    expect(option).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Short' })).toHaveFocus();
  });

  it('shows unavailable text without selecting the disabled item', async () => {
    const onSelectionChange = vi.fn();

    render(
      <List
        aria-label="Incidents"
        selectionMode="single"
        disabledKeys={['long']}
        onSelectionChange={onSelectionChange}
      >
        <List.Item key="long">
          <List.ItemText>{label}</List.ItemText>
        </List.Item>
      </List>
    );

    await hover(screen.getByText(label));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(label);
    await user.click(within(screen.getByRole('option')).getByText(label));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('does not attach a second tooltip to compound content', async () => {
    render(
      <List aria-label="Incidents">
        <List.Item key="long" textValue={label}>
          <List.ItemAddon>Icon</List.ItemAddon>
          <List.ItemText hideTooltip>{label}</List.ItemText>
        </List.Item>
        <List.Item key="number">1234567890123</List.Item>
      </List>
    );

    await hover(screen.getByText(label));
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await hover(screen.getByText('Icon'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not add a tooltip to plain item content', async () => {
    render(
      <List aria-label="Identifiers">
        <List.Item key="id">{label}</List.Item>
      </List>
    );

    await hover(screen.getByText(label));
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('preserves menu actions when the text has an overflow tooltip', async () => {
    const onAction = vi.fn();

    render(
      <Menu aria-label="Actions" onAction={onAction} defaultOpen>
        <Menu.Item key="long" textValue={label}>
          <Menu.ItemText>{label}</Menu.ItemText>
        </Menu.Item>
      </Menu>
    );

    await hover(screen.getByText(label));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(label);
    await user.click(within(screen.getByRole('menuitem')).getByText(label));
    expect(onAction).toHaveBeenCalledWith('long');
  });

  it.each(['Select', 'SelectNext'])(
    'preserves single selection and popup dismissal in %s',
    async (name) => {
      const onSelectionChange = vi.fn();

      const props = { label: 'Incident', defaultOpen: true, onSelectionChange };

      render(
        name === 'Select' ? (
          <Select {...props}>
            <Select.Item key="long" textValue={label}>
              <Select.ItemText>{label}</Select.ItemText>
            </Select.Item>
          </Select>
        ) : (
          <SelectNext {...props}>
            <SelectNext.Item id="long" textValue={label}>
              <SelectNext.ItemText>{label}</SelectNext.ItemText>
            </SelectNext.Item>
          </SelectNext>
        )
      );

      const option = screen.getByRole('option');
      await hover(within(option).getByText(label));
      expect(await screen.findByRole('tooltip')).toHaveTextContent(label);
      await user.click(within(option).getByText(label));
      expect(onSelectionChange).toHaveBeenCalled();

      await waitFor(() =>
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      );

      await waitFor(() =>
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      );
    }
  );
});
