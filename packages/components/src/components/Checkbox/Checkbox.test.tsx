import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Checkbox } from './index';

describe('Checkbox', () => {
  const baseProps = {
    children: 'Label',
    'aria-label': 'input',
    slotProps: {
      root: { 'aria-label': 'root' },
    },
  };

  const getRoot = () => screen.getByLabelText('root');

  describe('business logic', () => {
    it('should accept the ref', () => {
      const ref = createRef<HTMLInputElement>();
      const { container } = render(<Checkbox {...baseProps} ref={ref} />);
      const inputElement = container.querySelector('input');
      expect(ref.current).toBe(inputElement);
    });

    it('should accept a custom class', () => {
      render(<Checkbox {...baseProps} className="custom-class-name" />);

      expect(getRoot()).toHaveClass('custom-class-name');
    });

    it('should display the text', () => {
      render(<Checkbox {...baseProps} />);

      expect(screen.getByText(baseProps.children)).toBeInTheDocument();
    });
  });
});
