import { useState } from 'react';

import { once } from '@koobiq/logger';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';

import { DropdownMenu, dropdownMenuPropTrigger } from './index.js';

const onAction = vi.fn();
const onOpenChange = vi.fn((value) => value);
const onSelectionChange = vi.fn();
const onInputChange = vi.fn();

const getControl = () => screen.getByTestId('control');
const getMenu = () => screen.getByRole('menu');
const queryMenu = () => screen.queryByRole('menu');
const getItems = () => screen.getAllByRole('menuitem');

const open = async () => {
  await userEvent.click(getControl());
  await screen.findByRole('menu');
};

type FixtureProps = {
  contentProps?: Record<string, unknown>;
  popoverProps?: Record<string, unknown>;
  rootProps?: Record<string, unknown>;
};

function Fixture({ contentProps, popoverProps, rootProps }: FixtureProps = {}) {
  return (
    <DropdownMenu onOpenChange={onOpenChange} {...rootProps}>
      <Button data-testid="control">Actions</Button>
      <DropdownMenu.Popover data-testid="popover" {...popoverProps}>
        <DropdownMenu.Content onAction={onAction} {...contentProps}>
          <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
          <DropdownMenu.Item id="paste">Paste</DropdownMenu.Item>
          <DropdownMenu.Item id="delete">Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Popover>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('rendering', () => {
    it('should not render the menu until the trigger is pressed', () => {
      render(<Fixture />);

      expect(queryMenu()).not.toBeInTheDocument();
    });

    it('should open on trigger press and render a menu', async () => {
      render(<Fixture />);
      await open();

      expect(getMenu()).toBeInTheDocument();
    });

    it('should render every item as a menuitem', async () => {
      render(<Fixture />);
      await open();

      expect(getItems()).toHaveLength(3);
      expect(getItems()[0]).toHaveTextContent('Copy');
    });

    it('should forward a ref to the popover element', async () => {
      const ref = { current: null } as { current: HTMLElement | null };

      render(<Fixture popoverProps={{ ref }} />);
      await open();

      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current).toContainElement(getMenu());
    });

    it('should merge a custom className into the popover', async () => {
      render(<Fixture popoverProps={{ className: 'custom' }} />);
      await open();

      expect(screen.getByTestId('popover')).toHaveClass('custom');
    });

    it('should apply data-testid to the popover', async () => {
      render(<Fixture />);
      await open();

      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });
  });

  describe('open state', () => {
    it('should be open by default with defaultOpen', async () => {
      render(<Fixture rootProps={{ defaultOpen: true }} />);

      expect(await screen.findByRole('menu')).toBeInTheDocument();
    });

    it('should respect the controlled isOpen prop', async () => {
      render(<Fixture rootProps={{ isOpen: true }} />);

      expect(await screen.findByRole('menu')).toBeInTheDocument();
    });

    it('should stay closed when isOpen is false', async () => {
      render(<Fixture rootProps={{ isOpen: false }} />);
      await userEvent.click(getControl());

      expect(queryMenu()).not.toBeInTheDocument();
    });

    it('should call onOpenChange when opening and closing', async () => {
      render(<Fixture />);
      await open();

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange.mock.results[0]?.value).toBe(true);

      await userEvent.keyboard('{Escape}');

      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange.mock.results[1]?.value).toBe(false);
    });

    it('should close on Escape', async () => {
      render(<Fixture />);
      await open();
      await userEvent.keyboard('{Escape}');

      await waitFor(() => expect(queryMenu()).not.toBeInTheDocument());
    });

    it('should close on an outside press', async () => {
      render(
        <>
          <button data-testid="outside" type="button">
            outside
          </button>
          <Fixture />
        </>
      );

      await open();
      await userEvent.click(screen.getByTestId('outside'));

      await waitFor(() => expect(queryMenu()).not.toBeInTheDocument());
    });

    it.each(dropdownMenuPropTrigger)(
      'should open with the "%s" trigger',
      async (trigger) => {
        // jsdom has no PointerEvent and the long press behaviour dispatches
        // one. Stub it only here: with it defined, `usePress` switches to the
        // pointer event path for every interaction in the test.
        if (trigger === 'longPress' && !('PointerEvent' in window)) {
          vi.stubGlobal('PointerEvent', class extends Event {});
        }

        render(<Fixture rootProps={{ trigger }} />);

        if (trigger === 'longPress') {
          await userEvent.pointer({ keys: '[TouchA>]', target: getControl() });

          await new Promise((resolve) => {
            setTimeout(resolve, 600);
          });

          await userEvent.pointer({ keys: '[/TouchA]', target: getControl() });
        } else {
          await userEvent.click(getControl());
        }

        expect(await screen.findByRole('menu')).toBeInTheDocument();
      }
    );
  });

  describe('keyboard navigation', () => {
    it('should focus the first item on ArrowDown from the trigger', async () => {
      render(<Fixture />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');

      expect(await screen.findByRole('menu')).toBeInTheDocument();
      expect(getItems()[0]).toHaveFocus();
    });

    it('should focus the last item on ArrowUp from the trigger', async () => {
      render(<Fixture />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowUp}');

      expect(await screen.findByRole('menu')).toBeInTheDocument();
      expect(getItems()[2]).toHaveFocus();
    });

    it('should move focus between items with the arrow keys', async () => {
      render(<Fixture />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');

      expect(getItems()[1]).toHaveFocus();
    });

    it('should skip disabled items during arrow navigation', async () => {
      render(<Fixture contentProps={{ disabledKeys: ['paste'] }} />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');

      expect(getItems()[2]).toHaveFocus();
    });

    it('should select the focused item on Enter and close the menu', async () => {
      render(<Fixture />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');

      expect(onAction).toHaveBeenCalledWith('copy');
      await waitFor(() => expect(queryMenu()).not.toBeInTheDocument());
    });

    it('should support typeahead using textValue', async () => {
      render(<Fixture />);
      await open();
      await userEvent.keyboard('pas');

      expect(getItems()[1]).toHaveFocus();
    });
  });

  describe('actions and selection', () => {
    it('should call onAction with the item id', async () => {
      render(<Fixture />);
      await open();
      await userEvent.click(getItems()[1]!);

      expect(onAction).toHaveBeenCalledWith('paste');
    });

    it('should not call onAction for an item in disabledKeys', async () => {
      render(<Fixture contentProps={{ disabledKeys: ['paste'] }} />);
      await open();
      await userEvent.click(getItems()[1]!);

      expect(onAction).not.toHaveBeenCalled();
    });

    it('should not call onAction for an item with isDisabled', async () => {
      render(
        <DropdownMenu>
          <Button data-testid="control">Actions</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Content onAction={onAction}>
              <DropdownMenu.Item id="copy" isDisabled>
                Copy
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Popover>
        </DropdownMenu>
      );

      await open();
      await userEvent.click(getItems()[0]!);

      expect(onAction).not.toHaveBeenCalled();
    });

    it('should support single selection', async () => {
      render(
        <Fixture
          contentProps={{ selectionMode: 'single', onSelectionChange }}
        />
      );

      await open();

      await userEvent.click(
        screen.getByRole('menuitemradio', { name: 'Paste' })
      );

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect([...onSelectionChange.mock.calls[0]![0]]).toStrictEqual(['paste']);
    });

    it('should keep the menu open in multiple selection mode', async () => {
      render(
        <Fixture
          contentProps={{ selectionMode: 'multiple', onSelectionChange }}
        />
      );

      await open();

      await userEvent.click(
        screen.getByRole('menuitemcheckbox', { name: 'Copy' })
      );

      await userEvent.click(
        screen.getByRole('menuitemcheckbox', { name: 'Paste' })
      );

      expect(getMenu()).toBeInTheDocument();
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
    });

    it('should mark the selected item with aria-checked', async () => {
      render(
        <Fixture
          contentProps={{
            selectionMode: 'single',
            defaultSelectedKeys: ['paste'],
          }}
        />
      );

      await open();

      expect(
        screen.getByRole('menuitemradio', { name: 'Paste' })
      ).toBeChecked();
    });

    it('should not close on select when shouldCloseOnSelect is false', async () => {
      render(<Fixture contentProps={{ shouldCloseOnSelect: false }} />);
      await open();
      await userEvent.click(getItems()[0]!);

      expect(onAction).toHaveBeenCalledWith('copy');
      expect(getMenu()).toBeInTheDocument();
    });

    it('should render items with href as links', async () => {
      render(
        <DropdownMenu>
          <Button data-testid="control">Actions</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Content>
              <DropdownMenu.Item href="https://koobiq.io" target="_blank">
                Koobiq
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Popover>
        </DropdownMenu>
      );

      await open();

      expect(getItems()[0]).toHaveAttribute('href', 'https://koobiq.io');
    });
  });

  describe('sections, headers and separators', () => {
    const renderSections = () =>
      render(
        <DropdownMenu>
          <Button data-testid="control">Actions</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Content>
              <DropdownMenu.Section title="Edit">
                <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
              </DropdownMenu.Section>
              <DropdownMenu.Separator />
              <DropdownMenu.Section>
                <DropdownMenu.Header>Danger</DropdownMenu.Header>
                <DropdownMenu.Item id="delete">Delete</DropdownMenu.Item>
              </DropdownMenu.Section>
            </DropdownMenu.Content>
          </DropdownMenu.Popover>
        </DropdownMenu>
      );

    it('should render a section labelled by its title', async () => {
      renderSections();
      await open();

      const group = screen.getByRole('group', { name: 'Edit' });

      expect(within(group).getByRole('menuitem')).toHaveTextContent('Copy');
    });

    it('should use a custom Header as the group heading', async () => {
      renderSections();
      await open();

      expect(screen.getByRole('group', { name: 'Danger' })).toBeInTheDocument();
    });

    it('should render a separator', async () => {
      renderSections();
      await open();

      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('should keep a selection mode per section', async () => {
      render(
        <DropdownMenu>
          <Button data-testid="control">Styles</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Content>
              <DropdownMenu.Section title="Actions">
                <DropdownMenu.Item id="cut">Cut</DropdownMenu.Item>
              </DropdownMenu.Section>
              <DropdownMenu.Section
                title="Text style"
                selectionMode="multiple"
                onSelectionChange={onSelectionChange}
              >
                <DropdownMenu.Item id="bold">Bold</DropdownMenu.Item>
                <DropdownMenu.Item id="italic">Italic</DropdownMenu.Item>
              </DropdownMenu.Section>
              <DropdownMenu.Section
                title="Text alignment"
                selectionMode="single"
              >
                <DropdownMenu.Item id="left">Left</DropdownMenu.Item>
              </DropdownMenu.Section>
            </DropdownMenu.Content>
          </DropdownMenu.Popover>
        </DropdownMenu>
      );

      await open();

      expect(screen.getByRole('menuitem')).toHaveTextContent('Cut');
      expect(screen.getAllByRole('menuitemcheckbox')).toHaveLength(2);
      expect(screen.getByRole('menuitemradio')).toHaveTextContent('Left');

      await userEvent.click(screen.getAllByRole('menuitemcheckbox')[0]);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect([...onSelectionChange.mock.calls[0]![0]]).toStrictEqual(['bold']);
    });
  });

  describe('item content', () => {
    const renderComposed = (textValue?: string) =>
      render(
        <DropdownMenu>
          <Button data-testid="control">Actions</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Content>
              <DropdownMenu.Item id="copy" textValue={textValue}>
                <DropdownMenu.ItemAddon data-testid="start-addon">
                  +
                </DropdownMenu.ItemAddon>
                <DropdownMenu.ItemText caption="Copy to clipboard">
                  Copy
                </DropdownMenu.ItemText>
                <DropdownMenu.ItemAddon>⌘C</DropdownMenu.ItemAddon>
              </DropdownMenu.Item>
              <DropdownMenu.Item id="cut" textValue="Cut">
                <DropdownMenu.ItemText>Cut</DropdownMenu.ItemText>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Popover>
        </DropdownMenu>
      );

    it('should render addons and text inside an item', async () => {
      renderComposed();
      await open();

      expect(screen.getByTestId('start-addon')).toBeInTheDocument();
      expect(getItems()[0]).toHaveTextContent('Copy to clipboard');
      expect(getItems()[0]).toHaveTextContent('⌘C');
    });

    it('should support typeahead through an explicit textValue', async () => {
      renderComposed('Duplicate');
      await open();
      await userEvent.keyboard('du');

      expect(getItems()[0]).toHaveFocus();
    });

    it('should warn when composed content comes without a textValue', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      once.clear();
      renderComposed();
      await open();

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('DropdownMenu.Item')
      );

      warn.mockRestore();
    });

    it('should not warn when a textValue is given', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      once.clear();
      renderComposed('Copy');
      await open();

      expect(warn).not.toHaveBeenCalled();

      warn.mockRestore();
    });
  });

  describe('submenu', () => {
    const renderSubmenu = () =>
      render(
        <DropdownMenu>
          <Button data-testid="control">Actions</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Content onAction={onAction}>
              <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
              <DropdownMenu.SubmenuTrigger>
                <DropdownMenu.Item id="share">Share</DropdownMenu.Item>
                <DropdownMenu.Popover>
                  <DropdownMenu.Content onAction={onAction}>
                    <DropdownMenu.Item id="email">Email</DropdownMenu.Item>
                    <DropdownMenu.Item id="sms">SMS</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Popover>
              </DropdownMenu.SubmenuTrigger>
            </DropdownMenu.Content>
          </DropdownMenu.Popover>
        </DropdownMenu>
      );

    it('should mark the trigger item as having a submenu', async () => {
      renderSubmenu();
      await open();

      const trigger = screen.getByRole('menuitem', { name: /Share/ });

      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger).toHaveAttribute('data-has-submenu', 'true');
    });

    // Each key needs its own call: sent in one batch, ArrowRight lands before
    // focus has settled on the submenu trigger.
    const focusSubmenuTrigger = async () => {
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowDown}');
    };

    const openSubmenu = async () => {
      await focusSubmenuTrigger();
      await userEvent.keyboard('{ArrowRight}');
      await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2));
    };

    it('should open the submenu on ArrowRight and focus its first item', async () => {
      renderSubmenu();
      await open();
      await openSubmenu();

      expect(screen.getByRole('menuitem', { name: 'Email' })).toHaveFocus();
    });

    it('should close the submenu on ArrowLeft and keep the menu open', async () => {
      renderSubmenu();
      await open();
      await openSubmenu();

      await userEvent.keyboard('{ArrowLeft}');

      await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(1));
      expect(screen.getByRole('menuitem', { name: /Share/ })).toHaveFocus();
    });

    it('should open the submenu on hover after the delay', async () => {
      renderSubmenu();
      await open();
      await userEvent.hover(screen.getByRole('menuitem', { name: /Share/ }));

      await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2), {
        timeout: 2000,
      });
    });

    it('should call onAction and close both menus on a submenu selection', async () => {
      renderSubmenu();
      await open();
      await openSubmenu();

      await userEvent.keyboard('{Enter}');

      expect(onAction).toHaveBeenCalledWith('email');
      await waitFor(() => expect(queryMenu()).not.toBeInTheDocument());
    });
  });

  describe('search', () => {
    const renderSearchable = (menuProps?: Record<string, unknown>) =>
      render(
        <DropdownMenu>
          <Button data-testid="control">Actions</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Autocomplete>
              <DropdownMenu.SearchInput />
              <DropdownMenu.Content {...menuProps}>
                <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
                <DropdownMenu.Item id="paste">Paste</DropdownMenu.Item>
                <DropdownMenu.SubmenuTrigger>
                  <DropdownMenu.Item id="share">Share</DropdownMenu.Item>
                  <DropdownMenu.Popover>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item id="email">Email</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Popover>
                </DropdownMenu.SubmenuTrigger>
              </DropdownMenu.Content>
            </DropdownMenu.Autocomplete>
          </DropdownMenu.Popover>
        </DropdownMenu>
      );

    const getSearch = () => screen.getByRole('searchbox');

    it('should not render a search input on its own', async () => {
      render(<Fixture />);
      await open();

      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });

    it('should render the search input inside an Autocomplete', async () => {
      renderSearchable();
      await open();

      expect(getSearch()).toBeInTheDocument();
    });

    it('should filter items by the query', async () => {
      renderSearchable();
      await open();
      await userEvent.type(getSearch(), 'pas');

      await waitFor(() => expect(getItems()).toHaveLength(1));
      expect(getItems()[0]).toHaveTextContent('Paste');
    });

    it('should ignore case and match diacritics loosely', async () => {
      renderSearchable();
      await open();
      await userEvent.type(getSearch(), 'COPY');

      await waitFor(() => expect(getItems()).toHaveLength(1));
      expect(getItems()[0]).toHaveTextContent('Copy');
    });

    it('should keep a submenu trigger whose text matches the query', async () => {
      renderSearchable();
      await open();
      await userEvent.type(getSearch(), 'sha');

      await waitFor(() => expect(getItems()).toHaveLength(1));
      expect(getItems()[0]).toHaveAttribute('data-has-submenu', 'true');
    });

    it('should show the empty state when nothing matches', async () => {
      renderSearchable();
      await open();
      await userEvent.type(getSearch(), 'zzz');

      expect(await screen.findByText('Nothing found')).toBeInTheDocument();
    });

    it('should render a custom noItemsText', async () => {
      renderSearchable({ noItemsText: 'No results' });
      await open();
      await userEvent.type(getSearch(), 'zzz');

      expect(await screen.findByText('No results')).toBeInTheDocument();
    });

    it('should keep DOM focus in the search input while navigating', async () => {
      renderSearchable();
      await open();
      await userEvent.keyboard('{ArrowDown}');

      expect(getSearch()).toHaveFocus();

      await waitFor(() =>
        expect(getSearch()).toHaveAttribute('aria-activedescendant')
      );
    });

    it('should clear the query on Escape before closing the menu', async () => {
      renderSearchable();
      await open();
      await userEvent.type(getSearch(), 'pas');
      await waitFor(() => expect(getItems()).toHaveLength(1));

      await userEvent.keyboard('{Escape}');

      expect(getSearch()).toHaveValue('');
      expect(getMenu()).toBeInTheDocument();
    });

    it('should reset the query after the menu is reopened', async () => {
      renderSearchable();
      await open();
      await userEvent.type(getSearch(), 'pas');
      await waitFor(() => expect(getItems()).toHaveLength(1));

      // The first Escape clears the query, the second closes the menu.
      await userEvent.keyboard('{Escape}{Escape}');
      await waitFor(() => expect(queryMenu()).not.toBeInTheDocument());
      await open();

      expect(getSearch()).toHaveValue('');
      expect(getItems()).toHaveLength(3);
    });

    it('should support a controlled inputValue', async () => {
      function Controlled() {
        const [value, setValue] = useState('pas');

        return (
          <DropdownMenu defaultOpen>
            <Button data-testid="control">Actions</Button>
            <DropdownMenu.Popover>
              <DropdownMenu.Autocomplete
                inputValue={value}
                onInputChange={(next) => {
                  onInputChange(next);
                  setValue(next);
                }}
              >
                <DropdownMenu.SearchInput />
                <DropdownMenu.Content>
                  <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
                  <DropdownMenu.Item id="paste">Paste</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Autocomplete>
            </DropdownMenu.Popover>
          </DropdownMenu>
        );
      }

      render(<Controlled />);
      await screen.findByRole('menu');

      expect(getSearch()).toHaveValue('pas');
      expect(getItems()).toHaveLength(1);

      await userEvent.clear(getSearch());

      expect(onInputChange).toHaveBeenCalled();
      await waitFor(() => expect(getItems()).toHaveLength(2));
    });

    it('should pass props to the search input', async () => {
      render(
        <DropdownMenu>
          <Button data-testid="control">Actions</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Autocomplete>
              <DropdownMenu.SearchInput placeholder="Find an action" />
              <DropdownMenu.Content>
                <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Autocomplete>
          </DropdownMenu.Popover>
        </DropdownMenu>
      );

      await open();

      expect(getSearch()).toHaveAttribute('placeholder', 'Find an action');
    });
  });

  describe('footer', () => {
    it('should render the footer content', async () => {
      render(
        <DropdownMenu>
          <Button data-testid="control">Actions</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Content>
              <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
            </DropdownMenu.Content>
            <DropdownMenu.Footer>Footer text</DropdownMenu.Footer>
          </DropdownMenu.Popover>
        </DropdownMenu>
      );

      await open();

      expect(screen.getByText('Footer text')).toBeInTheDocument();
    });
  });

  describe('placement', () => {
    it('should reflect the placement on the popover', async () => {
      render(<Fixture popoverProps={{ placement: 'top end' }} />);
      await open();

      expect(screen.getByTestId('popover')).toHaveAttribute(
        'data-placement',
        'top'
      );
    });
  });
});
