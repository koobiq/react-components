import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Flag, flagPropShape } from './index.js';

describe('Flag', () => {
  const baseProps = { 'data-testid': 'flag' };

  const getRoot = () => screen.getByTestId<HTMLSpanElement>('flag');

  it('should receive ref', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<Flag {...baseProps} ref={ref} />);
    const flag = container.querySelector('span');
    expect(ref.current).toBe(flag);
  });

  it('should render the component as a div with the correct tag', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Flag {...baseProps} as="div" ref={ref} />);

    expect(getRoot().tagName).toBe('DIV');
  });

  it('should project the flag graphic', () => {
    render(
      <Flag {...baseProps}>
        <svg data-testid="graphic" />
      </Flag>
    );

    expect(screen.getByTestId('graphic')).toBeInTheDocument();
  });

  describe('check the shape prop', () => {
    it('should default to the rectangle shape', () => {
      render(<Flag {...baseProps} />);

      expect(getRoot()).toHaveAttribute('data-shape', 'rectangle');
    });

    it.each(flagPropShape)('should apply the shape as a "%s"', (shape) => {
      render(<Flag {...baseProps} shape={shape} />);

      expect(getRoot()).toHaveAttribute('data-shape', shape);
    });
  });

  describe('check the shadow prop', () => {
    it('should default to the inset shadow', () => {
      render(<Flag {...baseProps} />);

      expect(getRoot()).toHaveAttribute('data-shadow', 'inset');
    });

    it('should apply the shadow as a "none"', () => {
      render(<Flag {...baseProps} shadow="none" />);

      expect(getRoot()).toHaveAttribute('data-shadow', 'none');
    });
  });

  describe('check the empty prop', () => {
    it('should not set data-empty by default', () => {
      render(<Flag {...baseProps} />);

      expect(getRoot()).not.toHaveAttribute('data-empty');
    });

    it('should set data-empty when empty is true', () => {
      render(<Flag {...baseProps} empty />);

      expect(getRoot()).toHaveAttribute('data-empty', 'true');
    });
  });

  describe('check the accessibility contract', () => {
    it('should be labelled with role="img" when the label is provided', () => {
      render(<Flag {...baseProps} label="Germany" />);

      const flag = getRoot();

      expect(flag).toHaveAttribute('role', 'img');
      expect(flag).toHaveAttribute('aria-label', 'Germany');
      expect(flag).not.toHaveAttribute('aria-hidden');
    });

    it('should be hidden from assistive tech when decorative', () => {
      render(<Flag {...baseProps} decorative label="Germany" />);

      const flag = getRoot();

      expect(flag).toHaveAttribute('aria-hidden', 'true');
      expect(flag).not.toHaveAttribute('role');
      expect(flag).not.toHaveAttribute('aria-label');
    });

    it('should be neutral with neither label nor decorative', () => {
      render(<Flag {...baseProps} />);

      const flag = getRoot();

      expect(flag).not.toHaveAttribute('role');
      expect(flag).not.toHaveAttribute('aria-label');
      expect(flag).not.toHaveAttribute('aria-hidden');
    });
  });
});
