import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';
import { DropdownMenu } from '../DropdownMenu';
import { Menu } from '../Menu';
import { Select } from '../Select';
import { SelectNext } from '../SelectNext';
import { Tooltip } from '../Tooltip';
import { Tree } from '../Tree';

import { List } from './index';

describe('overflow tooltip in list items', () => {
  // With the mocks below, a string longer than 10 characters is cut off.
  const label = 'A long description of a security incident';
  const user = userEvent.setup();

  // Menus and selects hide everything outside their popover from assistive
  // technology, the tooltip included.
  const findTooltip = () => screen.findByRole('tooltip', { hidden: true });
  const queryTooltip = () => screen.queryByRole('tooltip', { hidden: true });

  beforeEach(() => {
    // Without PointerEvent, React Aria falls back to mouse events in jsdom.
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

  it('keeps selection and keyboard navigation in List', async () => {
    const onSelectionChange = vi.fn();

    render(
      <List
        aria-label="Incidents"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      >
        <List.Item key="long" textValue={label}>
          <List.ItemText showOverflowTooltip>{label}</List.ItemText>
        </List.Item>
        <List.Item key="short" textValue="Short">
          <List.ItemText showOverflowTooltip>Short</List.ItemText>
        </List.Item>
      </List>
    );

    const option = screen.getByRole('option', { name: label });

    await user.hover(option);
    expect(await findTooltip()).toHaveTextContent(label);

    await user.click(option);

    expect([...onSelectionChange.mock.calls[0]![0]]).toEqual(['long']);
    expect(option).toHaveFocus();

    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('option', { name: 'Short' })).toHaveFocus();
  });

  it('keeps actions in Menu', async () => {
    const onAction = vi.fn();

    render(
      <Menu aria-label="Actions" onAction={onAction} defaultOpen>
        <Menu.Item key="long" textValue={label}>
          <Menu.ItemText showOverflowTooltip>{label}</Menu.ItemText>
        </Menu.Item>
      </Menu>
    );

    const item = screen.getByRole('menuitem');

    await user.hover(item);
    expect(await findTooltip()).toHaveTextContent(label);

    await user.click(item);

    expect(onAction).toHaveBeenCalledWith('long');
    await waitFor(() => expect(queryTooltip()).not.toBeInTheDocument());
  });

  it.each(['Select', 'SelectNext'])(
    'keeps selection and closes the popup in %s',
    async (name) => {
      const onSelectionChange = vi.fn();

      const props = { label: 'Incident', defaultOpen: true, onSelectionChange };

      render(
        name === 'Select' ? (
          <Select {...props}>
            <Select.Item key="long" textValue={label}>
              <Select.ItemText showOverflowTooltip>{label}</Select.ItemText>
            </Select.Item>
          </Select>
        ) : (
          <SelectNext {...props}>
            <SelectNext.Item id="long" textValue={label}>
              <SelectNext.ItemText showOverflowTooltip>
                {label}
              </SelectNext.ItemText>
            </SelectNext.Item>
          </SelectNext>
        )
      );

      const option = screen.getByRole('option');

      await user.hover(option);
      expect(await findTooltip()).toHaveTextContent(label);

      await user.click(option);

      expect(onSelectionChange).toHaveBeenCalled();

      await waitFor(() =>
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      );

      await waitFor(() => expect(queryTooltip()).not.toBeInTheDocument());
    }
  );

  describe('DropdownMenu', () => {
    const shareLabel = `Share ${label}`;
    const onAction = vi.fn();

    const renderMenu = async () => {
      render(
        <DropdownMenu>
          <Button>Actions</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Content onAction={onAction}>
              <DropdownMenu.Item id="copy" textValue={label}>
                <DropdownMenu.ItemText showOverflowTooltip>
                  {label}
                </DropdownMenu.ItemText>
              </DropdownMenu.Item>
              <DropdownMenu.SubmenuTrigger>
                <DropdownMenu.Item id="share" textValue={shareLabel}>
                  <DropdownMenu.ItemText showOverflowTooltip>
                    {shareLabel}
                  </DropdownMenu.ItemText>
                </DropdownMenu.Item>
                <DropdownMenu.Popover>
                  <DropdownMenu.Content onAction={onAction}>
                    <DropdownMenu.Item id="email">Email</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Popover>
              </DropdownMenu.SubmenuTrigger>
            </DropdownMenu.Content>
          </DropdownMenu.Popover>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button', { name: 'Actions' }));

      return {
        item: screen.getByRole('menuitem', { name: label }),
        trigger: screen.getByRole('menuitem', { name: shareLabel }),
      };
    };

    beforeEach(() => {
      onAction.mockClear();
    });

    it('places the tooltip above a submenu trigger and keeps the submenu working', async () => {
      const { item, trigger } = await renderMenu();

      await user.hover(item);
      expect(await findTooltip()).toHaveAttribute('data-placement', 'right');

      await user.hover(trigger);

      const tooltip = await findTooltip();

      expect(tooltip).toHaveTextContent(shareLabel);
      expect(tooltip).toHaveAttribute('data-placement', 'top');
      expect(screen.getAllByRole('tooltip', { hidden: true })).toHaveLength(1);

      await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2), {
        timeout: 2000,
      });

      await user.click(screen.getByRole('menuitem', { name: 'Email' }));

      expect(onAction).toHaveBeenCalledWith('email');
    });

    it('keeps keyboard navigation into a submenu', async () => {
      const { trigger } = await renderMenu();

      await user.hover(trigger);
      expect(await findTooltip()).toBeInTheDocument();

      // Each key needs its own call: sent in one batch, ArrowRight lands before
      // focus has settled on the submenu trigger.
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowRight}');

      await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2));
      expect(screen.getByRole('menuitem', { name: 'Email' })).toHaveFocus();
    });
  });

  it('keeps selection in Tree', async () => {
    const onSelectionChange = vi.fn();

    render(
      <Tree
        aria-label="Files"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      >
        <Tree.Item id="long" textValue={label}>
          <Tree.ItemContent>
            <Tree.ItemContentText showOverflowTooltip>
              {label}
            </Tree.ItemContentText>
          </Tree.ItemContent>
        </Tree.Item>
      </Tree>
    );

    const row = screen.getByRole('row');

    await user.hover(row);

    const tooltip = await findTooltip();

    expect(tooltip).toHaveTextContent(label);
    // Placement is only computed when the tooltip has the row to anchor to.
    expect(tooltip).toHaveAttribute('data-placement', 'right');

    await user.click(row);

    expect([...onSelectionChange.mock.calls[0]![0]]).toEqual(['long']);
  });

  it.each([false, true])(
    'keeps a custom tooltip inside the item working (showOverflowTooltip: %s)',
    async (showOverflowTooltip) => {
      render(
        <List aria-label="Incidents">
          <List.Item key="long" textValue={label}>
            <List.ItemAddon>
              <Tooltip
                control={(props) => (
                  <span {...props} data-testid="icon">
                    Icon
                  </span>
                )}
              >
                Custom tooltip
              </Tooltip>
            </List.ItemAddon>
            <List.ItemText showOverflowTooltip={showOverflowTooltip}>
              {label}
            </List.ItemText>
          </List.Item>
        </List>
      );

      // React Aria opens a tooltip on hover only after a pointer interaction.
      fireEvent.pointerMove(document.body);
      await user.hover(screen.getByTestId('icon'));

      const getTexts = () =>
        screen.getAllByRole('tooltip').map((tooltip) => tooltip.textContent);

      await waitFor(() =>
        expect(getTexts()).toEqual(
          expect.arrayContaining(
            showOverflowTooltip ? ['Custom tooltip', label] : ['Custom tooltip']
          )
        )
      );

      expect(getTexts()).toHaveLength(showOverflowTooltip ? 2 : 1);
    }
  );
});
