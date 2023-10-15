import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Link } from './index.js';

describe('Link', () => {
  const baseProps = {
    children: 'Link',
    'aria-label': 'link',
  };

  const getRoot = () => screen.getByLabelText('link');

  it('should accept the ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    const { container } = render(<Link {...baseProps} ref={ref} />);
    const anchorElement = container.querySelector('a');
    expect(ref.current).toBe(anchorElement);
  });

  it('should accept a custom class', () => {
    render(<Link {...baseProps} className="custom-class-name" />);

    expect(getRoot()).toHaveClass('custom-class-name');
  });

  it('should display the text', () => {
    render(<Link {...baseProps} />);

    expect(screen.getByText(baseProps.children)).toBeInTheDocument();
  });

  describe('button', () => {
    it('should be like a button with as=button', async () => {
      const props = {
        ...baseProps,
        onClick: vi.fn(),
      };

      render(<Link {...props} as="button" />);
      const linkAsButton = getRoot();

      expect(linkAsButton.tagName).toBe('BUTTON');

      await userEvent.click(linkAsButton);

      expect(props.onClick).toHaveBeenCalledTimes(1);
    });

    it('should be blocked, unfocused, non-clickable, and have correct accessibility attributes when in a disabled state', async () => {
      const props = {
        ...baseProps,
        onClick: vi.fn(),
        disabled: true,
      };

      render(<Link {...props} as="button" />);

      const linkAsButton = getRoot();

      await userEvent.tab();

      expect(linkAsButton).not.toHaveFocus();

      await userEvent.click(linkAsButton);

      expect(linkAsButton).toBeDisabled();
      expect(props.onClick).toHaveBeenCalledTimes(0);
      expect(linkAsButton).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
