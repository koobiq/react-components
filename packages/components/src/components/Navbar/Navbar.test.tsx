import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';

import { Navbar } from '.';

describe('Navbar', () => {
  it('forwards its ref to the deprecated vertical navbar', () => {
    const ref = createRef<HTMLElement>();

    render(<Navbar ref={ref} data-testid="navbar" />);

    expect(ref.current).toBe(screen.getByTestId('navbar'));
  });

  it('renders the deprecated alias as a vertical navbar', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(
      <Navbar variant="horizontal">
        <Navbar.Item href="#">Dashboard</Navbar.Item>
      </Navbar>
    );

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'data-orientation',
      'vertical'
    );

    expect(screen.getByRole('toolbar')).toHaveAttribute(
      'aria-orientation',
      'vertical'
    );

    expect(screen.getByRole('navigation')).not.toHaveAttribute('variant');
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });
});
