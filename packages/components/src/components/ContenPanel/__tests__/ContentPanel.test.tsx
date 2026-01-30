import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { ContentPanel, ContentPanelContainer } from '../index.js';

// Mock container width for ContentPanelContainer tests.
vi.mock('@koobiq/react-core', async () => {
  const actual = await vi.importActual<any>('@koobiq/react-core');

  return {
    ...actual,
    useResizeObserverRefs: () => [800, 0], // containerWidth=800px
  };
});

describe('ContentPanel', () => {
  const baseProps = { 'data-testid': 'panel' };

  const getPanel = () => screen.getByTestId<HTMLDivElement>('panel');

  const user = userEvent.setup();

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ContentPanel {...baseProps} ref={ref} />);

    const component = container.querySelector('div');

    expect(ref.current).toBe(component);
  });

  it('should accept a custom class', () => {
    render(<ContentPanel {...baseProps} className="foo" defaultOpen />);

    expect(getPanel()).toHaveClass('foo');
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    render(<ContentPanel {...baseProps} style={style} defaultOpen />);

    expect(getPanel()).toHaveStyle({ padding: '20px' });
  });

  it('should render resizer when isResizable is true', () => {
    render(
      <ContentPanel
        {...baseProps}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        defaultOpen
        isResizable
      >
        content
      </ContentPanel>
    );

    expect(screen.getByTestId('resizer')).toBeInTheDocument();
  });

  it('should not render resizer when isResizable is false', () => {
    render(
      <ContentPanel
        {...baseProps}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        defaultOpen
      >
        content
      </ContentPanel>
    );

    expect(screen.queryByTestId('resizer')).not.toBeInTheDocument();
  });

  it('should apply width prop to inlineSize when resizable', () => {
    render(
      <ContentPanel
        {...baseProps}
        defaultOpen
        width={500}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        isResizable
      >
        content
      </ContentPanel>
    );

    expect(getPanel()).toHaveStyle({ inlineSize: '500px' });
  });

  it('should reset width on resizer double click', async () => {
    const onResize = vi.fn();
    const onResetResize = vi.fn(() => 300);

    render(
      <ContentPanel
        {...baseProps}
        defaultWidth={450}
        onResize={onResize}
        onResetResize={onResetResize}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        defaultOpen
        isResizable
      >
        content
      </ContentPanel>
    );

    expect(getPanel()).toHaveStyle({ inlineSize: '450px' });

    await user.dblClick(screen.getByTestId('resizer'));

    expect(onResetResize).toHaveBeenCalledWith(450);
    expect(getPanel()).toHaveStyle({ inlineSize: '300px' });

    expect(onResize).toHaveBeenCalled();
    expect(onResize.mock.calls.at(-1)?.[0]).toBe(300);
  });

  const renderInContainer = (panelProps?: Record<string, any>) =>
    render(
      <ContentPanelContainer defaultOpen>
        <ContentPanel {...baseProps} defaultOpen isResizable {...panelProps}>
          content
        </ContentPanel>
      </ContentPanelContainer>
    );

  it('should clamp width by container width', () => {
    renderInContainer({ width: 1200 });

    expect(getPanel()).toHaveStyle({ inlineSize: '800px' });
  });

  it('should clamp width by maxWidth when it is smaller than container', () => {
    renderInContainer({ width: 1200, maxWidth: 600 });

    expect(getPanel()).toHaveStyle({ inlineSize: '600px' });
  });

  it('should clamp width by container when maxWidth is larger than container', () => {
    renderInContainer({ width: 1200, maxWidth: 2000 });

    expect(getPanel()).toHaveStyle({ inlineSize: '800px' });
  });
});
