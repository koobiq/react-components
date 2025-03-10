import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import {
  Typography,
  typographyPropAlign,
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
