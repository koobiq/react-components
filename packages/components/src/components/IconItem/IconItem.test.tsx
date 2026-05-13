import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  IconItem,
  iconItemPropColor,
  iconItemPropSize,
  iconItemPropVariant,
} from './index';

describe('IconItem', () => {
  const baseProps = { 'data-testid': 'icon-item' };

  const getRoot = () => screen.getByTestId('icon-item');

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<IconItem {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getRoot());
  });

  it('should render children', () => {
    render(<IconItem {...baseProps}>Icon</IconItem>);

    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('should render the component with default data attributes', () => {
    render(<IconItem {...baseProps} />);

    expect(getRoot()).toHaveAttribute('data-size', 'normal');
    expect(getRoot()).toHaveAttribute('data-color', 'theme');
    expect(getRoot()).toHaveAttribute('data-variant', 'solid');
  });

  it('should render the component as a custom root tag', () => {
    render(
      <IconItem {...baseProps} as="a" href="https://example.com">
        Icon
      </IconItem>
    );

    const root = getRoot();

    expect(root.tagName).toBe('A');
    expect(root).toHaveAttribute('href', 'https://example.com');
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    render(<IconItem {...baseProps} className={className} />);

    expect(getRoot()).toHaveClass(className);
  });

  describe('check the size prop', () => {
    it.each(iconItemPropSize)('should apply the size as a "%s"', (size) => {
      render(<IconItem {...baseProps} size={size} />);

      expect(getRoot()).toHaveAttribute('data-size', size);
    });
  });

  describe('check the color prop', () => {
    it.each(iconItemPropColor)('should apply the color as a "%s"', (color) => {
      render(<IconItem {...baseProps} color={color} />);

      expect(getRoot()).toHaveAttribute('data-color', color);
    });
  });

  describe('check the variant prop', () => {
    it.each(iconItemPropVariant)(
      'should apply the variant as a "%s"',
      (variant) => {
        render(<IconItem {...baseProps} variant={variant} />);

        expect(getRoot()).toHaveAttribute('data-variant', variant);
      }
    );
  });
});
