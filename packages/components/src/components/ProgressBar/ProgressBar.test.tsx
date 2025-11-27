import { createRef } from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressBar } from './index';

describe('ProgressBar', () => {
  const baseProps = { 'aria-label': 'progressbar' };

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ProgressBar {...baseProps} ref={ref} />);
    const root = container.querySelector('div');
    expect(ref.current).toBe(root);
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    const { container } = render(
      <ProgressBar {...baseProps} className={className} />
    );

    const root = container.querySelector('div');
    expect(root?.className).toContain(className);
  });

  it('should set the value', () => {
    const value = 55;
    const { container } = render(<ProgressBar {...baseProps} value={value} />);
    const root = container.querySelector('div');

    expect(root).toHaveAttribute('aria-valuenow', '55');
  });

  it('should set the value greater than maxvalue', () => {
    const value = 120;
    const { container } = render(<ProgressBar {...baseProps} value={value} />);
    const root = container.querySelector('div');

    expect(root).toHaveAttribute('aria-valuenow', '100');
  });

  it('should set the value less than minvalue', () => {
    const value = -100;
    const { container } = render(<ProgressBar {...baseProps} value={value} />);
    const root = container.querySelector('div');

    expect(root).toHaveAttribute('aria-valuenow', '0');
  });

  it('should set indeterminate when `isIndeterminate` is true', () => {
    const value = 50;

    const { container } = render(
      <ProgressBar {...baseProps} value={value} isIndeterminate />
    );

    const root = container.querySelector('div');

    expect(root).toHaveAttribute('data-indeterminate', 'true');
  });

  it('should be indeterminate when no value is provided', () => {
    const { container } = render(<ProgressBar {...baseProps} />);

    const root = container.querySelector('div');

    expect(root).toHaveAttribute('data-indeterminate', 'true');
  });
});
