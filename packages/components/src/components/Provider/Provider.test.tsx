import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Link } from '../Link';

import { Provider } from './index';

describe('Provider', () => {
  it('should render the component with the children', () => {
    render(<Provider>App</Provider>);
    expect(screen.getByText('App')).toBeInTheDocument();
  });

  it('should render the component with applied router props', async () => {
    const onNavigate = vi.fn();

    render(
      <Provider router={{ navigate: onNavigate }}>
        <Link href="/foo" data-testid="link">
          Anchor
        </Link>
      </Provider>
    );

    const link = screen.getByTestId('link');

    await userEvent.click(link);

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Anchor')).toBeInTheDocument();
  });
});
