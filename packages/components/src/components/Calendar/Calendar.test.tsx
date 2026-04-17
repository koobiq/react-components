import { createRef } from 'react';

import { parseDate } from '@internationalized/date';
import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import { Provider } from '../Provider';

import { Calendar } from './Calendar';

describe('Calendar', () => {
  const baseProps = { 'data-testid': 'calendar' };

  const getRoot = () => screen.getByTestId<HTMLButtonElement>('calendar');

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Calendar {...baseProps} ref={ref} />);
    const el = container.querySelector('div');
    expect(ref.current).toBe(el);
  });

  it('should accept a custom class', () => {
    render(<Calendar {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should set custom style', () => {
    const style = { padding: 20 };

    const { container } = render(<Calendar style={style} />);

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle({ padding: '20px' });
  });

  it('should not crash when reselecting the active month from the dropdown', async () => {
    render(
      <Provider locale="en-US">
        <Calendar defaultValue={parseDate('2025-02-03')} />
      </Provider>
    );

    const monthButton = screen.getByRole('button', { name: 'Feb' });

    await userEvent.click(monthButton);

    await userEvent.click(
      screen.getByRole('menuitemradio', { name: 'February' })
    );

    expect(monthButton).toHaveTextContent('Feb');
  });

  it('should not crash when reselecting the active year from the dropdown', async () => {
    render(
      <Provider locale="en-US">
        <Calendar defaultValue={parseDate('2025-02-03')} />
      </Provider>
    );

    const yearButton = screen.getByRole('button', { name: '2025' });

    await userEvent.click(yearButton);
    await userEvent.click(screen.getByRole('menuitemradio', { name: '2025' }));

    expect(yearButton).toHaveTextContent('2025');
  });
});
