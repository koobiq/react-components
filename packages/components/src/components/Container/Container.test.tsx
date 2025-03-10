import { createRef } from 'react';

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Container, type ContainerBaseProps } from './index';

describe('Container', () => {
  const baseProps = { 'data-testid': 'container' };

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    const props: ContainerBaseProps = {
      ...baseProps,
      className,
    };

    const { container } = render(<Container {...props} />);

    const root = container.querySelector('div');

    expect(root).toHaveClass(className);
  });

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Container {...baseProps} ref={ref} />);
    const root = container.querySelector('div');
    expect(ref.current).toBe(root);
  });
});
