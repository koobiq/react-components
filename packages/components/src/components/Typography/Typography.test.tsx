import { createRef } from 'react';

import { once } from '@koobiq/logger';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import {
  Typography,
  typographyPropAlign,
  typographyPropColor,
  typographyPropDisplay,
  typographyPropVariant,
} from './index';

describe('Typography', () => {
  const baseProps = { 'data-testid': 'text' };

  const getTypography = () => screen.getByTestId('text');

  it('should forward a ref', () => {
    const ref = createRef<HTMLParagraphElement>();

    const { container } = render(
      <Typography {...baseProps} ref={ref}>
        Text
      </Typography>
    );

    const typography = container.querySelector('p');
    expect(ref.current).toBe(typography);
  });

  it('should merge a custom class name with the default ones', () => {
    const props = {
      ...baseProps,
      className: 'foo',
    };

    render(<Typography {...props}>Text</Typography>);

    expect(getTypography()).toHaveClass('foo');
  });

  it('should render a text', () => {
    const props = {
      ...baseProps,
    };

    render(<Typography {...props}>foo</Typography>);

    expect(screen.getByText('foo')).toBeInTheDocument();
  });

  describe('check the variant prop', () => {
    it.each(typographyPropVariant)(
      'should apply the variant as a "%s"',
      (variant) => {
        render(<Typography {...baseProps} variant={variant} />);

        expect(getTypography()).toHaveAttribute('data-variant', variant);
      }
    );
  });

  describe('check the display prop', () => {
    it.each(typographyPropDisplay)(
      'should apply the display as a "%s"',
      (display) => {
        render(<Typography {...baseProps} display={display} />);

        expect(getTypography()).toHaveAttribute('data-display', display);
      }
    );
  });

  describe('check the align prop', () => {
    it.each(typographyPropAlign)(
      'should apply the align as a "%s"',
      (align) => {
        render(<Typography {...baseProps} align={align} />);

        expect(getTypography()).toHaveAttribute('data-align', align);
      }
    );
  });

  describe('check the color prop', () => {
    it.each(typographyPropColor)(
      'should apply the color as a "%s"',
      (color) => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(<Typography {...baseProps} color={color} />);

        expect(getTypography()).toHaveAttribute('data-color', color);

        warn.mockRestore();
      }
    );

    const deprecatedColors = ['error-less', 'success-less'] as const;

    it.each(deprecatedColors)(
      'should warn about the deprecated "%s" color',
      (color) => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        once.clear();

        render(<Typography {...baseProps} color={color} />);

        expect(warn).toHaveBeenCalledWith(
          expect.stringContaining(`the "${color}" color is deprecated`)
        );

        warn.mockRestore();
      }
    );
  });

  it('should apply the ellipsis as a true', () => {
    render(<Typography {...baseProps} ellipsis />);

    expect(getTypography()).toHaveAttribute('data-ellipsis', 'true');
  });

  const elements = ['p', 'article', 'div'] as const;

  it.each(elements)('should render as a "%s" element', (as) => {
    const { container } = render(<Typography as={as}>{as} Body</Typography>);
    const actual = container.querySelector(as);
    expect(actual).toBeVisible();
  });
});
