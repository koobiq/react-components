import { createRef } from 'react';

import { RouterProvider } from '@koobiq/react-core';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button primitive', () => {
  const baseProps = {
    children: 'Button',
    'aria-label': 'button',
  };

  const getRoot = () => screen.getByLabelText('button');

  it('should accept ref', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(<Button {...baseProps} ref={ref} />);
    const button = container.querySelector('button');

    expect(ref.current).toBe(button);
  });

  it('should render as anchor when as="a" and href is provided', () => {
    render(<Button {...baseProps} as="a" href="/components" />);

    const button = getRoot();

    expect(button.tagName).toBe('A');
    expect(button).toHaveAttribute('href', '/components');
  });

  it('should navigate via RouterProvider when rendered as a link', async () => {
    const onNavigate = vi.fn();

    render(
      <RouterProvider navigate={onNavigate}>
        <Button {...baseProps} as="a" href="/components" />
      </RouterProvider>
    );

    await userEvent.click(getRoot());

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('should block navigation when disabled', async () => {
    const onNavigate = vi.fn();

    render(
      <RouterProvider navigate={onNavigate}>
        <Button {...baseProps} as="a" href="/components" isDisabled />
      </RouterProvider>
    );

    await userEvent.click(getRoot());

    expect(onNavigate).toHaveBeenCalledTimes(0);
  });

  it('should block navigation when loading', async () => {
    const onNavigate = vi.fn();

    render(
      <RouterProvider navigate={onNavigate}>
        <Button {...baseProps} as="a" href="/components" isLoading />
      </RouterProvider>
    );

    await userEvent.click(getRoot());

    expect(onNavigate).toHaveBeenCalledTimes(0);
  });
});
