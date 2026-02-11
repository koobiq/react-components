import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

import { Navbar } from '.';
import {
  NavbarAppItem,
  NavbarBody,
  NavbarFooter,
  NavbarHeader,
  NavbarItem,
} from './components';
import s from './Navbar.module.css';

describe('Navbar', () => {
  const renderNavbar = (props = {}) =>
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

  it('toggles collapse state when toggle button is clicked', () => {
    renderNavbar();

    const nav = screen.getByRole('navigation');
    const toggleButton = screen.getByRole('button', { hidden: true });

    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton!);

    expect(nav).toHaveAttribute('data-collapsed', 'true');
  });

  it('hides item content when collapsed', () => {
    renderNavbar();

    const nav = screen.getByRole('navigation');
    const toggleButton = screen.getByRole('button', { hidden: true });

    fireEvent.click(toggleButton!);

    expect(nav).toHaveAttribute('data-collapsed', 'true');
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

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
