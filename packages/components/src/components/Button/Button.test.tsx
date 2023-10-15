import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Button } from './index.js';

describe('Button', () => {
  const baseProps = { 'data-testid': 'button' };

  const getButton = () => screen.getByTestId<HTMLButtonElement>('button');

  it('should render the component with the correct label text', () => {
    render(<Button>Label</Button>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('should render the component as a link with the correct tag and href attribute', () => {
    render(
      <Button {...baseProps} as="a" href="htts://example.com">
        Label
      </Button>
    );

    const button = screen.getByTestId('button');
    expect(button.tagName).toBe('A');
    expect(button).toHaveAttribute('href');
  });

  it('should call the onClick handler when clicked', async () => {
    const props = {
      ...baseProps,
      onClick: vi.fn(),
    };

    render(<Button {...props} />);

    const button = getButton();

    await userEvent.click(button);

    expect(props.onClick).toHaveBeenCalledTimes(1);
  });

  describe('button', () => {
    it('should be focusable, non-clickable, and have correct accessibility attributes when in a loading state', async () => {
      const props = {
        ...baseProps,
        onClick: vi.fn(),
        progress: true,
      };

      render(<Button {...props} />);

      const button = getButton();

      await userEvent.tab();

      expect(button).toHaveFocus();

      await userEvent.click(button);

      expect(button).not.toBeDisabled();
      expect(props.onClick).toHaveBeenCalledTimes(0);
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be blocked, unfocused, non-clickable, and have correct accessibility attributes when in a disabled state', async () => {
      const props = {
        ...baseProps,
        onClick: vi.fn(),
        disabled: true,
      };

      render(<Button {...props} />);

      const button = getButton();

      await userEvent.tab();

      expect(button).not.toHaveFocus();

      await userEvent.click(button);

      expect(button).toBeDisabled();
      expect(props.onClick).toHaveBeenCalledTimes(0);
    });
  });

  describe('a', () => {
    it('should be focusable, non-clickable, and have correct accessibility attributes when in a loading state', async () => {
      const props = {
        ...baseProps,
        onClick: vi.fn(),
        progress: true,
      };

      render(<Button {...props} as="a" href="#" />);

      const link = getButton();

      await userEvent.tab();

      expect(link).toHaveFocus();

      await userEvent.click(link);

      expect(link).not.toBeDisabled();
      expect(props.onClick).toHaveBeenCalledTimes(0);
      expect(link).toHaveAttribute('aria-busy', 'true');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be blocked, unfocused, non-clickable, and have correct accessibility attributes when in a disabled state', async () => {
      const props = {
        ...baseProps,
        onClick: vi.fn(),
        disabled: true,
      };

      render(<Button {...props} as="a" href="#" />);

      const link = getButton();

      await userEvent.tab();

      expect(link).not.toHaveFocus();

      await userEvent.click(link);

      expect(link).not.toBeDisabled();
      expect(props.onClick).toHaveBeenCalledTimes(0);
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
