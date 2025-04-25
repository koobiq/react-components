import { createRef } from 'react';

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Grid } from './index';
import type { GridProps, GridItemProps } from './index';

describe('Grid', () => {
  const baseProps = {};

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    const props: GridProps = {
      ...baseProps,
      className,
    };

    const { container } = render(<Grid {...props} />);

    const grid = container.querySelector('div');

    expect(grid).toHaveClass(className);
  });

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Grid {...baseProps} ref={ref} />);
    const grid = container.querySelector('div');
    expect(ref.current).toBe(grid);
  });
});

describe('Grid.Item', () => {
  const baseProps = {};

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    const props: GridItemProps = {
      ...baseProps,
      className,
    };

    const { container } = render(<Grid.Item {...props} />);

    const grid = container.querySelector('div');

    expect(grid).toHaveClass(className);
  });

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Grid.Item {...baseProps} ref={ref} />);
    const grid = container.querySelector('div');
    expect(ref.current).toBe(grid);
  });
});
