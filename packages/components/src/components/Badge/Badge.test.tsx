import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Badge } from './index.js';

describe('Badge', () => {
  const baseProps = { 'data-testid': 'badge' };

  const getRoot = () => screen.getByTestId<HTMLButtonElement>('badge');

  it('should receive ref', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<Badge {...baseProps} ref={ref} />);
    const badge = container.querySelector('span');
    expect(ref.current).toBe(badge);
  });

  it('should render the component with the correct label text', () => {
    render(<Badge label="Label" />);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('should render the component as a link with the correct tag and href attribute', () => {
    const ref = createRef<HTMLAnchorElement>();

    render(<Badge {...baseProps} as="a" href="htts://example.com" ref={ref} />);

    const badge = screen.getByTestId('badge');
    expect(badge.tagName).toBe('A');
    expect(badge).toHaveAttribute('href');
  });

  it('should call the onClick handler when clicked', async () => {
    const props = {
      ...baseProps,
      onClick: vi.fn(),
    };

    render(<Badge {...props} />);

    const badge = getRoot();

    await userEvent.click(badge);

    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
});
