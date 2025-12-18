import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Breadcrumbs } from './index';

describe('Breadcrumbs', () => {
  const baseProps = { 'data-testid': 'breadcrumbs' };

  const getRoot = () => screen.getByTestId<HTMLElement>('breadcrumbs');

  it('should receive ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    const { container } = render(<Breadcrumbs {...baseProps} ref={ref} />);
    const breadcrumbs = container.querySelector('nav');
    expect(ref.current).toBe(breadcrumbs);
  });

  it('should accept a custom class', () => {
    render(<Breadcrumbs {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should set custom style', () => {
    const style = { padding: 20 };

    const { container } = render(<Breadcrumbs style={style} />);

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle({ padding: '20px' });
  });

  describe('BreadcrumbItem', () => {});
});
