import { createRef } from 'react';

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DropdownMenu } from '../../DropdownMenu';
import { NavbarTooltip } from '../components';

import { TopNavbar } from '.';

describe('TopNavbar', () => {
  it('renders start and end containers in a horizontal toolbar', () => {
    render(
      <TopNavbar aria-label="Main navigation">
        <TopNavbar.Container placement="start" data-testid="start">
          <TopNavbar.Item href="#">Dashboard</TopNavbar.Item>
        </TopNavbar.Container>
        <TopNavbar.Container placement="end" data-testid="end">
          <TopNavbar.Item as="button">Profile</TopNavbar.Item>
        </TopNavbar.Container>
      </TopNavbar>
    );

    expect(screen.getByRole('navigation')).toHaveAccessibleName(
      'Main navigation'
    );

    expect(screen.getByRole('toolbar')).toHaveAttribute(
      'aria-orientation',
      'horizontal'
    );

    expect(screen.getByTestId('start')).toHaveAttribute(
      'data-placement',
      'start'
    );

    expect(screen.getByTestId('end')).toHaveAttribute('data-placement', 'end');
  });

  it('forwards the ref and attributes to the navigation element', () => {
    const ref = createRef<HTMLElement>();

    render(
      <TopNavbar ref={ref} data-testid="navbar" style={{ color: 'red' }} />
    );

    expect(ref.current).toBe(screen.getByTestId('navbar'));
    expect(ref.current?.style.color).toBe('red');
  });

  it('forwards refs to the container and action button', () => {
    const containerRef = createRef<HTMLDivElement>();
    const actionRef = createRef<HTMLButtonElement>();

    render(
      <TopNavbar>
        <TopNavbar.Container ref={containerRef} data-testid="container">
          <TopNavbar.Action ref={actionRef}>New task</TopNavbar.Action>
        </TopNavbar.Container>
      </TopNavbar>
    );

    expect(containerRef.current).toBe(screen.getByTestId('container'));

    expect(actionRef.current).toBe(
      screen.getByRole('button', { name: 'New task' })
    );
  });

  it('moves focus between items with ArrowRight and ArrowLeft', async () => {
    render(
      <TopNavbar>
        <TopNavbar.Container>
          <TopNavbar.Item href="#">Dashboard</TopNavbar.Item>
          <TopNavbar.Item href="#">Integrations</TopNavbar.Item>
        </TopNavbar.Container>
      </TopNavbar>
    );

    const dashboard = screen.getByRole('link', { name: 'Dashboard' });
    const integrations = screen.getByRole('link', { name: 'Integrations' });

    await userEvent.tab();
    expect(dashboard).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(integrations).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(dashboard).toHaveFocus();
  });

  it('opens a menu below the item with ArrowDown', async () => {
    render(
      <TopNavbar>
        <TopNavbar.Container>
          <DropdownMenu>
            <TopNavbar.Item>Control Panel</TopNavbar.Item>
            <DropdownMenu.Popover data-testid="popover">
              <DropdownMenu.Content>
                <DropdownMenu.Item id="roles">Roles</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Popover>
          </DropdownMenu>
        </TopNavbar.Container>
      </TopNavbar>
    );

    const trigger = screen.getByRole('button', { name: 'Control Panel' });
    act(() => trigger.focus());

    await userEvent.keyboard('{ArrowDown}');

    expect(await screen.findByTestId('popover')).toHaveAttribute(
      'data-placement',
      'bottom'
    );

    await waitFor(() => expect(screen.getByRole('menuitem')).toHaveFocus());
  });

  it('places item tooltips below the navbar', async () => {
    render(
      <TopNavbar>
        <NavbarTooltip
          isOpen
          control={(props) => <button {...props}>Control</button>}
        >
          Full label
        </NavbarTooltip>
      </TopNavbar>
    );

    expect(await screen.findByRole('tooltip')).toHaveAttribute(
      'data-placement',
      'bottom'
    );
  });

  it('uses aria-label as a tooltip for an item without children', async () => {
    render(
      <TopNavbar>
        <TopNavbar.Container>
          <TopNavbar.Item href="#" aria-label="Projects" />
        </TopNavbar.Container>
      </TopNavbar>
    );

    const item = screen.getByRole('link', { name: 'Projects' });

    fireEvent.pointerMove(item, { pointerType: 'mouse' });
    fireEvent.mouseMove(item);
    await userEvent.hover(item);

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Projects');
  });

  it('renders a vertical divider and no list markup', () => {
    render(
      <TopNavbar>
        <TopNavbar.Container>
          <TopNavbar.Item href="#">Dashboard</TopNavbar.Item>
          <TopNavbar.Divider data-testid="divider" />
        </TopNavbar.Container>
      </TopNavbar>
    );

    expect(screen.getByTestId('divider')).toHaveAttribute(
      'aria-orientation',
      'vertical'
    );

    expect(document.querySelector('ul, li')).not.toBeInTheDocument();
  });
});
