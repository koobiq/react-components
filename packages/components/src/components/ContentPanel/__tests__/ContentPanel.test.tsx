import { createRef } from 'react';

import { fireEvent, screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { Provider } from '../../Provider';
import { ContentPanel, ContentPanelContainer } from '../index.js';

const mocks = vi.hoisted(() => ({ containerWidth: 800 }));

// Mock container width for ContentPanelContainer tests.
vi.mock('@koobiq/react-core', async () => {
  const actual = await vi.importActual<any>('@koobiq/react-core');

  return {
    ...actual,
    useResizeObserverRefs: () => [mocks.containerWidth, 0],
  };
});

describe('ContentPanel', () => {
  const baseProps = { 'data-testid': 'panel' };

  const getPanel = () => screen.getByTestId<HTMLDivElement>('panel');
  const getResizer = () => screen.getByTestId<HTMLDivElement>('resizer');

  const user = userEvent.setup();

  // Without `PointerEvent`, `useMove` falls back to mouse events jsdom can fire.
  beforeEach(() => {
    mocks.containerWidth = 800;
    vi.stubGlobal('PointerEvent', undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it('should apply the width prop when resizable', () => {
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

    expect(getPanel()).toHaveStyle({ width: '500px' });
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

    expect(getPanel()).toHaveStyle({ width: '450px' });

    await user.dblClick(screen.getByTestId('resizer'));

    expect(onResetResize).toHaveBeenCalledWith(450);
    expect(getPanel()).toHaveStyle({ width: '300px' });

    expect(onResize).toHaveBeenCalled();
    expect(onResize.mock.calls.at(-1)?.[0]).toBe(300);
  });

  it('should expose the separator semantics of the resize handle', () => {
    render(
      <ContentPanel
        {...baseProps}
        defaultWidth={400}
        minWidth={200}
        maxWidth={800}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        defaultOpen
        isResizable
      >
        content
      </ContentPanel>
    );

    const resizer = getResizer();

    expect(resizer).toHaveAttribute('role', 'separator');
    expect(resizer).toHaveAttribute('aria-orientation', 'vertical');
    expect(resizer).toHaveAttribute('aria-label', 'Resize panel');
    expect(resizer).toHaveAttribute('aria-valuenow', '400');
    expect(resizer).toHaveAttribute('aria-valuemin', '200');
    expect(resizer).toHaveAttribute('aria-valuemax', '800');
    expect(resizer).toHaveAttribute('aria-controls', getPanel().id);
    expect(resizer).toHaveAttribute('tabindex', '-1');
  });

  it('should not announce a range for an unbounded panel', () => {
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

    expect(getResizer()).toHaveAttribute('aria-valuenow', '400');
    expect(getResizer()).not.toHaveAttribute('aria-valuemax');
  });

  it('should localize the resize handle label', () => {
    render(
      <Provider locale="ru-RU">
        <ContentPanel
          {...baseProps}
          slotProps={{ resizer: { 'data-testid': 'resizer' } }}
          defaultOpen
          isResizable
        >
          content
        </ContentPanel>
      </Provider>
    );

    expect(getResizer()).toHaveAttribute(
      'aria-label',
      'Изменить ширину панели'
    );
  });

  it('should flip the resize handle in RTL', () => {
    render(
      <Provider locale="he-IL">
        <ContentPanel
          {...baseProps}
          slotProps={{ resizer: { 'data-testid': 'resizer' } }}
          defaultOpen
          isResizable
        >
          content
        </ContentPanel>
      </Provider>
    );

    // The panel is pinned to the inline end edge, so the handle is physically
    // flipped in RTL, where the inline start edge is on the right.
    expect(getResizer()).toHaveAttribute('data-direction-x', '1');
    expect(getResizer()).toHaveAttribute('data-direction-y', '0');
  });

  it('should not resize with the keyboard', () => {
    const onResize = vi.fn();

    render(
      <ContentPanel
        {...baseProps}
        defaultWidth={400}
        onResize={onResize}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        defaultOpen
        isResizable
      >
        content
      </ContentPanel>
    );

    fireEvent.keyDown(getResizer(), { key: 'ArrowLeft' });

    expect(getPanel()).toHaveStyle({ width: '400px' });
    expect(onResize).not.toHaveBeenCalled();
  });

  it('should mark the panel while resizing and report rounded widths', () => {
    const onResizeStart = vi.fn();
    const onResizeEnd = vi.fn();

    render(
      <ContentPanel
        {...baseProps}
        defaultWidth={400.4}
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        defaultOpen
        isResizable
      >
        content
      </ContentPanel>
    );

    fireEvent.mouseDown(getResizer(), { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { button: 0, clientX: -40, clientY: 10 });

    expect(onResizeStart).toHaveBeenCalledWith(400);
    expect(getPanel()).toHaveAttribute('data-resizing', 'true');
    expect(getPanel()).toHaveStyle({ width: '450.4px' });

    fireEvent.mouseUp(window, { button: 0, clientX: -40, clientY: 10 });

    expect(getPanel()).not.toHaveAttribute('data-resizing');
    expect(onResizeEnd).toHaveBeenCalledWith(450);
  });

  it('should not manage the width when it is not resizable', () => {
    render(
      <ContentPanel {...baseProps} defaultWidth={400} defaultOpen>
        content
      </ContentPanel>
    );

    expect(getPanel().style.width).toBe('');
    expect(getPanel().style.minWidth).toBe('');
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

    expect(getPanel()).toHaveStyle({ width: '800px' });
  });

  it('should clamp width by maxWidth when it is smaller than container', () => {
    renderInContainer({ width: 1200, maxWidth: 600 });

    expect(getPanel()).toHaveStyle({ width: '600px' });
  });

  it('should clamp width by container when maxWidth is larger than container', () => {
    renderInContainer({ width: 1200, maxWidth: 2000 });

    expect(getPanel()).toHaveStyle({ width: '800px' });
  });

  it('should shrink the panel when the container shrinks', () => {
    const renderPanel = () => (
      <ContentPanelContainer defaultOpen>
        <ContentPanel {...baseProps} defaultWidth={700} defaultOpen isResizable>
          content
        </ContentPanel>
      </ContentPanelContainer>
    );

    const { rerender } = render(renderPanel());

    expect(getPanel()).toHaveStyle({ width: '700px' });

    mocks.containerWidth = 500;
    rerender(renderPanel());

    expect(getPanel()).toHaveStyle({ width: '500px' });
  });

  it('should resolve a percentage default width once the container is measured', () => {
    // The container isn't measured on the first render.
    mocks.containerWidth = 0;

    const renderPanel = () => (
      <ContentPanelContainer defaultOpen>
        <ContentPanel {...baseProps} defaultWidth="50%" defaultOpen isResizable>
          content
        </ContentPanel>
      </ContentPanelContainer>
    );

    const { rerender } = render(renderPanel());

    mocks.containerWidth = 1000;
    rerender(renderPanel());

    expect(getPanel()).toHaveStyle({ width: '500px' });
  });

  it('should reset to a percentage width resolved against the container', () => {
    const onResetResize = vi.fn(() => undefined);

    mocks.containerWidth = 0;

    const renderPanel = () => (
      <ContentPanelContainer defaultOpen>
        <ContentPanel
          {...baseProps}
          defaultWidth="50%"
          onResetResize={onResetResize}
          slotProps={{ resizer: { 'data-testid': 'resizer' } }}
          defaultOpen
          isResizable
        >
          content
        </ContentPanel>
      </ContentPanelContainer>
    );

    const { rerender } = render(renderPanel());

    mocks.containerWidth = 1000;
    rerender(renderPanel());

    fireEvent.mouseDown(getResizer(), { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { button: 0, clientX: -90, clientY: 10 });
    fireEvent.mouseUp(window, { button: 0, clientX: -90, clientY: 10 });

    expect(getPanel()).toHaveStyle({ width: '600px' });

    fireEvent.doubleClick(getResizer());

    expect(onResetResize).toHaveBeenCalledWith(500);
    expect(getPanel()).toHaveStyle({ width: '500px' });
  });

  it('should report the width without changing a controlled panel', () => {
    const onResize = vi.fn();

    render(
      <ContentPanel
        {...baseProps}
        width={500}
        onResize={onResize}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        defaultOpen
        isResizable
      >
        content
      </ContentPanel>
    );

    fireEvent.mouseDown(getResizer(), { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { button: 0, clientX: -40, clientY: 10 });

    expect(onResize).toHaveBeenLastCalledWith(550);
    expect(getPanel()).toHaveStyle({ width: '500px' });

    fireEvent.mouseUp(window, { button: 0, clientX: -40, clientY: 10 });
  });

  it('should constrain the panel with the resolved bounds', () => {
    renderInContainer({ defaultWidth: '60%', minWidth: 300 });

    expect(getPanel()).toHaveStyle({
      width: '480px',
      minWidth: '300px',
      maxWidth: '800px',
    });
  });

  it('should drop the managed width when it stops being resizable', () => {
    const renderPanel = (isResizable: boolean) => (
      <ContentPanel
        {...baseProps}
        defaultWidth={400}
        defaultOpen
        isResizable={isResizable}
      >
        content
      </ContentPanel>
    );

    const { rerender } = render(renderPanel(true));

    expect(getPanel()).toHaveStyle({ width: '400px' });

    rerender(renderPanel(false));

    expect(getPanel().style.width).toBe('');
  });

  it('should follow the container again after a reset', () => {
    const onResize = vi.fn();

    const renderPanel = () => (
      <ContentPanelContainer defaultOpen>
        <ContentPanel
          {...baseProps}
          defaultWidth="50%"
          onResize={onResize}
          slotProps={{ resizer: { 'data-testid': 'resizer' } }}
          defaultOpen
          isResizable
        >
          content
        </ContentPanel>
      </ContentPanelContainer>
    );

    mocks.containerWidth = 1000;

    const { rerender } = render(renderPanel());

    fireEvent.mouseDown(getResizer(), { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { button: 0, clientX: -90, clientY: 10 });
    fireEvent.mouseUp(window, { button: 0, clientX: -90, clientY: 10 });

    expect(getPanel()).toHaveStyle({ width: '600px' });

    fireEvent.doubleClick(getResizer());

    expect(getPanel()).toHaveStyle({ width: '500px' });
    expect(onResize).toHaveBeenLastCalledWith(500);

    mocks.containerWidth = 1600;
    rerender(renderPanel());

    expect(getPanel()).toHaveStyle({ width: '800px' });
  });

  it('should keep the default width it was mounted with', () => {
    const onResetResize = vi.fn(() => undefined);

    const renderPanel = (defaultWidth: number) => (
      <ContentPanel
        {...baseProps}
        defaultWidth={defaultWidth}
        onResetResize={onResetResize}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        defaultOpen
        isResizable
      >
        content
      </ContentPanel>
    );

    const { rerender } = render(renderPanel(400));

    rerender(renderPanel(600));

    expect(getPanel()).toHaveStyle({ width: '400px' });

    fireEvent.doubleClick(getResizer());

    expect(onResetResize).toHaveBeenCalledWith(400);
    expect(getPanel()).toHaveStyle({ width: '400px' });
  });

  it('should let slotProps override the handle label', () => {
    render(
      <ContentPanel
        {...baseProps}
        slotProps={{
          resizer: { 'data-testid': 'resizer', 'aria-label': 'Resize preview' },
        }}
        defaultOpen
        isResizable
      >
        content
      </ContentPanel>
    );

    expect(getResizer()).toHaveAttribute('aria-label', 'Resize preview');
  });

  it('should let a custom style win over the managed sizing', () => {
    renderInContainer({
      defaultWidth: 400,
      style: { maxWidth: 'calc(100% - 48px)' },
    });

    expect(getPanel().style.maxWidth).toBe('calc(100% - 48px)');
    expect(getPanel().style.width).toBe('400px');
  });

  it('should clamp the width returned by onResetResize', () => {
    const onResetResize = vi.fn(() => 999);

    renderInContainer({
      defaultWidth: 400,
      maxWidth: 600,
      onResetResize,
      slotProps: { resizer: { 'data-testid': 'resizer' } },
    });

    fireEvent.doubleClick(getResizer());

    expect(onResetResize).toHaveBeenCalledWith(400);
    expect(getPanel()).toHaveStyle({ width: '600px' });
  });

  it('should clamp the width to the bounds while dragging', () => {
    render(
      <ContentPanel
        {...baseProps}
        defaultWidth={400}
        minWidth={300}
        maxWidth={500}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        defaultOpen
        isResizable
      >
        content
      </ContentPanel>
    );

    fireEvent.mouseDown(getResizer(), { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { button: 0, clientX: -190, clientY: 10 });

    expect(getPanel()).toHaveStyle({ width: '500px' });

    fireEvent.mouseMove(window, { button: 0, clientX: 210, clientY: 10 });

    expect(getPanel()).toHaveStyle({ width: '300px' });

    fireEvent.mouseUp(window, { button: 0, clientX: 210, clientY: 10 });
  });

  it('should reset a controlled panel to the width it was mounted with', () => {
    const onResetResize = vi.fn(() => undefined);

    const renderPanel = (width: number) => (
      <ContentPanel
        {...baseProps}
        width={width}
        onResetResize={onResetResize}
        slotProps={{ resizer: { 'data-testid': 'resizer' } }}
        defaultOpen
        isResizable
      >
        content
      </ContentPanel>
    );

    const { rerender } = render(renderPanel(500));

    rerender(renderPanel(700));

    expect(getPanel()).toHaveStyle({ width: '700px' });

    fireEvent.doubleClick(getResizer());

    expect(onResetResize).toHaveBeenCalledWith(500);
  });
});
