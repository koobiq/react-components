import { createRef } from 'react';

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Form, type FormProps } from './index';

describe('Form', () => {
  const baseProps = { 'data-testid': 'form' };

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    const props: FormProps = {
      ...baseProps,
      className,
    };

    const { container } = render(<Form {...props} />);

    const root = container.querySelector('form');

    expect(root).toHaveClass(className);
  });

  it('should forward a ref', () => {
    const ref = createRef<HTMLFormElement>();
    const { container } = render(<Form {...baseProps} ref={ref} />);
    const root = container.querySelector('form');
    expect(ref.current).toBe(root);
  });
});
