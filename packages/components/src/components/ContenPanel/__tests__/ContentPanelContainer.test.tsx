import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ContentPanelContainer } from '../index.js';

describe('ContentPanelContainer', () => {
  const baseProps = { 'data-testid': 'container' };

  const getContainer = () => screen.getByTestId<HTMLDivElement>('container');

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();

    const { container } = render(
      <ContentPanelContainer {...baseProps} ref={ref} />
    );

    const component = container.querySelector('div');
    expect(ref.current).toBe(component);
  });

  it('should accept a custom class', () => {
    render(
      <ContentPanelContainer {...baseProps} className="foo" defaultOpen />
    );

    expect(getContainer()).toHaveClass('foo');
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    render(<ContentPanelContainer {...baseProps} style={style} defaultOpen />);
    expect(getContainer()).toHaveStyle({ padding: '20px' });
  });

  describe('slotProps.body', () => {
    const getBody = () => screen.getByTestId<HTMLDivElement>('body');

    it('should accept a custom class', () => {
      render(
        <ContentPanelContainer
          {...baseProps}
          defaultOpen
          slotProps={{
            body: { 'data-testid': 'body', className: 'body-foo' },
          }}
        />
      );

      expect(getBody()).toHaveClass('body-foo');
    });

    it('should set a custom style', () => {
      render(
        <ContentPanelContainer
          {...baseProps}
          defaultOpen
          slotProps={{
            body: { 'data-testid': 'body', style: { padding: 20 } },
          }}
        />
      );

      expect(getBody()).toHaveStyle({ padding: '20px' });
    });

    it('should accept the ref', () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <ContentPanelContainer
          {...baseProps}
          defaultOpen
          slotProps={{
            body: { 'data-testid': 'body', ref },
          }}
        />
      );

      expect(ref.current).toBe(getBody());
    });

    it('should pass through custom attributes', () => {
      render(
        <ContentPanelContainer
          {...baseProps}
          defaultOpen
          slotProps={{
            body: {
              'data-testid': 'body',
              'data-foo': 'bar',
              tabIndex: 0,
            },
          }}
        />
      );

      expect(getBody()).toHaveAttribute('data-foo', 'bar');
      expect(getBody()).toHaveAttribute('tabindex', '0');
    });
  });
});
