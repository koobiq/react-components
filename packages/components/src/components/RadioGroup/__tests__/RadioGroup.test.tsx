import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { RadioGroup } from '../index';

describe('RadioGroup', () => {
  const baseProps = {
    'aria-label': 'root',
  };

  const getRoot = () => screen.getByRole('radiogroup');

  describe('business logic', () => {
    it('should accept the ref', () => {
      const ref = createRef<HTMLDivElement>();
      const { container } = render(<RadioGroup {...baseProps} ref={ref} />);
      const inputElement = container.querySelector('div');
      expect(ref.current).toBe(inputElement);
    });

    it('should accept a custom class', () => {
      render(<RadioGroup {...baseProps} className="foo" />);

      expect(getRoot()).toHaveClass('foo');
    });
  });
});
