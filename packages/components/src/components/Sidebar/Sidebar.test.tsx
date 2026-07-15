import { createRef } from 'react';

import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Sidebar, sidebarPropPlacement } from './index.js';
import type { SidebarRenderProps } from './index.js';

describe('Sidebar', () => {
  const baseProps = { 'data-testid': 'sidebar' };

  const getRoot = () => screen.getByTestId<HTMLDivElement>('sidebar');

  const content = ({ isOpen, open, close, toggle }: SidebarRenderProps) =>
    isOpen ? (
      <div data-testid="open-content">
        <button onClick={close}>close</button>
        <button onClick={toggle}>toggle</button>
      </div>
    ) : (
      <div data-testid="closed-content">
        <button onClick={open}>open</button>
        <button onClick={toggle}>toggle</button>
      </div>
    );

  it('should receive ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Sidebar {...baseProps} ref={ref} />);

    expect(ref.current).toBe(container.querySelector('div'));
  });

  it('should render the component with the correct tag', () => {
    render(<Sidebar {...baseProps} as="nav" />);

    expect(getRoot().tagName).toBe('NAV');
  });

  it('should merge the consumer style with the component variables', () => {
    render(<Sidebar {...baseProps} size={240} style={{ color: 'red' }} />);

    expect(getRoot().style.getPropertyValue('--sidebar-size')).toBe('240px');
    expect(getRoot().style.color).toBe('red');
  });

  it('should add no role or aria attributes by default', () => {
    render(<Sidebar {...baseProps} />);

    expect(getRoot()).not.toHaveAttribute('role');
    expect(getRoot()).not.toHaveAttribute('aria-label');
  });

  it('should forward role and aria-label', () => {
    render(<Sidebar {...baseProps} role="navigation" aria-label="Main" />);

    expect(getRoot()).toHaveAttribute('role', 'navigation');
    expect(getRoot()).toHaveAttribute('aria-label', 'Main');
  });

  describe('check the content', () => {
    it('should render static children', () => {
      render(
        <Sidebar {...baseProps}>
          <span data-testid="static" />
        </Sidebar>
      );

      expect(screen.getByTestId('static')).toBeInTheDocument();
    });

    it('should pass the state and the actions to the render function', () => {
      const children = vi.fn().mockReturnValue(null);

      render(<Sidebar {...baseProps}>{children}</Sidebar>);

      expect(children).toHaveBeenCalledWith({
        isOpen: false,
        open: expect.any(Function),
        close: expect.any(Function),
        toggle: expect.any(Function),
      });
    });

    it('should keep the children mounted when closed', () => {
      render(
        <Sidebar {...baseProps}>
          <span data-testid="static" />
        </Sidebar>
      );

      expect(getRoot()).toHaveAttribute('data-transition', 'exited');
      expect(screen.getByTestId('static')).toBeInTheDocument();
    });
  });

  describe('check the open state', () => {
    it('should be closed by default', () => {
      render(<Sidebar {...baseProps} />);

      expect(getRoot()).toHaveAttribute('data-transition', 'exited');
      expect(getRoot()).not.toHaveAttribute('data-open');
    });

    it('should be open when defaultOpen is set', () => {
      render(<Sidebar {...baseProps} defaultOpen />);

      expect(getRoot()).toHaveAttribute('data-transition', 'entered');
      expect(getRoot()).toHaveAttribute('data-open', 'true');
    });

    it('should follow the isOpen prop when controlled', () => {
      const { rerender } = render(<Sidebar {...baseProps} isOpen={false} />);

      expect(getRoot()).toHaveAttribute('data-transition', 'exited');

      rerender(<Sidebar {...baseProps} isOpen />);

      expect(getRoot()).toHaveAttribute('data-transition', 'entering');
    });

    it('should not call onOpenChange on mount', () => {
      const onOpenChange = vi.fn();

      render(
        <Sidebar {...baseProps} defaultOpen onOpenChange={onOpenChange} />
      );

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it.each([
      ['open', false, 'open', true],
      ['close', true, 'close', false],
      ['toggle from closed', false, 'toggle', true],
      ['toggle from open', true, 'toggle', false],
    ])('should %s', async (_, defaultOpen, button, expected) => {
      const onOpenChange = vi.fn();

      render(
        <Sidebar
          {...baseProps}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          {content}
        </Sidebar>
      );

      await userEvent.click(screen.getByRole('button', { name: button }));

      expect(onOpenChange).toHaveBeenCalledWith(expected);
    });

    it('should not change the rendered state when the controlled parent ignores it', async () => {
      render(
        <Sidebar {...baseProps} isOpen>
          {content}
        </Sidebar>
      );

      await userEvent.click(screen.getByRole('button', { name: 'close' }));

      expect(getRoot()).toHaveAttribute('data-transition', 'entered');
      expect(screen.getByTestId('open-content')).toBeInTheDocument();
    });
  });

  describe('check the content swap', () => {
    it('should keep the open content for the whole collapse', async () => {
      render(
        <Sidebar {...baseProps} defaultOpen>
          {content}
        </Sidebar>
      );

      await userEvent.click(screen.getByRole('button', { name: 'close' }));

      // The box is already shrinking, but the open content is still there.
      expect(getRoot()).toHaveAttribute('data-transition', 'exiting');
      expect(screen.getByTestId('open-content')).toBeInTheDocument();
      expect(screen.queryByTestId('closed-content')).not.toBeInTheDocument();

      await waitFor(() =>
        expect(screen.getByTestId('closed-content')).toBeInTheDocument()
      );

      expect(getRoot()).toHaveAttribute('data-transition', 'exited');
    });

    it('should show the open content as soon as the expand starts', async () => {
      render(<Sidebar {...baseProps}>{content}</Sidebar>);

      await userEvent.click(screen.getByRole('button', { name: 'open' }));

      // Asymmetric with the collapse on purpose: no waiting here.
      expect(getRoot()).toHaveAttribute('data-transition', 'entering');
      expect(screen.getByTestId('open-content')).toBeInTheDocument();

      await waitFor(() =>
        expect(getRoot()).toHaveAttribute('data-transition', 'entered')
      );
    });
  });

  describe('check the size props', () => {
    it('should set no size variables by default', () => {
      render(<Sidebar {...baseProps} />);

      expect(getRoot().style.getPropertyValue('--sidebar-size')).toBe('');

      expect(getRoot().style.getPropertyValue('--sidebar-closed-size')).toBe(
        ''
      );
    });

    it('should set the size variables in pixels', () => {
      render(<Sidebar {...baseProps} size={320} closedSize={56} />);

      expect(getRoot().style.getPropertyValue('--sidebar-size')).toBe('320px');

      expect(getRoot().style.getPropertyValue('--sidebar-closed-size')).toBe(
        '56px'
      );
    });
  });

  describe('check the placement prop', () => {
    it('should default to the start placement', () => {
      render(<Sidebar {...baseProps} />);

      expect(getRoot()).toHaveAttribute('data-placement', 'start');
    });

    it.each(sidebarPropPlacement)(
      'should apply the placement as a "%s"',
      (placement) => {
        render(<Sidebar {...baseProps} placement={placement} />);

        expect(getRoot()).toHaveAttribute('data-placement', placement);
      }
    );
  });

  describe('check the keyboard shortcut', () => {
    it.each([
      ['start', 'BracketLeft'],
      ['end', 'BracketRight'],
    ] as const)('should toggle a "%s" sidebar with %s', (placement, code) => {
      const onOpenChange = vi.fn();

      render(
        <Sidebar
          {...baseProps}
          placement={placement}
          onOpenChange={onOpenChange}
        />
      );

      fireEvent.keyDown(window, { code });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it.each([
      ['start', 'BracketRight'],
      ['end', 'BracketLeft'],
    ] as const)(
      'should not toggle a "%s" sidebar with %s',
      (placement, code) => {
        const onOpenChange = vi.fn();

        render(
          <Sidebar
            {...baseProps}
            placement={placement}
            onOpenChange={onOpenChange}
          />
        );

        fireEvent.keyDown(window, { code });

        expect(onOpenChange).not.toHaveBeenCalled();
      }
    );

    // The reason we match `code` and not `key`: on the ЙЦУКЕН layout the bracket
    // keys produce "х" and "ъ", so a `key` match would never fire.
    it('should match the physical key regardless of the layout', () => {
      const onOpenChange = vi.fn();

      render(<Sidebar {...baseProps} onOpenChange={onOpenChange} />);

      fireEvent.keyDown(window, { code: 'BracketLeft', key: 'х' });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it.each(['ctrlKey', 'metaKey', 'altKey'] as const)(
      'should ignore the shortcut when %s is held',
      (modifier) => {
        const onOpenChange = vi.fn();

        render(<Sidebar {...baseProps} onOpenChange={onOpenChange} />);

        fireEvent.keyDown(window, { code: 'BracketLeft', [modifier]: true });

        expect(onOpenChange).not.toHaveBeenCalled();
      }
    );

    it('should ignore the shortcut while typing', () => {
      const onOpenChange = vi.fn();

      render(
        <>
          <input data-testid="input" />
          <Sidebar {...baseProps} onOpenChange={onOpenChange} />
        </>
      );

      fireEvent.keyDown(screen.getByTestId('input'), { code: 'BracketLeft' });

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should ignore the shortcut inside a contenteditable', () => {
      const onOpenChange = vi.fn();

      render(
        <>
          <div
            data-testid="editor"
            contentEditable
            suppressContentEditableWarning
          />
          <Sidebar {...baseProps} onOpenChange={onOpenChange} />
        </>
      );

      const editor = screen.getByTestId('editor');
      // jsdom does not implement isContentEditable at all, so define it here.
      Object.defineProperty(editor, 'isContentEditable', { value: true });

      fireEvent.keyDown(editor, { code: 'BracketLeft' });

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should not listen when disableKeyboardShortcut is set', () => {
      const onOpenChange = vi.fn();

      render(
        <Sidebar
          {...baseProps}
          disableKeyboardShortcut
          onOpenChange={onOpenChange}
        />
      );

      fireEvent.keyDown(window, { code: 'BracketLeft' });

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should stop listening on unmount', () => {
      const onOpenChange = vi.fn();

      const { unmount } = render(
        <Sidebar {...baseProps} onOpenChange={onOpenChange} />
      );

      unmount();
      fireEvent.keyDown(window, { code: 'BracketLeft' });

      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  it('should merge the transition slot props', async () => {
    const onExited = vi.fn();

    render(
      <Sidebar
        {...baseProps}
        defaultOpen
        slotProps={{ transition: { onExited } }}
      >
        {content}
      </Sidebar>
    );

    await userEvent.click(screen.getByRole('button', { name: 'close' }));
    await waitFor(() => expect(onExited).toHaveBeenCalled());

    expect(screen.getByTestId('closed-content')).toBeInTheDocument();
  });
});
