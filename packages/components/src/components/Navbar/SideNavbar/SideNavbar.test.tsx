import { createRef } from 'react';

import { I18nProvider } from '@koobiq/react-core';
import { IconChevronLeft16 } from '@koobiq/react-icons';
import {
  act,
  render,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { DropdownMenu } from '../../DropdownMenu';
import { Menu } from '../../Menu';
import { NavbarAppItem, NavbarItem } from '../components';
import s from '../components/NavbarItem/NavbarItem.module.css';

import { SideNavbar, type SideNavbarProps } from '.';
import { NavbarBody, NavbarFooter, NavbarHeader } from './components';

describe('SideNavbar', () => {
  const renderNavbar = (props: SideNavbarProps = {}) =>
    render(
      <SideNavbar {...props}>
        <SideNavbar.Header>
          <SideNavbar.AppItem href="#" icon={<span>AppIcon</span>}>
            App
          </SideNavbar.AppItem>
        </SideNavbar.Header>
        <SideNavbar.Body>
          <NavbarItem href="#" icon={<span>Icon1</span>}>
            Item 1
          </NavbarItem>
          <NavbarItem href="#" icon={<span>Icon2</span>}>
            Item 2
          </NavbarItem>
        </SideNavbar.Body>
        <SideNavbar.Footer>
          <NavbarItem href="#" icon={<span>Icon3</span>}>
            Footer Item
          </NavbarItem>
        </SideNavbar.Footer>
      </SideNavbar>
    );

  it('renders with default expanded state', () => {
    renderNavbar();

    const nav = screen.getByRole('navigation');

    expect(nav).toHaveAttribute('data-collapsed', 'false');
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('toggles collapse state when toggle button is clicked', async () => {
    renderNavbar();

    const nav = screen.getByRole('navigation');
    const toggleButton = screen.getByRole('button', { name: 'Collapse' });

    expect(toggleButton).not.toHaveAttribute('data-shown');

    await userEvent.hover(nav);

    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('data-shown', 'true');
    expect(toggleButton).not.toHaveAttribute('data-collapsed');

    await userEvent.click(toggleButton);

    expect(nav).toHaveAttribute('data-collapsed', 'true');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(toggleButton).toHaveAttribute('data-collapsed', 'true');
  });

  it('shows the accessible toggle when keyboard focus enters the navbar', async () => {
    renderNavbar();

    const toggleButton = screen.getByRole('button', { name: 'Collapse' });

    expect(toggleButton).not.toHaveAttribute('data-shown');

    await userEvent.tab();

    expect(toggleButton).toHaveAttribute('data-shown', 'true');
  });

  it('keeps items expanded until the collapse animation ends', async () => {
    renderNavbar();

    const nav = screen.getByRole('navigation');

    await userEvent.hover(nav);

    fireEvent.click(screen.getByRole('button', { name: 'Collapse' }));

    expect(nav).toHaveAttribute('data-collapsed', 'true');
    expect(nav).toHaveAttribute('data-open');

    await waitFor(() => expect(nav).not.toHaveAttribute('data-open'));
  });

  it('starts collapsed and expands items as soon as expansion starts', async () => {
    renderNavbar({ defaultCollapsed: true });

    const nav = screen.getByRole('navigation');

    expect(nav).not.toHaveAttribute('data-open');

    await userEvent.hover(nav);

    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));

    expect(nav).toHaveAttribute('data-open');
  });

  it('names a collapsed item by its content', () => {
    render(
      <SideNavbar defaultCollapsed>
        <SideNavbar.Item href="#" icon={<span aria-hidden>Icon</span>}>
          <span>Reports</span>
        </SideNavbar.Item>
      </SideNavbar>
    );

    expect(screen.getByRole('link', { name: 'Reports' })).toBeInTheDocument();
  });

  it('marks the active item as the current page', () => {
    render(
      <SideNavbar>
        <SideNavbar.Item href="#" isActive>
          Reports
        </SideNavbar.Item>
        <SideNavbar.Item href="#">Settings</SideNavbar.Item>
      </SideNavbar>
    );

    expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute(
      'aria-current',
      'page'
    );

    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('forwards the ref, attributes and styles to the navigation element', () => {
    const ref = createRef<HTMLElement>();

    renderNavbar({ ref, 'aria-label': 'Main', style: { color: 'red' } });

    const nav = screen.getByRole('navigation', { name: 'Main' });

    expect(ref.current).toBe(nav);
    expect(nav.style.color).toBe('red');
  });

  it('reports collapse changes without changing a controlled state', async () => {
    const onCollapse = vi.fn();

    const { rerender } = render(
      <SideNavbar isCollapsed={false} onCollapse={onCollapse} />
    );

    await userEvent.hover(screen.getByRole('navigation'));

    await userEvent.click(screen.getByRole('button', { name: 'Collapse' }));

    expect(onCollapse).toHaveBeenCalledExactlyOnceWith(true);

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'data-collapsed',
      'false'
    );

    rerender(<SideNavbar isCollapsed onCollapse={onCollapse} />);

    await userEvent.click(screen.getByRole('button', { name: 'Expand' }));

    expect(onCollapse).toHaveBeenLastCalledWith(false);

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'data-collapsed',
      'true'
    );
  });

  it('does not toggle with the Sidebar shortcut', async () => {
    const onCollapse = vi.fn();

    renderNavbar({ onCollapse });

    await userEvent.keyboard('[BracketLeft]');

    expect(onCollapse).not.toHaveBeenCalled();

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'data-collapsed',
      'false'
    );
  });

  it('toggles with Ctrl+/', () => {
    const onCollapse = vi.fn();

    renderNavbar({ onCollapse });

    fireEvent.keyDown(window, { code: 'Slash', ctrlKey: true });

    expect(onCollapse).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('hides the toggle after an item is clicked with the mouse', async () => {
    renderNavbar();

    const toggleButton = screen.getByRole('button', { name: 'Collapse' });

    await userEvent.click(screen.getByRole('link', { name: /Item 1/ }));
    await userEvent.unhover(screen.getByRole('navigation'));

    expect(toggleButton).not.toHaveAttribute('data-shown');
  });

  it('hides the toggle when requested', async () => {
    renderNavbar({ isToggleButtonHidden: true });

    await userEvent.hover(screen.getByRole('navigation'));

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it.each([false, true])(
    'opens a dropdown submenu when collapsed=%s',
    async (defaultCollapsed) => {
      const onAction = vi.fn();

      render(
        <SideNavbar defaultCollapsed={defaultCollapsed}>
          <SideNavbar.Body>
            <DropdownMenu>
              <SideNavbar.Item icon={<span aria-hidden>Icon</span>}>
                Control Panel
              </SideNavbar.Item>
              <DropdownMenu.Popover>
                <DropdownMenu.Content>
                  <DropdownMenu.SubmenuTrigger>
                    <DropdownMenu.Item id="users">Users</DropdownMenu.Item>
                    <DropdownMenu.Popover>
                      <DropdownMenu.Content onAction={onAction}>
                        <DropdownMenu.Item id="invite-user">
                          Invite User
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Popover>
                  </DropdownMenu.SubmenuTrigger>
                </DropdownMenu.Content>
              </DropdownMenu.Popover>
            </DropdownMenu>
          </SideNavbar.Body>
        </SideNavbar>
      );

      const trigger = screen.getByRole('button', { name: 'Control Panel' });

      await userEvent.click(trigger);

      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Users' })
      );

      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Invite User' })
      );

      expect(onAction).toHaveBeenCalledExactlyOnceWith('invite-user');

      await waitFor(() =>
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      );

      await waitFor(() => expect(trigger).toHaveFocus());
    }
  );

  describe('menu items', () => {
    const renderDropdownMenu = (props: SideNavbarProps = {}) =>
      render(
        <SideNavbar {...props}>
          <SideNavbar.Body>
            <DropdownMenu>
              <SideNavbar.Item icon={<span aria-hidden>Icon</span>}>
                Control Panel
              </SideNavbar.Item>
              <DropdownMenu.Popover data-testid="menu-popover">
                <DropdownMenu.Content>
                  <DropdownMenu.Item id="roles">Roles</DropdownMenu.Item>
                  <DropdownMenu.Item id="users">Users</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Popover>
            </DropdownMenu>
          </SideNavbar.Body>
        </SideNavbar>
      );

    const renderMenu = () =>
      render(
        <SideNavbar>
          <SideNavbar.Body>
            <Menu
              data-testid="menu-popover"
              control={(props) => (
                <SideNavbar.Item {...props}>Control Panel</SideNavbar.Item>
              )}
            >
              <Menu.Item key="roles">Roles</Menu.Item>
              <Menu.Item key="users">Users</Menu.Item>
            </Menu>
          </SideNavbar.Body>
        </SideNavbar>
      );

    const getMenuIcon = () =>
      screen
        .getByRole('button', { name: 'Control Panel' })
        .querySelector(`.${s.menuIcon}`);

    it.each([
      ['DropdownMenu', renderDropdownMenu],
      ['Menu', renderMenu],
    ])('shows the menu arrow on a %s trigger', (_, renderTrigger) => {
      renderTrigger();

      expect(getMenuIcon()).toBeInTheDocument();
    });

    it.each([
      ['DropdownMenu', renderDropdownMenu],
      ['Menu', renderMenu],
    ])('places a %s beside the navbar', async (_, renderTrigger) => {
      renderTrigger();

      await userEvent.click(
        screen.getByRole('button', { name: 'Control Panel' })
      );

      const popover = await screen.findByTestId('menu-popover');

      expect(popover).toHaveAttribute('data-placement', 'right');
      expect(popover).toHaveStyle({ left: '-8px' });
    });

    it('lets isMenu hide the arrow on a menu trigger', () => {
      render(
        <SideNavbar>
          <DropdownMenu>
            <SideNavbar.Item isMenu={false}>Control Panel</SideNavbar.Item>
            <DropdownMenu.Popover>
              <DropdownMenu.Content>
                <DropdownMenu.Item id="roles">Roles</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Popover>
          </DropdownMenu>
        </SideNavbar>
      );

      expect(getMenuIcon()).not.toBeInTheDocument();
    });

    it.each([
      ['DropdownMenu', renderDropdownMenu],
      ['Menu', renderMenu],
    ])(
      'opens a %s with ArrowRight and focuses its first item',
      async (_, renderTrigger) => {
        renderTrigger();

        const trigger = screen.getByRole('button', { name: 'Control Panel' });

        act(() => trigger.focus());

        await userEvent.keyboard('{ArrowRight}');

        const firstItem = await screen.findByRole('menuitem', {
          name: 'Roles',
        });

        await waitFor(() => expect(firstItem).toHaveFocus());

        await userEvent.keyboard('{Escape}');

        await waitFor(() => expect(trigger).toHaveFocus());
      }
    );

    it('opens the menu with ArrowRight while collapsed', async () => {
      renderDropdownMenu({ defaultCollapsed: true });

      act(() => screen.getByRole('button', { name: 'Control Panel' }).focus());

      await userEvent.keyboard('{ArrowRight}');

      expect(await screen.findByRole('menu')).toBeInTheDocument();
    });

    it('opens the menu with ArrowLeft in a right-to-left locale', async () => {
      render(
        <I18nProvider locale="he-IL">
          <SideNavbar>
            <DropdownMenu>
              <SideNavbar.Item>Control Panel</SideNavbar.Item>
              <DropdownMenu.Popover>
                <DropdownMenu.Content>
                  <DropdownMenu.Item id="roles">Roles</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Popover>
            </DropdownMenu>
          </SideNavbar>
        </I18nProvider>
      );

      const menuIcon = getMenuIcon();

      act(() => screen.getByRole('button', { name: 'Control Panel' }).focus());

      await userEvent.keyboard('{ArrowRight}');

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      await userEvent.keyboard('{ArrowLeft}');

      expect(await screen.findByRole('menu')).toBeInTheDocument();

      const { container } = render(<IconChevronLeft16 />);

      expect(menuIcon?.querySelector('path')).toHaveAttribute(
        'd',
        container.querySelector('path')?.getAttribute('d')
      );
    });

    it('opens the menu of an app item without showing the arrow', async () => {
      render(
        <SideNavbar>
          <SideNavbar.Header>
            <DropdownMenu>
              <SideNavbar.AppItem icon={<span aria-hidden>Icon</span>}>
                Apps
              </SideNavbar.AppItem>
              <DropdownMenu.Popover>
                <DropdownMenu.Content>
                  <DropdownMenu.Item id="app">App</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Popover>
            </DropdownMenu>
          </SideNavbar.Header>
        </SideNavbar>
      );

      const trigger = screen.getByRole('button', { name: 'Apps' });

      expect(trigger.querySelector(`.${s.menuIcon}`)).toBeNull();

      act(() => trigger.focus());

      await userEvent.keyboard('{ArrowRight}');

      expect(await screen.findByRole('menu')).toBeInTheDocument();
    });

    it('ignores ArrowRight on an item without a menu', async () => {
      renderNavbar();

      act(() => screen.getByRole('link', { name: /Item 1/ }).focus());

      await userEvent.keyboard('{ArrowRight}');

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('SideNavbar subcomponents', () => {
    it('forwards refs to structural regions and the action button', () => {
      const headerRef = createRef<HTMLElement>();
      const bodyRef = createRef<HTMLDivElement>();
      const footerRef = createRef<HTMLElement>();
      const actionRef = createRef<HTMLButtonElement>();

      render(
        <SideNavbar>
          <SideNavbar.Header ref={headerRef} data-testid="header" />
          <SideNavbar.Body ref={bodyRef} data-testid="body">
            <SideNavbar.Action ref={actionRef}>New task</SideNavbar.Action>
          </SideNavbar.Body>
          <SideNavbar.Footer ref={footerRef} data-testid="footer" />
        </SideNavbar>
      );

      expect(headerRef.current).toBe(screen.getByTestId('header'));
      expect(bodyRef.current).toBe(screen.getByTestId('body'));
      expect(footerRef.current).toBe(screen.getByTestId('footer'));

      expect(actionRef.current).toBe(
        screen.getByRole('button', { name: 'New task' })
      );
    });

    it('renders NavbarHeader with children', () => {
      render(
        <NavbarHeader>
          <div>Header Item</div>
        </NavbarHeader>
      );

      const header = screen.getByRole('banner');

      expect(header).toBeInTheDocument();
      expect(screen.getByText('Header Item')).toBeInTheDocument();
    });

    it('renders NavbarBody with children', () => {
      render(
        <NavbarBody>
          <div>Body Item</div>
        </NavbarBody>
      );

      expect(screen.getByText('Body Item')).toBeInTheDocument();
    });

    it('renders NavbarFooter with children', () => {
      render(
        <NavbarFooter>
          <div>Footer Item</div>
        </NavbarFooter>
      );

      const footer = screen.getByRole('contentinfo');

      expect(footer).toBeInTheDocument();
      expect(screen.getByText('Footer Item')).toBeInTheDocument();
    });

    it('renders NavbarItem with icon and text', () => {
      render(
        <SideNavbar>
          <NavbarItem href="#" icon={<span>Icon</span>}>
            Item Text
          </NavbarItem>
        </SideNavbar>
      );

      const link = screen.getByRole('link', { name: /Item Text/i });

      expect(link).toBeInTheDocument();
      expect(link).toContainHTML('Icon');
    });

    it('renders NavbarItem with badge', () => {
      render(
        <SideNavbar>
          <NavbarItem href="#" badge={<span>99</span>}>
            Item with Badge
          </NavbarItem>
        </SideNavbar>
      );

      const badge = screen.getByText('99');

      expect(badge).toBeInTheDocument();
    });

    it('renders NavbarItem as menu when isMenu is true', () => {
      render(
        <SideNavbar>
          <NavbarItem href="#" isMenu>
            Menu Item
          </NavbarItem>
        </SideNavbar>
      );

      const menuIcon = document.querySelector(`.${s.menuIcon}`);

      expect(menuIcon).toBeInTheDocument();
    });

    it('renders NavbarAppItem without menu props', () => {
      render(
        <SideNavbar>
          <NavbarAppItem href="#" icon={<span>AppIcon</span>}>
            App
          </NavbarAppItem>
        </SideNavbar>
      );

      const link = screen.getByRole('link', { name: /App/i });

      expect(link).toBeInTheDocument();
      expect(link).toContainHTML('AppIcon');
    });

    it('puts the className only on the header and footer', () => {
      render(
        <>
          <NavbarHeader className="custom" />
          <NavbarFooter className="custom" />
        </>
      );

      expect(screen.getByRole('banner')).toHaveClass('custom');
      expect(screen.getByRole('contentinfo')).toHaveClass('custom');
      expect(document.querySelectorAll('.custom')).toHaveLength(2);
    });

    it('renders SideNavbar.Divider as a separator', () => {
      render(
        <SideNavbar>
          <SideNavbar.Body>
            <SideNavbar.Divider data-testid="divider" />
          </SideNavbar.Body>
        </SideNavbar>
      );

      const divider = screen.getByTestId('divider');

      expect(divider.tagName).toBe('DIV');
      expect(divider).toHaveAttribute('role', 'separator');
      expect(divider).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('names a collapsed SideNavbar.Action by its text', () => {
      render(
        <SideNavbar defaultCollapsed>
          <SideNavbar.Body>
            <SideNavbar.Action icon={<svg />}>New task</SideNavbar.Action>
          </SideNavbar.Body>
        </SideNavbar>
      );

      expect(screen.getByRole('button', { name: 'New task' })).toHaveAttribute(
        'data-onlyicon',
        'true'
      );
    });

    it('names a collapsed SideNavbar.Action with ReactNode content', () => {
      render(
        <SideNavbar defaultCollapsed>
          <SideNavbar.Body>
            <SideNavbar.Action icon={<svg />}>
              <span>New task</span>
            </SideNavbar.Action>
          </SideNavbar.Body>
        </SideNavbar>
      );

      expect(screen.getByRole('button', { name: 'New task' })).toHaveAttribute(
        'data-onlyicon',
        'true'
      );
    });
  });
});
