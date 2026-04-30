import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DropdownFooter } from './index';

describe('DropdownFooter', () => {
  it('should render children and merge slot props', () => {
    render(
      <DropdownFooter data-testid="footer" className="custom-footer">
        Footer
      </DropdownFooter>
    );

    expect(screen.getByTestId('footer')).toHaveTextContent('Footer');
    expect(screen.getByTestId('footer')).toHaveClass('custom-footer');
  });

  it('should not render without children', () => {
    const { container, rerender } = render(<DropdownFooter />);

    expect(container).toBeEmptyDOMElement();

    rerender(<DropdownFooter>{false}</DropdownFooter>);

    expect(container).toBeEmptyDOMElement();
  });

  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<DropdownFooter ref={ref}>Footer</DropdownFooter>);

    expect(ref.current).toHaveTextContent('Footer');
  });
});
