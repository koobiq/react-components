import { createRef } from 'react';

import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { DropdownMenu } from '../DropdownMenu';

import { Navbar, type NavbarProps } from '.';
import {
  NavbarAppItem,
  NavbarBody,
  NavbarFooter,
  NavbarHeader,
  NavbarItem,
} from './components';
import s from './Navbar.module.css';

describe('Navbar', () => {
  const renderNavbar = (props: NavbarProps = {}) =>
    render(
      <Navbar {...props}>
        <Navbar.Header>
          <Navbar.AppItem href="#" icon={<span>AppIcon</span>}>
            App
          </Navbar.AppItem>
        </Navbar.Header>
        <Navbar.Body>
          <NavbarItem href="#" icon={<span>Icon1</span>}>
            Item 1
          </NavbarItem>
          <NavbarItem href="#" icon={<span>Icon2</span>}>
            Item 2
          </NavbarItem>
        </Navbar.Body>
        <Navbar.Footer>
          <NavbarItem href="#" icon={<span>Icon3</span>}>
            Footer Item
          </NavbarItem>
        </Navbar.Footer>
      </Navbar>
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
    const toggleButton = screen.getByRole('button', { name: 'Hide' });

    expect(toggleButton).toBeInTheDocument();

    await userEvent.click(toggleButton);

    expect(nav).toHaveAttribute('data-collapsed', 'true');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps item content during collapse and hides it after the animation', async () => {
    renderNavbar();

    const nav = screen.getByRole('navigation');
    const toggleButton = screen.getByRole('button', { name: 'Hide' });

    fireEvent.click(toggleButton);

    expect(nav).toHaveAttribute('data-collapsed', 'true');
    expect(nav).toHaveAttribute('data-transition', 'exiting');
    expect(screen.getByText('Item 1')).toBeInTheDocument();

    await waitFor(() =>
      expect(nav).toHaveAttribute('data-transition', 'exited')
    );

    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Item 1' })).toBeInTheDocument();
  });

  it('starts collapsed and shows item content as soon as expansion starts', () => {
    renderNavbar({ defaultCollapsed: true });

    const nav = screen.getByRole('navigation');

    expect(nav).toHaveAttribute('data-transition', 'exited');
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));

    expect(nav).toHaveAttribute('data-transition', 'entering');
    expect(screen.getByText('Item 1')).toBeInTheDocument();
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
      <Navbar isCollapsed={false} onCollapse={onCollapse} />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Hide' }));

    expect(onCollapse).toHaveBeenCalledExactlyOnceWith(true);

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'data-collapsed',
      'false'
    );

    rerender(<Navbar isCollapsed onCollapse={onCollapse} />);

    await userEvent.click(screen.getByRole('button', { name: 'Show' }));

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

  it('hides the toggle when requested', () => {
    renderNavbar({ isToggleButtonHidden: true });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it.each([false, true])(
    'opens a dropdown submenu when collapsed=%s',
    async (defaultCollapsed) => {
      const onAction = vi.fn();

      render(
        <Navbar defaultCollapsed={defaultCollapsed}>
          <Navbar.Body>
            <DropdownMenu>
              <Navbar.Item icon={<span aria-hidden>Icon</span>} isMenu>
                Control Panel
              </Navbar.Item>
              <DropdownMenu.Popover placement="end top">
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
          </Navbar.Body>
        </Navbar>
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

  describe('Navbar subcomponents', () => {
    it('renders NavbarHeader with children', () => {
      render(
        <NavbarHeader>
          <li>Header Item</li>
        </NavbarHeader>
      );

      const header = screen.getByRole('banner');

      expect(header).toBeInTheDocument();
      expect(screen.getByText('Header Item')).toBeInTheDocument();
    });

    it('renders NavbarBody with children', () => {
      render(
        <NavbarBody>
          <li>Body Item</li>
        </NavbarBody>
      );

      expect(screen.getByText('Body Item')).toBeInTheDocument();
    });

    it('renders NavbarFooter with children', () => {
      render(
        <NavbarFooter>
          <li>Footer Item</li>
        </NavbarFooter>
      );

      const footer = screen.getByRole('contentinfo');

      expect(footer).toBeInTheDocument();
      expect(screen.getByText('Footer Item')).toBeInTheDocument();
    });

    it('renders NavbarItem with icon and text', () => {
      render(
        <Navbar>
          <NavbarItem href="#" icon={<span>Icon</span>}>
            Item Text
          </NavbarItem>
        </Navbar>
      );

      const link = screen.getByRole('link', { name: /Item Text/i });

      expect(link).toBeInTheDocument();
      expect(link).toContainHTML('Icon');
    });

    it('renders NavbarItem with badge', () => {
      render(
        <Navbar>
          <NavbarItem href="#" badge={<span>99</span>}>
            Item with Badge
          </NavbarItem>
        </Navbar>
      );

      const badge = screen.getByText('99');

      expect(badge).toBeInTheDocument();
    });

    it('renders NavbarItem as menu when isMenu is true', () => {
      render(
        <Navbar>
          <NavbarItem href="#" isMenu>
            Menu Item
          </NavbarItem>
        </Navbar>
      );

      const menuIcon = document.querySelector(`.${s.itemMenuIcon}`);

      expect(menuIcon).toBeInTheDocument();
    });

    it('renders NavbarAppItem without menu props', () => {
      render(
        <Navbar>
          <NavbarAppItem href="#" icon={<span>AppIcon</span>}>
            App
          </NavbarAppItem>
        </Navbar>
      );

      const link = screen.getByRole('link', { name: /App/i });

      expect(link).toBeInTheDocument();
      expect(link).toContainHTML('AppIcon');
    });
  });
});
