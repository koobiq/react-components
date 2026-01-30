import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ContentPanel } from '../index.js';

describe('ContentPanel', () => {
  const baseProps = { 'data-testid': 'panel' };

  const getPanel = () => screen.getByTestId<HTMLButtonElement>('panel');

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ContentPanel {...baseProps} ref={ref} />);

    const component = container.querySelector('div');

    expect(ref.current).toBe(component);
  });

  it('should accept a custom class', () => {
    render(<ContentPanel {...baseProps} className="foo" defaultOpen />);

    expect(getPanel()).toHaveClass('foo');
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    render(<ContentPanel {...baseProps} style={style} defaultOpen />);

    expect(getPanel()).toHaveStyle({ padding: '20px' });
  });
});
