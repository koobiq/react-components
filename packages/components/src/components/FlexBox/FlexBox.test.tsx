import { createRef } from 'react';

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { FlexBox } from './index';
import type { FlexBoxProps } from './index';

describe('FlexBox', () => {
  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    const props: FlexBoxProps = {
      className,
    };

    const { container } = render(<FlexBox {...props} />);

    const flexBox = container.querySelector('div');

    expect(flexBox).toHaveClass(className);
  });

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<FlexBox ref={ref} />);
    const flexBox = container.querySelector('div');
    expect(ref.current).toBe(flexBox);
  });
});
