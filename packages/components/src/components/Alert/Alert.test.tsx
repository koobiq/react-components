import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Alert } from './index.js';

describe('Alert', () => {
  const baseProps = { 'data-testid': 'alert' };

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Alert {...baseProps} ref={ref} />);
    const root = container.querySelector('div');
    expect(ref.current).toBe(root);
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';
    const { container } = render(<Alert className={className}>Body</Alert>);
    const root = container.querySelector('div');
    expect(root?.className).toContain(className);
  });

  it('should render the component with the title and children', () => {
    render(<Alert title="Title">Message</Alert>);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it(`should render an action`, () => {
    render(
      <Alert
        {...baseProps}
        action={<button data-testid="action">action</button>}
      />
    );

    const action = screen.getByTestId('action');

    expect(action).toHaveTextContent('action');
  });

  it(`should render a custom icon`, () => {
    render(<Alert {...baseProps} icon={<svg data-testid="icon" />} />);

    const customIcon = screen.getByTestId('icon');

    expect(customIcon).toBeInTheDocument();
  });

  it(`should hide a default icon`, () => {
    render(
      <Alert
        {...baseProps}
        slotProps={{ statusIcon: { children: 'close' } }}
        hideIcon
      />
    );

    expect(screen.queryByText('close')).not.toBeInTheDocument();
  });

  it('should call the onClose callback', async () => {
    const callback = vi.fn();
    render(<Alert {...baseProps} onClose={callback} />);

    await userEvent.click(screen.getByRole('button'));

    expect(callback).toBeCalled();
  });
});
