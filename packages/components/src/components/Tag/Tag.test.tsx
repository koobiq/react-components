import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Tag } from './index.js';

describe('Tag', () => {
  const baseProps = { 'data-testid': 'tag' };

  // const getTag = () => screen.getByTestId<HTMLButtonElement>('tag');

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Tag {...baseProps} ref={ref} />);
    const root = container.querySelector('div');
    expect(ref.current).toBe(root);
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';
    const { container } = render(<Tag className={className} />);
    const root = container.querySelector('div');
    expect(root?.className).toContain(className);
  });

  it('should render the component with the label', () => {
    render(<Tag label="Label" />);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it(`should render an icon`, () => {
    render(<Tag {...baseProps} icon={<svg data-testid="icon" />} />);

    const customIcon = screen.getByTestId('icon');

    expect(customIcon).toBeInTheDocument();
  });

  it('should call the onClose callback', async () => {
    const callback = vi.fn();
    render(<Tag {...baseProps} onClose={callback} />);

    await userEvent.click(screen.getByRole('button'));

    expect(callback).toBeCalled();
  });
});
