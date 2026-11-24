import type { CSSProperties } from 'react';
import { createRef } from 'react';

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createPortal } from 'react-dom';
import { describe, expect, it, vi, afterEach } from 'vitest';

import { Provider } from '../Provider';
import { Textarea } from '../Textarea';

import { InlineEdit, InlineEditSaveErrorHandlerProvider } from './index';
import type { InlineEditProps } from './index';

const resizeCallbacks: ResizeObserverCallback[] = [];

class ResizeObserverMock {
  constructor(callback: ResizeObserverCallback) {
    resizeCallbacks.push(callback);
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
  callback(0);

  return 1;
});

vi.stubGlobal('cancelAnimationFrame', () => undefined);

afterEach(() => {
  vi.useRealTimers();
});

const deferred = <T,>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
};

const renderStringEdit = (props: Partial<InlineEditProps<string>> = {}) => {
  const defaultProps: InlineEditProps<string> = {
    defaultValue: 'Security team',
    'data-testid': 'root',
    renderView: (value) => <span>{value}</span>,
    renderEdit: ({ value, onChange }) => (
      <input
        aria-label="Editor"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    ),
  };

  return render(<InlineEdit {...defaultProps} {...props} />);
};

describe('InlineEdit rendering', () => {
  it('renders only the view by default', () => {
    renderStringEdit();

    expect(screen.getByText('Security team')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'view');

    expect(screen.getByRole('button', { name: 'Edit' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('renders the editor when defaultMode is edit', () => {
    renderStringEdit({ defaultMode: 'edit' });

    expect(screen.getByRole('textbox', { name: 'Editor' })).toHaveValue(
      'Security team'
    );
  });

  it('updates an uncontrolled value through renderEdit', async () => {
    renderStringEdit({ defaultMode: 'edit' });
    const input = screen.getByRole('textbox', { name: 'Editor' });

    await userEvent.clear(input);
    await userEvent.type(input, 'Platform');

    expect(input).toHaveValue('Platform');
  });

  it('reports controlled changes without replacing the controlled prop', async () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <InlineEdit
        value="Security team"
        defaultMode="edit"
        onChange={onChange}
        renderView={(value) => value}
        renderEdit={({ value, onChange: change }) => (
          <input
            aria-label="Editor"
            value={value}
            onChange={(event) => change(event.target.value)}
          />
        )}
      />
    );

    const input = screen.getByRole('textbox', { name: 'Editor' });
    await userEvent.type(input, '!');
    expect(onChange).toHaveBeenLastCalledWith('Security team!');
    expect(input).toHaveValue('Security team');

    rerender(
      <InlineEdit
        value="Security team!"
        defaultMode="edit"
        onChange={onChange}
        renderView={(value) => value}
        renderEdit={({ value, onChange: change }) => (
          <input
            aria-label="Editor"
            value={value}
            onChange={(event) => change(event.target.value)}
          />
        )}
      />
    );

    expect(input).toHaveValue('Security team!');
  });

  it('forwards ref, className, style and DOM props to the root', () => {
    const ref = createRef<HTMLDivElement>();

    renderStringEdit({
      ref,
      className: 'custom',
      style: { marginBlockStart: 12 },
      'aria-describedby': 'description',
    });

    const root = screen.getByTestId('root');
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('custom');
    expect(root).toHaveStyle({ marginBlockStart: '12px' });
    expect(root).toHaveAttribute('aria-describedby', 'description');
  });

  it('renders consumer text through Placeholder', () => {
    render(<InlineEdit.Placeholder>Не назначен</InlineEdit.Placeholder>);

    expect(screen.getByText('Не назначен')).toHaveAttribute(
      'data-slot',
      'inline-edit-placeholder'
    );
  });
});

describe('InlineEdit interactions', () => {
  it('opens by click, saves by Enter and emits the current value', async () => {
    const onSaved = vi.fn();
    renderStringEdit({ onSaved });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    const input = await screen.findByRole('textbox', { name: 'Editor' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Platform');
    await userEvent.keyboard('{Enter}');

    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(onSaved).toHaveBeenCalledWith('Platform');

    await waitFor(() =>
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    );

    expect(screen.getByText('Platform')).toBeInTheDocument();
  });

  it.each(['{Enter}', ' '])('opens from the keyboard with %s', async (key) => {
    renderStringEdit();
    const view = screen.getByRole('button', { name: 'Edit' });
    view.focus();

    await userEvent.keyboard(key);

    expect(await screen.findByRole('textbox')).toBeInTheDocument();
  });

  it('respects a keydown prevented before it reaches the view', async () => {
    renderStringEdit({
      onKeyDownCapture: (event) => event.preventDefault(),
    });

    const view = screen.getByRole('button', { name: 'Edit' });
    view.focus();

    await userEvent.keyboard('{Enter}');

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(view).toHaveAttribute('aria-expanded', 'false');
  });

  it('cancelling restores the opening value and emits onCanceled', async () => {
    const onSaved = vi.fn();
    const onCanceled = vi.fn();
    renderStringEdit({ onSaved, onCanceled });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    const input = await screen.findByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'Rejected');
    await userEvent.keyboard('{Escape}');

    expect(onCanceled).toHaveBeenCalledTimes(1);
    expect(onSaved).not.toHaveBeenCalled();
    expect(screen.getByText('Security team')).toBeInTheDocument();
  });

  it('saves on outside click without stealing the clicked element focus', async () => {
    const onSaved = vi.fn();

    render(
      <>
        <button type="button">Outside</button>
        <InlineEdit
          defaultValue="Security team"
          onSaved={onSaved}
          renderView={(value) => value}
          renderEdit={({ value, onChange }) => (
            <input
              aria-label="Editor"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        />
      </>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await screen.findByRole('textbox');
    const outside = screen.getByRole('button', { name: 'Outside' });
    await userEvent.click(outside);

    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(onSaved).toHaveBeenCalledWith('Security team');
    expect(outside).toHaveFocus();
  });

  it('saves on a click of non-focusable chrome outside the host and panel', async () => {
    const onSaved = vi.fn();

    render(
      <>
        <div>Chrome</div>
        <InlineEdit
          defaultValue="Security team"
          onSaved={onSaved}
          renderView={(value) => value}
          renderEdit={({ value, onChange }) => (
            <input
              aria-label="Editor"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        />
      </>
    );

    const view = screen.getByRole('button', { name: 'Edit' });
    await userEvent.click(view);
    await screen.findByRole('textbox');
    await userEvent.click(screen.getByText('Chrome'));

    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(onSaved).toHaveBeenCalledWith('Security team');

    await waitFor(() =>
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    );

    expect(screen.getByText('Security team')).toBeInTheDocument();
    await vi.waitFor(() => expect(view).toHaveFocus());
  });

  it('keeps the editor open for a portaled popup action and saves outside', async () => {
    const onAction = vi.fn();
    const onSaved = vi.fn();

    render(
      <>
        <InlineEdit
          defaultValue="Security team"
          defaultMode="edit"
          onSaved={onSaved}
          renderView={(value) => value}
          renderEdit={() => (
            <>
              <input aria-label="Editor" defaultValue="Security team" />
              {createPortal(
                <button type="button" onClick={onAction}>
                  <span>Popup action</span>
                </button>,
                document.body
              )}
            </>
          )}
        />
        <button type="button">Outside</button>
      </>
    );

    const popupAction = screen.getByText('Popup action');
    await userEvent.click(popupAction);

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onSaved).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

    expect(onSaved).toHaveBeenCalledTimes(1);

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
  });

  it('does not open when disabled', async () => {
    renderStringEdit({ isDisabled: true });
    const view = screen.getByRole('button', { name: 'Edit' });

    expect(view).toHaveAttribute('aria-disabled', 'true');
    expect(view).toHaveAttribute('tabindex', '-1');
    await userEvent.click(view);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('supports controlled mode without synthesizing save or cancel', () => {
    const onSaved = vi.fn();
    const onCanceled = vi.fn();

    const { rerender } = render(
      <InlineEdit
        mode="view"
        value="Name"
        onSaved={onSaved}
        onCanceled={onCanceled}
        renderView={(value) => value}
        renderEdit={() => <input aria-label="Editor" />}
      />
    );

    rerender(
      <InlineEdit
        mode="edit"
        value="Name"
        onSaved={onSaved}
        onCanceled={onCanceled}
        renderView={(value) => value}
        renderEdit={() => <input aria-label="Editor" />}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    rerender(
      <InlineEdit
        mode="view"
        value="Name"
        onSaved={onSaved}
        onCanceled={onCanceled}
        renderView={(value) => value}
        renderEdit={() => <input aria-label="Editor" />}
      />
    );

    expect(onSaved).not.toHaveBeenCalled();
    expect(onCanceled).not.toHaveBeenCalled();
  });

  it('keeps reporting open requests after a controlled transition is rejected', () => {
    vi.useFakeTimers();

    try {
      const onModeChange = vi.fn();
      renderStringEdit({ mode: 'view', onModeChange });
      const view = screen.getByRole('button', { name: 'Edit' });

      act(() => {
        fireEvent.click(view);
        vi.advanceTimersByTime(0);
        fireEvent.click(view);
      });

      expect(onModeChange.mock.calls).toEqual([['edit'], ['edit']]);
      expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'view');
    } finally {
      vi.useRealTimers();
    }
  });

  it('allows save and cancel after a controlled close request is rejected', () => {
    vi.useFakeTimers();

    try {
      const onModeChange = vi.fn();
      const onSaved = vi.fn();
      const onCanceled = vi.fn();

      renderStringEdit({
        mode: 'edit',
        onModeChange,
        onSaved,
        onCanceled,
      });

      const input = screen.getByRole('textbox', { name: 'Editor' });

      act(() => {
        fireEvent.keyDown(input, { key: 'Enter' });
        vi.advanceTimersByTime(0);
        fireEvent.keyDown(input, { key: 'Escape' });
      });

      expect(onSaved).toHaveBeenCalledTimes(1);
      expect(onCanceled).toHaveBeenCalledTimes(1);
      expect(onModeChange.mock.calls).toEqual([['view'], ['view']]);
      expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'edit');
    } finally {
      vi.useRealTimers();
    }
  });

  it('emits save once when pointerdown, blur and click belong to one action', () => {
    const onSaved = vi.fn();
    renderStringEdit({ mode: 'edit', onSaved });
    const input = screen.getByRole('textbox', { name: 'Editor' });

    act(() => {
      fireEvent.pointerDown(document.body, { button: 0 });
      fireEvent.focusOut(input, { relatedTarget: document.body });
      fireEvent.click(document.body);
    });

    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it('opens from the label and reports mode transitions', async () => {
    const onModeChange = vi.fn();
    renderStringEdit({ label: 'Name', onModeChange });

    await userEvent.click(screen.getByText('Name'));
    expect(await screen.findByRole('textbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');

    expect(onModeChange.mock.calls).toEqual([['edit'], ['view']]);
  });

  it('saves from a click on its own host without reopening', async () => {
    const onSaved = vi.fn();
    renderStringEdit({ defaultMode: 'edit', onSaved });

    const root = screen.getByTestId('root');
    const view = screen.getByRole('button', { name: 'Edit' });
    await userEvent.click(root);

    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(root).toHaveAttribute('data-mode', 'view');

    await waitFor(() =>
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    );

    await vi.waitFor(() => expect(view).toHaveFocus());
  });

  it('uses the ru-RU accessible name from Provider', () => {
    render(
      <Provider locale="ru-RU">
        <InlineEdit
          defaultValue="Команда"
          renderView={(value) => value}
          renderEdit={() => <input aria-label="Редактор" />}
        />
      </Provider>
    );

    expect(
      screen.getByRole('button', { name: 'Редактировать' })
    ).toBeInTheDocument();
  });
});

it.each(['{Control>}{Enter}{/Control}', '{Meta>}{Enter}{/Meta}'])(
  'keeps plain Enter in textarea and saves with %s',
  async (shortcut) => {
    const onSaved = vi.fn();

    renderStringEdit({
      defaultMode: 'edit',
      onSaved,
      renderEdit: ({ value, onChange }) => (
        <Textarea aria-label="Editor" value={value} onChange={onChange} />
      ),
    });

    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'Line 1');
    await userEvent.keyboard('{Enter}');
    await userEvent.type(textarea, 'Line 2');

    expect(textarea).toHaveValue('Line 1\nLine 2');
    expect(onSaved).not.toHaveBeenCalled();

    await userEvent.keyboard(shortcut);
    expect(onSaved).toHaveBeenCalledWith('Line 1\nLine 2');
  }
);

it('ignores Enter and Escape during IME composition', () => {
  const onSaved = vi.fn();
  const onCanceled = vi.fn();
  renderStringEdit({ defaultMode: 'edit', onSaved, onCanceled });
  const input = screen.getByRole('textbox', { name: 'Editor' });

  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  fireEvent.keyDown(input, { key: 'Escape', isComposing: true });

  expect(onSaved).not.toHaveBeenCalled();
  expect(onCanceled).not.toHaveBeenCalled();
  expect(input).toBeInTheDocument();
});

it('does not save for a non-primary pointer button', () => {
  const onSaved = vi.fn();
  renderStringEdit({ defaultMode: 'edit', onSaved });

  fireEvent.pointerDown(document.body, { button: 2 });

  expect(onSaved).not.toHaveBeenCalled();
  expect(screen.getByRole('textbox', { name: 'Editor' })).toBeInTheDocument();
});

it('leaves Enter on a nested button to that button', async () => {
  const onAction = vi.fn();
  const onSaved = vi.fn();

  renderStringEdit({
    defaultMode: 'edit',
    onSaved,
    renderEdit: () => (
      <button type="button" onClick={onAction}>
        Run
      </button>
    ),
  });

  const button = await screen.findByRole('button', { name: 'Run' });
  button.focus();
  await userEvent.keyboard('{Enter}');

  expect(onAction).toHaveBeenCalledTimes(1);
  expect(onSaved).not.toHaveBeenCalled();
  expect(button).toBeInTheDocument();
});

it('rejects an untouched invalid value and shows its validation tooltip', async () => {
  const onSaved = vi.fn();

  renderStringEdit({
    defaultValue: '',
    defaultMode: 'edit',
    onSaved,
    validate: (value) => (value ? null : 'Required'),
    renderEdit: ({ value, onChange, isInvalid }) => (
      <input
        aria-label="Editor"
        aria-invalid={isInvalid || undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    ),
  });

  const input = screen.getByRole('textbox', { name: 'Editor' });
  input.focus();
  await userEvent.keyboard('{Enter}');

  expect(onSaved).not.toHaveBeenCalled();
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'edit');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Required');
});

it('hides validation after correction and saves the valid value', async () => {
  const onSaved = vi.fn();

  renderStringEdit({
    defaultValue: '',
    defaultMode: 'edit',
    onSaved,
    validate: (value) => (value ? null : 'Required'),
  });

  const input = screen.getByRole('textbox', { name: 'Editor' });
  input.focus();
  await userEvent.keyboard('{Enter}');
  expect(await screen.findByRole('tooltip')).toBeInTheDocument();

  await userEvent.type(input, 'Valid');
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  await userEvent.keyboard('{Enter}');
  expect(onSaved).toHaveBeenCalledWith('Valid');
});

it('keeps invalid edits open on outside click without an optional tooltip', async () => {
  const onSaved = vi.fn();

  renderStringEdit({
    defaultValue: '',
    defaultMode: 'edit',
    onSaved,
    showTooltipOnError: false,
    validate: (value) => (value ? null : 'Required'),
  });

  fireEvent.pointerDown(document.body, { button: 0 });

  expect(onSaved).not.toHaveBeenCalled();
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'edit');
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

it('keeps focus in an invalid editor after a Tab save attempt', async () => {
  const onSaved = vi.fn();

  renderStringEdit({
    defaultValue: '',
    defaultMode: 'edit',
    onSaved,
    validate: (value) => (value ? null : 'Required'),
  });

  const input = screen.getByRole('textbox', { name: 'Editor' });
  input.focus();
  await userEvent.keyboard('{Tab}');

  expect(onSaved).not.toHaveBeenCalled();
  expect(input).toHaveFocus();
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'edit');
});

it('commits a supplied editor value exactly once', async () => {
  const onSaved = vi.fn();

  renderStringEdit({
    defaultMode: 'edit',
    onSaved,
    renderEdit: ({ commit }) => (
      <button type="button" onClick={() => commit('Next value')}>
        Commit
      </button>
    ),
  });

  await userEvent.click(screen.getByRole('button', { name: 'Commit' }));

  expect(onSaved).toHaveBeenCalledTimes(1);
  expect(onSaved).toHaveBeenCalledWith('Next value');
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'view');
  expect(screen.getByText('Next value')).toBeInTheDocument();
});

it('does not save when the editor handled Tab and moved focus', () => {
  const onSaved = vi.fn();

  renderStringEdit({
    defaultMode: 'edit',
    onSaved,
    renderEdit: () => (
      <>
        <input
          aria-label="Editor"
          onKeyDown={(event) => {
            if (event.key !== 'Tab') return;

            event.preventDefault();
            screen.getByRole('textbox', { name: 'Other' }).focus();
          }}
        />
        <input aria-label="Other" />
      </>
    ),
  });

  const editor = screen.getByRole('textbox', { name: 'Editor' });
  editor.focus();
  fireEvent.keyDown(editor, { key: 'Tab' });

  expect(screen.getByRole('textbox', { name: 'Other' })).toHaveFocus();
  expect(onSaved).not.toHaveBeenCalled();
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'edit');
});

it('does not cancel an Escape already handled by the editor', async () => {
  const onCanceled = vi.fn();

  renderStringEdit({
    defaultMode: 'edit',
    onCanceled,
    renderEdit: ({ value, onChange }) => (
      <input
        aria-label="Editor"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') event.preventDefault();
        }}
      />
    ),
  });

  const input = await screen.findByRole('textbox');
  input.focus();
  await userEvent.keyboard('{Escape}');

  expect(onCanceled).not.toHaveBeenCalled();
  expect(input).toBeInTheDocument();
});

it('focuses and selects the existing input text on open', async () => {
  renderStringEdit();

  await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
  const input = await screen.findByRole<HTMLInputElement>('textbox');

  await vi.waitFor(() => expect(input).toHaveFocus());
  expect(input.selectionStart).toBe(0);
  expect(input.selectionEnd).toBe(input.value.length);
});

it('returns focus to the view after Escape', async () => {
  renderStringEdit();
  const view = screen.getByRole('button', { name: 'Edit' });

  await userEvent.click(view);
  await userEvent.keyboard('{Escape}');

  await vi.waitFor(() => expect(view).toHaveFocus());
});

it('does not steal focus moved synchronously by onSaved', async () => {
  render(
    <>
      <button type="button">Outside</button>
      <InlineEdit
        defaultValue="Security team"
        defaultMode="edit"
        onSaved={() => screen.getByRole('button', { name: 'Outside' }).focus()}
        renderView={(value) => value}
        renderEdit={({ value, onChange }) => (
          <input
            aria-label="Editor"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      />
    </>
  );

  const input = screen.getByRole('textbox', { name: 'Editor' });
  input.focus();
  await userEvent.keyboard('{Enter}');

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
});

it('uses editModeWidth for the Popover inline size', async () => {
  renderStringEdit({ defaultMode: 'edit', editModeWidth: 400 });
  const panel = await screen.findByRole('dialog');

  expect(panel.closest('[data-slot="inline-edit-panel"]')).toHaveStyle({
    '--popover-inline-size': '400px',
  });
});

it('measures the root without a label and follows its resize', async () => {
  renderStringEdit();

  const root = screen.getByTestId('root');

  const viewContainer = document.querySelector<HTMLElement>(
    '[data-slot="inline-edit-view-container"]'
  )!;

  const width = vi.spyOn(root, 'offsetWidth', 'get').mockReturnValue(240);
  const height = vi.spyOn(root, 'offsetHeight', 'get').mockReturnValue(40);
  vi.spyOn(viewContainer, 'offsetWidth', 'get').mockReturnValue(200);
  vi.spyOn(viewContainer, 'offsetHeight', 'get').mockReturnValue(20);

  await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
  const dialog = await screen.findByRole('dialog');
  const panel = dialog.closest('[data-slot="inline-edit-panel"]');

  expect(panel).toHaveStyle({ '--popover-inline-size': '240px' });

  width.mockReturnValue(320);
  height.mockReturnValue(48);

  const entry = {
    borderBoxSize: [{ inlineSize: 320, blockSize: 48 }],
    contentRect: {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 320,
      bottom: 48,
      width: 320,
      height: 48,
    },
  } as unknown as ResizeObserverEntry;

  await act(async () => {
    resizeCallbacks.forEach((callback) =>
      callback([entry], {} as ResizeObserver)
    );
  });

  await vi.waitFor(() =>
    expect(panel).toHaveStyle({ '--popover-inline-size': '320px' })
  );
});

it('measures the view container when a label is present', async () => {
  renderStringEdit({ label: 'Name' });

  const anchor = document.querySelector<HTMLElement>(
    '[data-slot="inline-edit-view-container"]'
  )!;

  vi.spyOn(anchor, 'offsetWidth', 'get').mockReturnValue(240);
  vi.spyOn(anchor, 'offsetHeight', 'get').mockReturnValue(40);

  await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
  const dialog = await screen.findByRole('dialog');
  const panel = dialog.closest('[data-slot="inline-edit-panel"]');

  expect(panel).toHaveStyle({ '--popover-inline-size': '240px' });
});

it('keeps interactive view content independent and restores anchor focus', async () => {
  renderStringEdit({
    renderView: () => <a href="#team">Team</a>,
  });

  const link = screen.getByRole('link', { name: 'Team' });
  expect(link.parentElement).not.toHaveAttribute('role');

  await userEvent.click(link);
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'view');
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

  const editAnchor = screen.getByRole('button', { name: 'Edit' });
  await userEvent.click(editAnchor);
  await userEvent.keyboard('{Escape}');

  await waitFor(() =>
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  );

  await vi.waitFor(() =>
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus()
  );
});

it('detects interactive content inserted after mount', async () => {
  const { rerender } = render(
    <InlineEdit
      defaultValue="Security team"
      renderView={(value) => value}
      renderEdit={() => <input aria-label="Editor" />}
    />
  );

  expect(
    document.querySelector('[data-slot="inline-edit-focus-anchor"]')
  ).not.toBeInTheDocument();

  rerender(
    <InlineEdit
      defaultValue="Security team"
      renderView={(value) => <a href="#team">{value}</a>}
      renderEdit={() => <input aria-label="Editor" />}
    />
  );

  await waitFor(() =>
    expect(
      document.querySelector('[data-slot="inline-edit-focus-anchor"]')
    ).toBeInTheDocument()
  );
});

it('replaces interactive selectors instead of extending defaults', async () => {
  renderStringEdit({
    interactiveSelectors: ['.custom-action'],
    renderView: () => (
      <>
        <a href="#team">Team</a>
        <button className="custom-action" type="button">
          Custom
        </button>
      </>
    ),
  });

  await userEvent.click(screen.getByRole('link', { name: 'Team' }));
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'edit');

  await userEvent.keyboard('{Escape}');
  await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'view');
});

it('does not inherit an interactive match from an outer link', async () => {
  render(
    <a href="#outer">
      <InlineEdit
        defaultValue="Security team"
        data-testid="root"
        renderView={(value) => value}
        renderEdit={() => <input aria-label="Editor" />}
      />
    </a>
  );

  await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'edit');
});

it('saves once when Enter activates the Save action', async () => {
  const onSaved = vi.fn();

  renderStringEdit({ defaultMode: 'edit', onSaved, showActions: true });
  const input = screen.getByRole('textbox', { name: 'Editor' });
  await userEvent.clear(input);
  await userEvent.type(input, 'Next value');

  const saveButton = screen.getByRole('button', { name: 'Save' });
  act(() => saveButton.focus());
  await userEvent.keyboard('{Enter}');

  expect(onSaved).toHaveBeenCalledTimes(1);
  expect(onSaved).toHaveBeenCalledWith('Next value');
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'view');
});

it('cancels once when Enter activates the Cancel action', async () => {
  const onSaved = vi.fn();
  const onCanceled = vi.fn();

  renderStringEdit({
    defaultMode: 'edit',
    onSaved,
    onCanceled,
    showActions: true,
  });

  const input = screen.getByRole('textbox', { name: 'Editor' });
  await userEvent.clear(input);
  await userEvent.type(input, 'Discard me');

  const cancelButton = screen.getByRole('button', { name: 'Cancel' });
  act(() => cancelButton.focus());
  await userEvent.keyboard('{Enter}');

  expect(onCanceled).toHaveBeenCalledTimes(1);
  expect(onSaved).not.toHaveBeenCalled();
  expect(screen.getByText('Security team')).toBeInTheDocument();
});

it('localizes Save and Cancel accessible names', () => {
  render(
    <Provider locale="ru-RU">
      <InlineEdit
        defaultValue="Значение"
        defaultMode="edit"
        showActions
        renderView={(value) => value}
        renderEdit={() => <input aria-label="Редактор" />}
      />
    </Provider>
  );

  expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument();

  expect(screen.getByRole('button', { name: 'Отменить' })).toBeInTheDocument();
});

it('keeps the action menu independent from a disabled editor', async () => {
  const onAction = vi.fn();

  renderStringEdit({
    isDisabled: true,
    menuAriaLabel: 'Value actions',
    menu: (
      <button type="button" onClick={onAction}>
        Run action
      </button>
    ),
  });

  expect(
    screen.getByRole('group', { name: 'Value actions' })
  ).toBeInTheDocument();

  const action = screen.getByRole('button', { name: 'Run action' });
  await userEvent.click(action);
  action.focus();
  await userEvent.keyboard('{Enter}');

  expect(onAction).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'view');
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

it('hides the action menu in edit mode', () => {
  renderStringEdit({
    defaultMode: 'edit',
    menu: <button type="button">Run action</button>,
  });

  expect(
    screen.queryByRole('button', { name: 'Run action' })
  ).not.toBeInTheDocument();
});

describe('InlineEdit async save', () => {
  it('closes optimistically and emits onSaved only after success', async () => {
    const request = deferred<void>();
    const onSave = vi.fn(() => request.promise);
    const onSaved = vi.fn();

    renderStringEdit({ defaultMode: 'edit', onSave, onSaved });
    const input = screen.getByRole('textbox', { name: 'Editor' });
    fireEvent.change(input, { target: { value: 'Next value' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'view');
    expect(screen.getByText('Next value')).toBeInTheDocument();
    expect(onSave).toHaveBeenCalledWith('Next value');
    expect(onSaved).not.toHaveBeenCalled();

    await act(async () => {
      request.resolve();
      await request.promise;
    });

    expect(onSaved).toHaveBeenCalledWith('Next value');
  });

  it('skips an unchanged request using the comparator', () => {
    const onSave = vi.fn(() => Promise.resolve());
    const onSaved = vi.fn();

    renderStringEdit({
      defaultMode: 'edit',
      onSave,
      onSaved,
      compareWith: (draft, initial) => draft === initial,
    });

    const input = screen.getByRole('textbox', { name: 'Editor' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSave).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
    expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'view');
  });

  it('delays progress for 100ms and keeps it visible for 300ms', async () => {
    vi.useFakeTimers();
    const request = deferred<void>();

    renderStringEdit({ defaultMode: 'edit', onSave: () => request.promise });
    const input = screen.getByRole('textbox', { name: 'Editor' });
    fireEvent.change(input, { target: { value: 'Next value' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    act(() => vi.advanceTimersByTime(99));
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await act(async () => {
      request.resolve();
      await request.promise;
    });

    act(() => vi.advanceTimersByTime(299));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('reports errors through local and context handlers and retries', async () => {
    const first = deferred<void>();
    const second = deferred<void>();

    const onSave = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const onSaved = vi.fn();
    const onSaveError = vi.fn();
    const contextHandler = vi.fn();

    render(
      <InlineEditSaveErrorHandlerProvider value={contextHandler}>
        <InlineEdit
          defaultValue="Security team"
          defaultMode="edit"
          onSave={onSave}
          onSaved={onSaved}
          onSaveError={onSaveError}
          data-testid="root"
          renderView={(value) => value}
          renderSaveError={({ retrySave }) => (
            <button type="button" onClick={retrySave}>
              Retry
            </button>
          )}
          renderEdit={({ value, onChange }) => (
            <input
              aria-label="Editor"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        />
      </InlineEditSaveErrorHandlerProvider>
    );

    const input = screen.getByRole('textbox', { name: 'Editor' });
    fireEvent.change(input, { target: { value: 'Next value' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await act(async () => {
      first.reject(new Error('Rejected'));
      await Promise.resolve();
    });

    expect(screen.getByTestId('root')).toHaveAttribute(
      'data-save-status',
      'error'
    );

    expect(screen.getByRole('status')).toHaveTextContent('Save failed');
    expect(onSaveError).toHaveBeenCalledTimes(1);
    expect(contextHandler).toHaveBeenCalledTimes(1);

    expect(onSaveError.mock.calls[0][0]).toMatchObject({
      retrySave: expect.any(Function),
      open: expect.any(Function),
      toggleMode: expect.any(Function),
      rollback: expect.any(Function),
    });

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onSave).toHaveBeenCalledTimes(2);

    await act(async () => {
      second.resolve();
      await second.promise;
    });

    expect(onSaved).toHaveBeenCalledWith('Next value');

    expect(screen.getByTestId('root')).toHaveAttribute(
      'data-save-status',
      'idle'
    );
  });

  it('rolls back a rejected optimistic value', async () => {
    const request = deferred<void>();

    renderStringEdit({
      defaultMode: 'edit',
      onSave: () => request.promise,
      renderSaveError: ({ rollback }) => (
        <button type="button" onClick={rollback}>
          Rollback
        </button>
      ),
    });

    const input = screen.getByRole('textbox', { name: 'Editor' });
    fireEvent.change(input, { target: { value: 'Next value' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await act(async () => {
      request.reject(new Error('Rejected'));
      await Promise.resolve();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Rollback' }));

    expect(screen.getByText('Security team')).toBeInTheDocument();

    expect(screen.getByTestId('root')).toHaveAttribute(
      'data-save-status',
      'idle'
    );
  });

  it('blocks reopening while pending and ignores completion after unmount', async () => {
    const request = deferred<void>();
    const onSaved = vi.fn();

    const { unmount } = renderStringEdit({
      defaultMode: 'edit',
      onSave: () => request.promise,
      onSaved,
    });

    const input = screen.getByRole('textbox', { name: 'Editor' });
    fireEvent.change(input, { target: { value: 'Next value' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByTestId('root')).toHaveAttribute('data-mode', 'view');

    unmount();

    await act(async () => {
      request.resolve();
      await request.promise;
    });

    expect(onSaved).not.toHaveBeenCalled();
  });
});

describe('InlineEdit style contract', () => {
  it('reflects edit and disabled states through data attributes', () => {
    const { rerender } = render(
      <InlineEdit
        defaultValue="Name"
        mode="view"
        data-testid="root"
        renderView={(value) => value}
        renderEdit={() => <input aria-label="Editor" />}
      />
    );

    const root = screen.getByTestId('root');

    expect(root).toHaveAttribute('data-mode', 'view');
    expect(root).not.toHaveAttribute('data-disabled');

    rerender(
      <InlineEdit
        defaultValue="Name"
        mode="edit"
        isDisabled
        data-testid="root"
        renderView={(value) => value}
        renderEdit={() => <input aria-label="Editor" />}
      />
    );

    expect(root).toHaveAttribute('data-mode', 'edit');
    expect(root).toHaveAttribute('data-disabled', 'true');
  });

  it('accepts public CSS variable overrides on the root', () => {
    renderStringEdit({
      style: {
        '--kbq-inline-edit-height': '48px',
      } as CSSProperties,
    });

    expect(screen.getByTestId('root')).toHaveStyle({
      '--kbq-inline-edit-height': '48px',
    });
  });
});
