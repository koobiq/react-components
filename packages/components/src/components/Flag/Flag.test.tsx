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

  describe('check the hideShadow prop', () => {
    it('should show the shadow by default', () => {
      render(<Flag {...baseProps} />);

      expect(getRoot()).not.toHaveAttribute('data-hide-shadow');
    });

    it('should set data-hide-shadow when hideShadow is true', () => {
      render(<Flag {...baseProps} hideShadow />);

      expect(getRoot()).toHaveAttribute('data-hide-shadow', 'true');
    });
  });

  describe('check the size prop', () => {
    it('should not set --kbq-flag-size by default', () => {
      render(<Flag {...baseProps} />);

      expect(getRoot().style.getPropertyValue('--kbq-flag-size')).toBe('');
    });

    it('should set --kbq-flag-size in pixels for a number', () => {
      render(<Flag {...baseProps} size={24} />);

      expect(getRoot().style.getPropertyValue('--kbq-flag-size')).toBe('24px');
    });

    it('should set --kbq-flag-size verbatim for a string', () => {
      render(<Flag {...baseProps} size="2rem" />);

      expect(getRoot().style.getPropertyValue('--kbq-flag-size')).toBe('2rem');
    });

    it('should merge with the consumer style', () => {
      render(<Flag {...baseProps} size={24} style={{ color: 'red' }} />);

      const flag = getRoot();

      expect(flag.style.getPropertyValue('--kbq-flag-size')).toBe('24px');
      expect(flag.style.color).toBe('red');
    });
  });

  describe('check the aspectRatio prop', () => {
    it('should not set --kbq-flag-aspect-ratio by default', () => {
      render(<Flag {...baseProps} />);

      expect(getRoot().style.getPropertyValue('--kbq-flag-aspect-ratio')).toBe(
        ''
      );
    });

    it('should set --kbq-flag-aspect-ratio from a string', () => {
      render(<Flag {...baseProps} aspectRatio="4 / 3" />);

      expect(getRoot().style.getPropertyValue('--kbq-flag-aspect-ratio')).toBe(
        '4 / 3'
      );
    });

    it('should default the ratio to 1 / 1 for a circle', () => {
      render(<Flag {...baseProps} shape="circle" />);

      expect(getRoot().style.getPropertyValue('--kbq-flag-aspect-ratio')).toBe(
        '1 / 1'
      );
    });

    it('should let an explicit aspectRatio override the circle default', () => {
      render(<Flag {...baseProps} shape="circle" aspectRatio="4 / 3" />);

      expect(getRoot().style.getPropertyValue('--kbq-flag-aspect-ratio')).toBe(
        '4 / 3'
      );
    });
  });

  describe('accessibility attributes', () => {
    it('should forward role and aria-label for a meaningful flag', () => {
      render(<Flag {...baseProps} role="img" aria-label="Germany" />);

      const flag = getRoot();

      expect(flag).toHaveAttribute('role', 'img');
      expect(flag).toHaveAttribute('aria-label', 'Germany');
    });

    it('should forward aria-hidden for a decorative flag', () => {
      render(<Flag {...baseProps} aria-hidden="true" />);

      expect(getRoot()).toHaveAttribute('aria-hidden', 'true');
    });

    it('should add no role or aria attributes by default', () => {
      render(<Flag {...baseProps} />);

      const flag = getRoot();

      expect(flag).not.toHaveAttribute('role');
      expect(flag).not.toHaveAttribute('aria-label');
      expect(flag).not.toHaveAttribute('aria-hidden');
    });
  });
});
