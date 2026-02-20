import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ActionsPanelContainer } from '../index';
import type { ActionsPanelContainerProps } from '../index';

const renderComponent = (
  props: Omit<ActionsPanelContainerProps, 'children'> = {}
) =>
  render(
    <ActionsPanelContainer {...props}>
      <div>content</div>
    </ActionsPanelContainer>
  );

describe('ActionsPanelContainer', () => {
  const baseProps = { 'data-testid': 'container' };

  const getContainer = () => screen.getByTestId<HTMLDivElement>('container');

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();

    const { container } = render(
      <ActionsPanelContainer {...baseProps} ref={ref}>
        <div>content</div>
      </ActionsPanelContainer>
    );

    const component = container.querySelector('div');
    expect(ref.current).toBe(component);
  });

  it('should accept a custom class', () => {
    renderComponent({ ...baseProps, className: 'foo' });

    expect(getContainer()).toHaveClass('foo');
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    renderComponent({ ...baseProps, style });

    expect(getContainer()).toHaveStyle({ padding: '20px' });
  });

  it('should render children', () => {
    renderComponent(baseProps);

    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
