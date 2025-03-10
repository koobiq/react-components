import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Checkbox } from './index';

describe('Checkbox', () => {
  const baseProps = {
    'data-testid': 'root',
  };

  const getRoot = () => screen.getByTestId('root');

  describe('business logic', () => {
    it('should accept the ref', () => {
      const ref = createRef<HTMLLabelElement>();
      const { container } = render(<Checkbox {...baseProps} ref={ref} />);
      const labelElement = container.querySelector('label');
      expect(ref.current).toBe(labelElement);
    });

    it('should accept a custom class', () => {
      render(<Checkbox {...baseProps} className="foo" />);

      expect(getRoot()).toHaveClass('foo');
    });

    it('should display the text', () => {
      render(<Checkbox {...baseProps}>foo</Checkbox>);

      expect(screen.getByText('foo')).toBeInTheDocument();
    });
  });
});
