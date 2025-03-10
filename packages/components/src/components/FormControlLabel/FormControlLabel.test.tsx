import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import s from './FormControlLabel.module.css';
import { FormControlLabel } from './index';

describe('FormControlLabel', () => {
  const baseProps = {
    'aria-label': 'root',
  };

  const getRoot = () => screen.getByLabelText('root');

  describe('business logic', () => {
    it('should accept the ref', () => {
      const ref = createRef<HTMLLabelElement>();

      const { container } = render(
        <FormControlLabel {...baseProps} ref={ref} />
      );

      const root = container.querySelector('label');
      expect(ref.current).toBe(root);
    });

    it('should accept a custom class', () => {
      render(<FormControlLabel {...baseProps} className="foo" />);

      expect(getRoot()).toHaveClass('foo');
    });

    it('should display the content', () => {
      render(<FormControlLabel {...baseProps}>foo</FormControlLabel>);

      expect(screen.getByText('foo')).toBeInTheDocument();
    });
  });

  describe('slotProps', () => {
    describe('content', () => {
      const baseContentProp = {
        'aria-label': 'content',
      };

      const getContent = () => screen.getByLabelText('content');

      it('should accept a custom class', () => {
        render(
          <FormControlLabel
            slotProps={{ content: { ...baseContentProp, className: 'foo' } }}
          />
        );

        expect(getContent()).toHaveClass(s.content);
        expect(getContent()).toHaveClass('foo');
      });
    });
  });
});
