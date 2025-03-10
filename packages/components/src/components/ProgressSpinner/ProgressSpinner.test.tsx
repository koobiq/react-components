import { createRef } from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressSpinner, progressSpinnerPropSize } from './index';

describe('ProgressSpinner', () => {
  const baseProps = { label: 'progressbar' };

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ProgressSpinner {...baseProps} ref={ref} />);
    const root = container.querySelector('div');
    expect(ref.current).toBe(root);
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    const { container } = render(
      <ProgressSpinner {...baseProps} className={className} />
    );

    const root = container.querySelector('div');
    expect(root?.className).toContain(className);
  });

  describe('check the size prop', () => {
    it.each(progressSpinnerPropSize)(
      'should apply the size as a "%s"',
      (size) => {
        const { container } = render(
          <ProgressSpinner {...baseProps} size={size} />
        );

        const root = container.querySelector('div');
        expect(root).toHaveAttribute('data-size', size);
      }
    );
  });

  it('should set the value', () => {
    const value = 55;

    const { container } = render(
      <ProgressSpinner {...baseProps} value={value} />
    );

    const root = container.querySelector('div');

    expect(root).toHaveAttribute('aria-valuenow', '55');
  });

  it('should set the value greater than maxvalue', () => {
    const value = 120;

    const { container } = render(
      <ProgressSpinner {...baseProps} value={value} />
    );

    const root = container.querySelector('div');

    expect(root).toHaveAttribute('aria-valuenow', '100');
  });

  it('should set the value less than minvalue', () => {
    const value = -100;

    const { container } = render(
      <ProgressSpinner {...baseProps} value={value} />
    );

    const root = container.querySelector('div');

    expect(root).toHaveAttribute('aria-valuenow', '0');
  });
});
