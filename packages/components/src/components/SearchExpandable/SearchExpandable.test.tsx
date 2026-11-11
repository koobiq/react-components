import {
  StrictMode,
  createRef,
  useState,
  type FormEvent,
  type ReactElement,
} from 'react';

import {
  act,
  createEvent,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import axe from 'axe-core';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Form } from '../Form';
import { Modal } from '../Modal';
import { Provider } from '../Provider';

import {
  SearchExpandable,
  type SearchExpandableButtonSlotProps,
  type SearchExpandableCloseButtonSlotProps,
  type SearchExpandableInputSlotProps,
  type SearchExpandableProps,
  type SearchExpandableRef,
} from './index';
import { useSearchExpandableValue } from './useSearchExpandableValue';
import {
  normalizeSearchExpandableValue,
  resolveSearchExpandableText,
} from './utils';

const renderSearchExpandable = () =>
  render(
    <Provider locale="en-US">
      <SearchExpandable
        data-testid="root"
        className="foo"
        style={{ padding: 20 }}
      />
    </Provider>
  );

const getRoot = () => screen.getByTestId('root');

type GlobalWithJest = {
  jest?: Record<string, unknown>;
};

type ReadOnlyIsPublic = 'isReadOnly' extends keyof SearchExpandableProps
  ? true
  : false;

type OwnedInputSlotKeys =
  'aria-disabled' | 'aria-readonly' | 'as' | 'disabled' | 'hidden' | 'readOnly';

type OwnedCloseButtonSlotKeys =
  'aria-disabled' | 'disabled' | 'hidden' | 'isDisabled';

type OwnedButtonSlotKeys =
  'aria-disabled' | 'disabled' | 'hidden' | 'isDisabled';

type RemovedInputSlotKeysArePrivate = [
  Extract<OwnedInputSlotKeys, keyof SearchExpandableInputSlotProps>,
] extends [never]
  ? false
  : true;

type RemovedCloseButtonSlotKeysArePrivate = [
  Extract<OwnedCloseButtonSlotKeys, keyof SearchExpandableCloseButtonSlotProps>,
] extends [never]
  ? false
  : true;

type RemovedButtonSlotKeysArePrivate = [
  Extract<OwnedButtonSlotKeys, keyof SearchExpandableButtonSlotProps>,
] extends [never]
  ? false
  : true;

describe('SearchExpandable', () => {
  it('should render the collapsed button', () => {
    renderSearchExpandable();

    const trigger = screen.getByRole('button', { name: 'Search' });

    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('tabindex', '0');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    expect(getRoot()).toHaveAttribute('data-slot', 'search-expandable');
    expect(getRoot()).toHaveClass('foo');
    expect(getRoot()).toHaveStyle({ padding: '20px' });
    expect(getRoot()).not.toHaveAttribute('data-open');
    expect(getRoot()).not.toHaveAttribute('data-fullwidth');
  });

  it('should expand into the search field on trigger press', async () => {
    renderSearchExpandable();

    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    const input = screen.getByRole('textbox', { name: 'Search' });

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('autocomplete', 'off');

    expect(
      screen.queryByRole('button', { name: 'Search' })
    ).not.toBeInTheDocument();

    expect(getRoot()).toHaveAttribute('data-open', 'true');
  });

  it('should keep the close button keyboard reachable when the field is empty', async () => {
    renderSearchExpandable();

    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    const closeButton = screen.getByRole('button', { name: 'Close' });

    expect(closeButton.tagName).toBe('BUTTON');
    expect(closeButton).toHaveAttribute('type', 'button');
    expect(closeButton).not.toBeDisabled();
    expect(closeButton).not.toHaveAttribute('aria-hidden', 'true');
    expect(closeButton).not.toHaveAttribute('tabindex', '-1');

    await userEvent.click(screen.getByRole('textbox', { name: 'Search' }));

    await userEvent.tab();

    expect(closeButton).toHaveFocus();
  });

  it('should expose the root element through the ref', () => {
    const ref = createRef<SearchExpandableRef>();

    render(
      <Provider locale="en-US">
        <SearchExpandable ref={ref} data-testid="root" />
      </Provider>
    );

    expect(ref.current?.element).toBe(getRoot());
    expect(ref.current?.element?.tagName).toBe('DIV');
  });

  it('should keep the owned tab index over the input slot', async () => {
    render(
      <Provider locale="en-US">
        <SearchExpandable
          tabIndex={0}
          slotProps={{
            input: {
              tabIndex: -1,
              'data-testid': 'input',
            } as unknown as SearchExpandableInputSlotProps,
          }}
        />
      </Provider>
    );

    const trigger = screen.getByRole('button', { name: 'Search' });

    expect(trigger).toHaveAttribute('tabindex', '0');

    await userEvent.click(trigger);

    expect(screen.getByTestId('input')).toHaveAttribute('tabindex', '0');
  });

  it('should force tabindex -1 when disabled', () => {
    render(
      <Provider locale="en-US">
        <SearchExpandable isDisabled tabIndex={0} />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute(
      'tabindex',
      '-1'
    );
  });

  it('should force tabindex -1 on the disabled expanded input', () => {
    render(
      <Provider locale="en-US">
        <SearchExpandable defaultOpen isDisabled tabIndex={0} />
      </Provider>
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('tabindex', '-1');
  });

  it('should ignore owned keys from the input slot', async () => {
    const onSlotChange = vi.fn();

    render(
      <Provider locale="en-US">
        <SearchExpandable
          defaultOpen
          defaultValue="seed"
          slotProps={{
            input: {
              'aria-disabled': true,
              'aria-label': 'Hijacked',
              'aria-labelledby': 'hijacked',
              'aria-readonly': true,
              as: 'textarea',
              autoComplete: 'on',
              defaultValue: 'hijacked',
              disabled: true,
              hidden: true,
              onChange: onSlotChange,
              readOnly: true,
              tabIndex: 7,
              type: 'password',
              value: 'hijacked',
            } as unknown as SearchExpandableInputSlotProps,
          }}
        />
      </Provider>
    );

    const input = screen.getByRole('textbox');

    expect(input).toHaveAccessibleName('Search');
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveValue('seed');
    expect(input).toBeEnabled();
    expect(input).not.toHaveAttribute('readonly');
    expect(input).not.toHaveAttribute('hidden');
    expect(input).not.toHaveAttribute('aria-disabled', 'true');
    expect(input).not.toHaveAttribute('aria-readonly', 'true');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('tabindex', '0');

    await userEvent.type(input, 'more');

    expect(input).toHaveValue('seedmore');
    expect(onSlotChange).not.toHaveBeenCalled();
  });

  it('should keep the close button visible and focusable despite the slot keys', async () => {
    render(
      <Provider locale="en-US">
        <SearchExpandable
          defaultOpen
          slotProps={{
            closeButton: {
              'aria-disabled': true,
              'aria-hidden': true,
              disabled: true,
              excludeFromTabOrder: true,
              hidden: true,
              isClearable: false,
              isDisabled: true,
              isHidden: true,
              tabIndex: -1,
            } as unknown as SearchExpandableCloseButtonSlotProps,
          }}
        />
      </Provider>
    );

    const input = screen.getByRole('textbox', { name: 'Search' });
    const closeButton = screen.getByRole('button', { name: 'Close' });

    expect(closeButton).toBeEnabled();
    expect(closeButton).not.toHaveAttribute('aria-hidden', 'true');
    expect(closeButton).not.toHaveAttribute('aria-disabled', 'true');
    expect(closeButton).not.toHaveAttribute('hidden');
    expect(closeButton).not.toHaveAttribute('tabindex', '-1');

    await userEvent.click(input);
    await userEvent.tab();

    expect(closeButton).toHaveFocus();
  });

  it('should apply fullWidth to the root and the expanded field', async () => {
    render(
      <Provider locale="en-US">
        <SearchExpandable data-testid="root" fullWidth />
      </Provider>
    );

    expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(
      screen.getByRole('textbox').closest('[data-slot="form-field"]')
    ).toHaveAttribute('data-fullwidth', 'true');
  });

  it('should keep the trigger enabled and visible despite the slot keys', async () => {
    const onButtonPress = vi.fn();

    render(
      <Provider locale="en-US">
        <SearchExpandable
          slotProps={{
            button: {
              'aria-disabled': true,
              disabled: true,
              hidden: true,
              isDisabled: true,
              onPress: onButtonPress,
            } as unknown as SearchExpandableButtonSlotProps,
          }}
        />
      </Provider>
    );

    const trigger = screen.getByRole('button', { name: 'Search' });

    expect(trigger).toBeEnabled();
    expect(trigger).not.toHaveAttribute('aria-disabled', 'true');
    expect(trigger).not.toHaveAttribute('hidden');
    expect(trigger).toHaveAttribute('tabindex', '0');

    await userEvent.click(trigger);

    expect(onButtonPress).toHaveBeenCalledOnce();
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('should keep the owned slot keys out of the public types', () => {
    const removedKeysArePrivate: [
      RemovedInputSlotKeysArePrivate,
      RemovedCloseButtonSlotKeysArePrivate,
      RemovedButtonSlotKeysArePrivate,
    ] = [false, false, false];

    expect(removedKeysArePrivate).toEqual([false, false, false]);
  });
});

describe('SearchExpandable value pipeline', () => {
  let originalJest: Record<string, unknown> | undefined;

  beforeEach(() => {
    vi.useFakeTimers();

    const globalWithJest = globalThis as unknown as GlobalWithJest;

    originalJest = globalWithJest.jest;

    globalWithJest.jest = {
      ...originalJest,
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    };
  });

  afterEach(() => {
    (globalThis as unknown as GlobalWithJest).jest = originalJest;
    vi.useRealTimers();
  });

  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
    delay: null,
  });

  const renderExpanded = (props: Partial<SearchExpandableProps> = {}) =>
    render(
      <Provider locale="en-US">
        <SearchExpandable defaultOpen {...props} />
      </Provider>
    );

  const getInput = () => screen.getByRole('textbox', { name: 'Search' });

  const getCloseButton = () => screen.getByRole('button', { name: 'Close' });

  const advance = (milliseconds: number) => {
    act(() => {
      vi.advanceTimersByTime(milliseconds);
    });
  };

  it('shows the draft immediately and emits it after the default 200 ms', async () => {
    const onChange = vi.fn();

    renderExpanded({ onChange });

    const input = getInput();

    await user.type(input, 'typed');

    expect(input).toHaveValue('typed');
    expect(onChange).not.toHaveBeenCalled();

    advance(199);
    expect(onChange).not.toHaveBeenCalled();

    advance(1);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('typed');
  });

  it('reads the current emitValueTimeout on every keystroke', async () => {
    const onChange = vi.fn();

    const tree = (emitValueTimeout: number) => (
      <Provider locale="en-US">
        <SearchExpandable
          defaultOpen
          emitValueTimeout={emitValueTimeout}
          onChange={onChange}
        />
      </Provider>
    );

    const { rerender } = render(tree(500));

    await user.type(getInput(), 'a');

    advance(300);
    expect(onChange).not.toHaveBeenCalled();

    advance(200);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('a');

    rerender(tree(100));

    await user.type(getInput(), 'b');

    advance(99);
    expect(onChange).toHaveBeenCalledTimes(1);

    advance(1);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith('ab');
  });

  it('restarts the delay on a second keystroke and emits only the final text', async () => {
    const onChange = vi.fn();

    renderExpanded({ onChange });

    await user.type(getInput(), 'ab');
    advance(150);

    await user.type(getInput(), 'c');
    advance(150);
    expect(onChange).not.toHaveBeenCalled();

    advance(50);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('abc');
  });

  it('commits immediately on Enter in Enter mode without debouncing', async () => {
    const onChange = vi.fn();

    renderExpanded({ onChange, isEmitValueByEnterEnabled: true });

    await user.type(getInput(), 'typed');
    advance(300);
    expect(onChange).not.toHaveBeenCalled();

    const event = createEvent.keyDown(getInput(), { key: 'Enter' });

    fireEvent(getInput(), event);

    expect(event.defaultPrevented).toBe(true);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('typed');
  });

  it('leaves Enter untouched outside Enter mode', async () => {
    const onChange = vi.fn();

    renderExpanded({ onChange });

    await user.type(getInput(), 'typed');
    advance(100);

    const event = createEvent.keyDown(getInput(), { key: 'Enter' });

    fireEvent(getInput(), event);

    expect(event.defaultPrevented).toBe(false);
    expect(onChange).not.toHaveBeenCalled();

    advance(100);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('typed');
  });

  it('prevents the default action but skips an IME Enter', async () => {
    const onChange = vi.fn();

    renderExpanded({ onChange, isEmitValueByEnterEnabled: true });

    await user.type(getInput(), 'typed');

    const composingEvent = createEvent.keyDown(getInput(), {
      key: 'Enter',
      isComposing: true,
    });

    fireEvent(getInput(), composingEvent);

    expect(composingEvent.defaultPrevented).toBe(true);
    expect(onChange).not.toHaveBeenCalled();

    const legacyEvent = createEvent.keyDown(getInput(), {
      key: 'Enter',
      keyCode: 229,
    });

    fireEvent(getInput(), legacyEvent);

    expect(legacyEvent.defaultPrevented).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not re-emit on repeated Enter and emits after an external empty write', async () => {
    const onChange = vi.fn();

    function Harness() {
      const [value, setValue] = useState('');

      return (
        <Provider locale="en-US">
          <button type="button" onClick={() => setValue('')}>
            reset-external
          </button>
          <SearchExpandable
            defaultOpen
            isEmitValueByEnterEnabled
            value={value}
            onChange={(nextValue) => {
              onChange(nextValue);
              setValue(nextValue);
            }}
          />
        </Provider>
      );
    }

    render(<Harness />);

    await user.type(getInput(), 'typed');
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('typed');

    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'reset-external' }));

    expect(getInput()).toHaveValue('');

    await user.type(getInput(), 'typed');
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith('typed');
  });

  it('replaces the draft on an external controlled write and cancels the pending emission', async () => {
    const onChange = vi.fn();

    const tree = (value: string) => (
      <Provider locale="en-US">
        <SearchExpandable defaultOpen value={value} onChange={onChange} />
      </Provider>
    );

    const { rerender } = render(tree(''));

    await user.type(getInput(), 'typed');

    expect(getInput()).toHaveValue('typed');

    rerender(tree('external'));

    expect(getInput()).toHaveValue('external');

    advance(400);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('displays an empty field for a null controlled value', () => {
    render(
      <Provider locale="en-US">
        <SearchExpandable defaultOpen value={null} />
      </Provider>
    );

    expect(getInput()).toHaveValue('');
  });

  it('keeps the typed draft when a controlled parent ignores onChange', async () => {
    const onChange = vi.fn();

    renderExpanded({ onChange, value: '' });

    await user.type(getInput(), 'typed');

    expect(getInput()).toHaveValue('typed');

    advance(200);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('typed');
    expect(getInput()).toHaveValue('typed');
  });

  it('does not echo controlled props at mount in Strict Mode', () => {
    const onChange = vi.fn();

    render(
      <StrictMode>
        <Provider locale="en-US">
          <SearchExpandable defaultOpen value="seed" onChange={onChange} />
        </Provider>
      </StrictMode>
    );

    expect(getInput()).toHaveValue('seed');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('cancels the pending emission on close so discarded text is never emitted', async () => {
    const onChange = vi.fn();

    renderExpanded({ onChange });

    await user.type(getInput(), 'typed');
    await user.click(getCloseButton());

    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    advance(400);
    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(getInput()).toHaveValue('');
  });

  it('emits one empty reset when closing an already empty field', async () => {
    const onChange = vi.fn();

    renderExpanded({ onChange });

    await user.click(getCloseButton());

    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
  });

  it('keeps the cleared draft after close when a controlled parent ignores the reset', async () => {
    const onChange = vi.fn();

    render(
      <Provider locale="en-US">
        <SearchExpandable defaultOpen value="typed" onChange={onChange} />
      </Provider>
    );

    expect(getInput()).toHaveValue('typed');

    await user.click(getCloseButton());

    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(getInput()).toHaveValue('');
  });

  it('resets exactly once on Escape and cancels the pending text', async () => {
    const onChange = vi.fn();
    const onOpenChange = vi.fn();

    renderExpanded({ onChange, onOpenChange });

    await user.type(getInput(), 'typed');
    await user.keyboard('{Escape}');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    advance(300);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('resets exactly once on Escape from an already empty model', async () => {
    const onChange = vi.fn();

    renderExpanded({ onChange });

    await user.click(getInput());
    await user.keyboard('{Escape}');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('resets once when toggle closes the field through the ref', () => {
    const onChange = vi.fn();
    const onOpenChange = vi.fn();
    const ref = createRef<SearchExpandableRef>();

    render(
      <Provider locale="en-US">
        <SearchExpandable
          ref={ref}
          defaultOpen
          defaultValue="typed"
          onChange={onChange}
          onOpenChange={onOpenChange}
        />
      </Provider>
    );

    act(() => ref.current?.toggle());

    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('closes through the native close button with Enter and Space', async () => {
    const onChange = vi.fn();

    renderExpanded({ onChange });

    await user.click(getInput());
    await user.tab();

    expect(getCloseButton()).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('');

    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.click(getInput());
    await user.tab();

    expect(getCloseButton()).toHaveFocus();

    await user.keyboard(' ');

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});

describe('SearchExpandable disclosure', () => {
  let originalJest: Record<string, unknown> | undefined;

  beforeEach(() => {
    vi.useFakeTimers();

    const globalWithJest = globalThis as unknown as GlobalWithJest;

    originalJest = globalWithJest.jest;

    globalWithJest.jest = {
      ...originalJest,
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    };
  });

  afterEach(() => {
    (globalThis as unknown as GlobalWithJest).jest = originalJest;
    vi.useRealTimers();
  });

  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
    delay: null,
  });

  const renderField = (element: ReactElement, strict = false) =>
    render(
      strict ? (
        <StrictMode>
          <Provider locale="en-US">{element}</Provider>
        </StrictMode>
      ) : (
        <Provider locale="en-US">{element}</Provider>
      )
    );

  const getTrigger = () => screen.getByRole('button', { name: 'Search' });

  const getInput = () => screen.getByRole('textbox', { name: 'Search' });

  const getCloseButton = () => screen.getByRole('button', { name: 'Close' });

  const advance = (milliseconds: number) => {
    act(() => {
      vi.advanceTimersByTime(milliseconds);
    });
  };

  it('reports true on open and false on close', async () => {
    const onOpenChange = vi.fn();

    renderField(<SearchExpandable onOpenChange={onOpenChange} />);

    await user.click(getTrigger());

    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(getInput()).toBeInTheDocument();

    await user.click(getCloseButton());

    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('keeps a controlled open state authoritative and does not echo isOpen writes', async () => {
    const onOpenChange = vi.fn();

    const tree = (isOpen: boolean) => (
      <Provider locale="en-US">
        <SearchExpandable isOpen={isOpen} onOpenChange={onOpenChange} />
      </Provider>
    );

    const { rerender } = render(tree(false));

    await user.click(getTrigger());

    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    rerender(tree(true));

    expect(getInput()).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledTimes(1);

    rerender(tree(false));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('opens an initial nonempty uncontrolled value with one callback in Strict Mode', () => {
    const onOpenChange = vi.fn();

    renderField(
      <SearchExpandable
        defaultValue="seed"
        defaultOpen={false}
        onOpenChange={onOpenChange}
      />,
      true
    );

    expect(getInput()).toHaveValue('seed');
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('opens an initial nonempty value even when initially disabled', () => {
    const onOpenChange = vi.fn();

    renderField(
      <SearchExpandable
        defaultValue="seed"
        isDisabled
        onOpenChange={onOpenChange}
      />,
      true
    );

    expect(getInput()).toHaveValue('seed');
    expect(getInput()).toBeDisabled();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('does not emit when only defaultOpen opens the field', () => {
    const onOpenChange = vi.fn();

    renderField(
      <SearchExpandable defaultOpen onOpenChange={onOpenChange} />,
      true
    );

    expect(getInput()).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('stays closed and requests opening once for a controlled initial value', () => {
    const onOpenChange = vi.fn();

    renderField(
      <SearchExpandable
        isOpen={false}
        value="seed"
        onOpenChange={onOpenChange}
      />,
      true
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('requests opening for a controlled initial value even when disabled', () => {
    const onOpenChange = vi.fn();

    renderField(
      <SearchExpandable
        isOpen={false}
        isDisabled
        value="seed"
        onOpenChange={onOpenChange}
      />,
      true
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('does not emit on mount for a controlled open field', () => {
    const onOpenChange = vi.fn();

    renderField(
      <SearchExpandable isOpen value="seed" onOpenChange={onOpenChange} />,
      true
    );

    expect(getInput()).toHaveValue('seed');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('opens an uncontrolled-open field on a later nonempty external write', () => {
    const onOpenChange = vi.fn();

    const tree = (value: string) => (
      <Provider locale="en-US">
        <SearchExpandable value={value} onOpenChange={onOpenChange} />
      </Provider>
    );

    const { rerender } = render(tree(''));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    rerender(tree('typed'));

    expect(getInput()).toHaveValue('typed');
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('only requests opening on a later external write for a controlled-open field', () => {
    const onOpenChange = vi.fn();

    const tree = (value: string) => (
      <Provider locale="en-US">
        <SearchExpandable
          isOpen={false}
          value={value}
          onOpenChange={onOpenChange}
        />
      </Provider>
    );

    const { rerender } = render(tree(''));

    rerender(tree('typed'));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('never collapses on an empty external write', () => {
    const onOpenChange = vi.fn();

    const tree = (value: string) => (
      <Provider locale="en-US">
        <SearchExpandable
          defaultOpen
          value={value}
          onOpenChange={onOpenChange}
        />
      </Provider>
    );

    const { rerender } = render(tree('typed'));

    expect(getInput()).toHaveValue('typed');

    rerender(tree(''));

    expect(getInput()).toHaveValue('');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('ignores defaultValue when the value is controlled as null', () => {
    const onOpenChange = vi.fn();

    renderField(
      <SearchExpandable
        value={null}
        defaultValue="seed"
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('does not open or request opening for later writes while disabled', () => {
    const onOpenChange = vi.fn();

    const tree = (value: string) => (
      <Provider locale="en-US">
        <SearchExpandable
          isDisabled
          value={value}
          onOpenChange={onOpenChange}
        />
      </Provider>
    );

    const { rerender } = render(tree(''));

    rerender(tree('typed'));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('preserves the draft on external close but cancels its emission and reopening', async () => {
    const onChange = vi.fn();
    const onOpenChange = vi.fn();

    const tree = (isOpen: boolean) => (
      <Provider locale="en-US">
        <SearchExpandable
          isOpen={isOpen}
          onChange={onChange}
          onOpenChange={onOpenChange}
        />
      </Provider>
    );

    const { rerender } = render(tree(true));

    await user.type(getInput(), 'typed');

    rerender(tree(false));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    advance(400);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();

    rerender(tree(true));

    expect(getInput()).toHaveValue('typed');
  });

  it('does not reopen when a controlled parent ignores the reset', async () => {
    const onChange = vi.fn();

    renderField(
      <SearchExpandable defaultOpen value="typed" onChange={onChange} />
    );

    await user.click(getCloseButton());

    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    advance(400);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('toggles uncontrolled state through the ref and emits each change', () => {
    const onOpenChange = vi.fn();
    const ref = createRef<SearchExpandableRef>();

    renderField(<SearchExpandable ref={ref} onOpenChange={onOpenChange} />);

    act(() => ref.current?.toggle());

    expect(getInput()).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);

    act(() => ref.current?.toggle());

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('ignores toggle and trigger clicks while disabled', async () => {
    const onOpenChange = vi.fn();
    const ref = createRef<SearchExpandableRef>();

    renderField(
      <SearchExpandable ref={ref} isDisabled onOpenChange={onOpenChange} />
    );

    act(() => ref.current?.toggle());

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.click(getTrigger());

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('ignores Escape while the expanded field is disabled', () => {
    const onChange = vi.fn();
    const onOpenChange = vi.fn();

    renderField(
      <SearchExpandable
        defaultOpen
        isDisabled
        onChange={onChange}
        onOpenChange={onOpenChange}
      />
    );

    fireEvent.keyDown(getInput(), { key: 'Escape' });

    expect(getInput()).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('leaves an expanded field expanded when it becomes disabled', () => {
    const tree = (isDisabled: boolean) => (
      <Provider locale="en-US">
        <SearchExpandable
          data-testid="root"
          defaultOpen
          isDisabled={isDisabled}
        />
      </Provider>
    );

    const { rerender } = render(tree(true));

    expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    expect(getInput()).toBeDisabled();
    expect(getCloseButton()).toBeDisabled();

    rerender(tree(false));

    expect(getInput()).toBeEnabled();
    expect(getCloseButton()).toBeEnabled();
  });

  it('applies an external isOpen close while disabled', () => {
    const tree = (isOpen: boolean) => (
      <Provider locale="en-US">
        <SearchExpandable isOpen={isOpen} isDisabled />
      </Provider>
    );

    const { rerender } = render(tree(true));

    expect(getInput()).toBeDisabled();

    rerender(tree(false));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('applies a finite tab index to the trigger and input', async () => {
    renderField(<SearchExpandable tabIndex={-2} />);

    expect(getTrigger()).toHaveAttribute('tabindex', '-2');

    await user.click(getTrigger());

    expect(getInput()).toHaveAttribute('tabindex', '-2');
  });

  it('falls back to 0 for null and non-finite tab indices', () => {
    const tree = (tabIndex: number | null) => (
      <Provider locale="en-US">
        <SearchExpandable defaultOpen tabIndex={tabIndex} />
      </Provider>
    );

    const { rerender } = render(tree(null));

    expect(getInput()).toHaveAttribute('tabindex', '0');

    rerender(tree(Number.NaN));

    expect(getInput()).toHaveAttribute('tabindex', '0');
  });

  it('falls back to 0 for a non-integer tab index', () => {
    const tabIndex = 1.5;

    renderField(<SearchExpandable defaultOpen tabIndex={tabIndex} />);

    expect(getInput()).toHaveAttribute('tabindex', '0');
  });

  it('honors the Form disabled context', async () => {
    renderField(
      <Form isDisabled>
        <SearchExpandable data-testid="root" />
      </Form>
    );

    expect(getTrigger()).toBeDisabled();
    expect(getTrigger()).toHaveAttribute('tabindex', '-1');
    expect(getRoot()).toHaveAttribute('data-disabled', 'true');

    await user.click(getTrigger());

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders a Form-disabled expanded field with disabled input and close button', () => {
    renderField(
      <Form isDisabled>
        <SearchExpandable defaultOpen />
      </Form>
    );

    expect(getInput()).toBeDisabled();
    expect(getCloseButton()).toBeDisabled();
  });

  it('calls caller slot handlers alongside the owned behavior', async () => {
    const onButtonPress = vi.fn();
    const onClosePress = vi.fn();
    const onInputKeyDown = vi.fn();

    renderField(
      <SearchExpandable
        slotProps={{
          button: { onPress: onButtonPress },
          closeButton: { onPress: onClosePress },
          input: { onKeyDown: onInputKeyDown },
        }}
      />
    );

    await user.click(getTrigger());

    expect(onButtonPress).toHaveBeenCalledOnce();
    expect(getInput()).toBeInTheDocument();

    await user.click(getInput());
    await user.keyboard('{Escape}');

    expect(onInputKeyDown).toHaveBeenCalled();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    await user.click(getTrigger());
    await user.click(getCloseButton());

    expect(onButtonPress).toHaveBeenCalledTimes(2);
    expect(onClosePress).toHaveBeenCalledOnce();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('cancels a pending debounce when Enter mode turns on', async () => {
    const onChange = vi.fn();

    const tree = (isEmitValueByEnterEnabled: boolean) => (
      <Provider locale="en-US">
        <SearchExpandable
          defaultOpen
          isEmitValueByEnterEnabled={isEmitValueByEnterEnabled}
          onChange={onChange}
        />
      </Provider>
    );

    const { rerender } = render(tree(false));

    await user.type(getInput(), 'typed');

    advance(100);

    rerender(tree(true));

    advance(400);

    expect(onChange).not.toHaveBeenCalled();

    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('typed');
  });

  it('prevents native form submission on Enter in Enter mode', async () => {
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    const onChange = vi.fn();

    render(
      <form onSubmit={onSubmit}>
        <Provider locale="en-US">
          <SearchExpandable
            defaultOpen
            isEmitValueByEnterEnabled
            onChange={onChange}
          />
        </Provider>
      </form>
    );

    await user.type(getInput(), 'typed');

    const event = createEvent.keyDown(getInput(), { key: 'Enter' });

    fireEvent(getInput(), event);

    expect(event.defaultPrevented).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledExactlyOnceWith('typed');
  });

  it('resets exactly once when closing an Enter-mode field', async () => {
    const onChange = vi.fn();

    renderField(
      <SearchExpandable
        defaultOpen
        isEmitValueByEnterEnabled
        onChange={onChange}
      />
    );

    await user.type(getInput(), 'typed');
    await user.click(getCloseButton());

    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    advance(400);

    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(getTrigger());
    await user.type(getInput(), 'next');
    await user.keyboard('{Escape}');

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    advance(400);

    expect(onChange).toHaveBeenCalledTimes(2);
  });
});

describe('useSearchExpandableValue', () => {
  it('reports only actual controlled prop writes through onExternalValue', () => {
    const onExternalValue = vi.fn();

    const { result, rerender } = renderHook(
      ({ value }: { value: string | null }) =>
        useSearchExpandableValue({ value, onExternalValue }),
      { initialProps: { value: 'seed' as string | null } }
    );

    expect(result.current.draftValue).toBe('seed');
    expect(onExternalValue).not.toHaveBeenCalled();

    rerender({ value: 'seed' });
    expect(onExternalValue).not.toHaveBeenCalled();

    rerender({ value: null });
    expect(onExternalValue).toHaveBeenCalledExactlyOnceWith('');
    expect(result.current.draftValue).toBe('');
  });

  it('never reports its own uncontrolled commit as external', () => {
    const onExternalValue = vi.fn();

    const { result } = renderHook(() =>
      useSearchExpandableValue({ defaultValue: 'seed', onExternalValue })
    );

    act(() => result.current.handleDraftChange('typed'));
    act(() => result.current.commitDraft());
    act(() => result.current.resetValue());

    expect(onExternalValue).not.toHaveBeenCalled();
  });

  it('does not echo or report the initial controlled value in Strict Mode', () => {
    const onChange = vi.fn();
    const onExternalValue = vi.fn();

    renderHook(
      () =>
        useSearchExpandableValue({
          value: 'seed',
          onChange,
          onExternalValue,
        }),
      {
        wrapper: ({ children }) => <StrictMode>{children}</StrictMode>,
      }
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(onExternalValue).not.toHaveBeenCalled();
  });
});

describe('SearchExpandable focus', () => {
  const user = userEvent.setup({ delay: null });

  const renderField = (element: ReactElement, strict = false) =>
    render(
      strict ? (
        <StrictMode>
          <Provider locale="en-US">{element}</Provider>
        </StrictMode>
      ) : (
        <Provider locale="en-US">{element}</Provider>
      )
    );

  const getTrigger = () => screen.getByRole('button', { name: 'Search' });
  const getInput = () => screen.getByRole('textbox', { name: 'Search' });
  const getCloseButton = () => screen.getByRole('button', { name: 'Close' });

  it('does not move focus on the initial collapsed render in Strict Mode', () => {
    renderField(<SearchExpandable />, true);

    expect(getTrigger()).not.toHaveFocus();
    expect(document.body).toHaveFocus();
  });

  it('does not move focus on the initial expanded render in Strict Mode', () => {
    renderField(<SearchExpandable defaultOpen />, true);

    expect(getInput()).not.toHaveFocus();
    expect(document.body).toHaveFocus();
  });

  it('does not move focus for an initially expanded nonempty value', () => {
    renderField(<SearchExpandable defaultValue="seed" />, true);

    expect(getInput()).toHaveValue('seed');
    expect(getInput()).not.toHaveFocus();
  });

  it('focuses the input when the trigger opens the field', async () => {
    renderField(<SearchExpandable />);

    await user.click(getTrigger());

    expect(getInput()).toHaveFocus();
  });

  it('focuses the input when toggle opens the field', () => {
    const ref = createRef<SearchExpandableRef>();

    renderField(<SearchExpandable ref={ref} />);

    act(() => ref.current?.toggle());

    expect(getInput()).toHaveFocus();
  });

  it('focuses the input on an external open', () => {
    const tree = (isOpen: boolean) => (
      <Provider locale="en-US">
        <SearchExpandable isOpen={isOpen} />
      </Provider>
    );

    const { rerender } = render(tree(false));

    rerender(tree(true));

    expect(getInput()).toHaveFocus();
  });

  it('does not focus a disabled input on an external open', () => {
    const tree = (isOpen: boolean) => (
      <Provider locale="en-US">
        <SearchExpandable isOpen={isOpen} isDisabled />
      </Provider>
    );

    const { rerender } = render(tree(false));

    rerender(tree(true));

    expect(getInput()).toBeDisabled();
    expect(getInput()).not.toHaveFocus();
    expect(document.body).toHaveFocus();
  });

  it('does not focus a model-opened input when focus is outside the component', () => {
    const tree = (value: string) => (
      <Provider locale="en-US">
        <button type="button" data-testid="outside">
          outside
        </button>
        <SearchExpandable value={value} />
      </Provider>
    );

    const { rerender } = render(tree(''));

    screen.getByTestId('outside').focus();

    rerender(tree('typed'));

    expect(getInput()).toHaveValue('typed');
    expect(screen.getByTestId('outside')).toHaveFocus();
    expect(getInput()).not.toHaveFocus();
  });

  it('focuses a model-opened input when the collapsed button had focus', () => {
    const tree = (value: string) => (
      <Provider locale="en-US">
        <SearchExpandable value={value} />
      </Provider>
    );

    const { rerender } = render(tree(''));

    act(() => getTrigger().focus());

    rerender(tree('typed'));

    expect(getInput()).toHaveValue('typed');
    expect(getInput()).toHaveFocus();
  });

  it('restores focus to the collapsed button after an input Escape', async () => {
    renderField(<SearchExpandable defaultOpen />);

    await user.click(getInput());
    await user.keyboard('{Escape}');

    expect(getTrigger()).toHaveFocus();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('restores focus to the collapsed button after the close press', async () => {
    renderField(<SearchExpandable defaultOpen />);

    await user.click(getCloseButton());

    expect(getTrigger()).toHaveFocus();
  });

  it('restores focus to the collapsed button after toggle closes', () => {
    const ref = createRef<SearchExpandableRef>();

    renderField(<SearchExpandable ref={ref} defaultOpen />);

    act(() => ref.current?.toggle());

    expect(getTrigger()).toHaveFocus();
  });

  it('restores focus to the collapsed button after an external close', () => {
    const tree = (isOpen: boolean) => (
      <Provider locale="en-US">
        <SearchExpandable isOpen={isOpen} />
      </Provider>
    );

    const { rerender } = render(tree(true));

    rerender(tree(false));

    expect(getTrigger()).toHaveFocus();
  });

  it('does not restore focus on a disabled external close', () => {
    const tree = (isOpen: boolean) => (
      <Provider locale="en-US">
        <button type="button" data-testid="outside">
          outside
        </button>
        <SearchExpandable isOpen={isOpen} isDisabled />
      </Provider>
    );

    const { rerender } = render(tree(true));

    screen.getByTestId('outside').focus();

    rerender(tree(false));

    expect(getTrigger()).toBeDisabled();
    expect(getTrigger()).not.toHaveFocus();
    expect(screen.getByTestId('outside')).toHaveFocus();
  });

  it('keeps an expanded field open through a real enabled-to-disabled transition without moving focus', async () => {
    const tree = (isDisabled: boolean) => (
      <Provider locale="en-US">
        <button type="button" data-testid="outside">
          outside
        </button>
        <SearchExpandable defaultOpen isDisabled={isDisabled} />
      </Provider>
    );

    const { rerender } = render(tree(false));

    await user.click(getInput());

    expect(getInput()).toHaveFocus();

    rerender(tree(true));

    expect(getInput()).toBeInTheDocument();
    expect(getInput()).toBeDisabled();
    expect(getCloseButton()).toBeDisabled();

    expect(
      screen.queryByRole('button', { name: 'Search' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId('outside'));

    rerender(tree(false));

    expect(getInput()).toBeEnabled();
    expect(getInput()).not.toHaveFocus();
    expect(screen.getByTestId('outside')).toHaveFocus();
  });
});

describe('SearchExpandable tooltip', () => {
  let originalJest: Record<string, unknown> | undefined;

  beforeEach(() => {
    vi.useFakeTimers();

    const globalWithJest = globalThis as unknown as GlobalWithJest;

    originalJest = globalWithJest.jest;

    globalWithJest.jest = {
      ...originalJest,
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    };
  });

  afterEach(() => {
    (globalThis as unknown as GlobalWithJest).jest = originalJest;
    vi.useRealTimers();
  });

  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
    delay: null,
  });

  const renderField = (element: ReactElement) =>
    render(<Provider locale="en-US">{element}</Provider>);

  const getInput = () => screen.getByRole('textbox', { name: 'Search' });

  const advance = (milliseconds: number) => {
    act(() => {
      vi.advanceTimersByTime(milliseconds);
    });
  };

  it('displays the current tooltip text on hover and removes it on expand', async () => {
    renderField(<SearchExpandable tooltipText="Find in document" />);

    const trigger = screen.getByRole('button', { name: 'Find in document' });

    fireEvent.mouseMove(document.body);

    await user.hover(trigger);
    advance(500);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Find in document');

    await user.click(trigger);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(getInput()).toBeInTheDocument();
  });

  it('never opens a disabled tooltip', async () => {
    renderField(<SearchExpandable isDisabled tooltipText="Hidden" />);

    fireEvent.mouseMove(document.body);

    await user.hover(screen.getByRole('button', { name: 'Hidden' }));
    advance(500);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('keeps later keyboard focus and hover working after focus restoration', async () => {
    renderField(
      <>
        <button type="button" data-testid="outside">
          outside
        </button>
        <SearchExpandable defaultOpen />
      </>
    );

    await user.click(getInput());
    await user.keyboard('{Escape}');

    const trigger = screen.getByRole('button', { name: 'Search' });

    expect(trigger).toHaveFocus();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.tab();
    await user.tab({ shift: true });

    expect(trigger).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Search');

    await user.click(screen.getByTestId('outside'));
    advance(500);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.mouseMove(document.body);

    await user.hover(trigger);
    advance(500);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Search');
  });
});

describe('SearchExpandable localization', () => {
  const user = userEvent.setup({ delay: null });

  it('uses ru-RU labels for the trigger, field, and close button', async () => {
    render(
      <Provider locale="ru-RU">
        <SearchExpandable />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Поиск' }));

    expect(screen.getByRole('textbox', { name: 'Поиск' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
  });

  it('rerenders labels when the Provider locale changes', () => {
    const tree = (locale: string) => (
      <Provider locale={locale}>
        <SearchExpandable />
      </Provider>
    );

    const { rerender } = render(tree('en-US'));

    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();

    rerender(tree('ru-RU'));

    expect(screen.getByRole('button', { name: 'Поиск' })).toBeInTheDocument();
  });

  it('falls back to the locale for null and undefined custom text', async () => {
    const tree = (
      tooltipText: string | null | undefined,
      placeholder: string | null | undefined
    ) => (
      <Provider locale="en-US">
        <SearchExpandable tooltipText={tooltipText} placeholder={placeholder} />
      </Provider>
    );

    const { rerender } = render(tree(null, undefined));

    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();

    rerender(tree(undefined, null));

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('preserves an empty tooltip label instead of falling back', () => {
    render(
      <Provider locale="en-US">
        <SearchExpandable tooltipText="" />
      </Provider>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', '');
  });

  it('applies custom labels and the close-button slot override', async () => {
    render(
      <Provider locale="en-US">
        <SearchExpandable
          tooltipText="Find"
          placeholder="Query"
          slotProps={{ closeButton: { 'aria-label': 'Dismiss' } }}
        />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Find' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Find' }));

    expect(screen.getByRole('textbox', { name: 'Query' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });
});

describe('SearchExpandable form integration', () => {
  const user = userEvent.setup({ delay: null });

  it('forwards name, required, invalid, and the error message', () => {
    render(
      <Provider locale="en-US">
        <SearchExpandable
          defaultOpen
          name="query"
          isRequired
          isInvalid
          errorMessage="Invalid query"
        />
      </Provider>
    );

    const input = screen.getByRole('textbox', { name: 'Search' });

    expect(input).toHaveAttribute('name', 'query');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Invalid query')).toBeInTheDocument();
  });

  it('opens an initial uncontrolled nonempty value under a disabled Form', () => {
    const onOpenChange = vi.fn();

    render(
      <Provider locale="en-US">
        <Form isDisabled>
          <SearchExpandable
            data-testid="root"
            defaultValue="seed"
            onOpenChange={onOpenChange}
          />
        </Form>
      </Provider>
    );

    expect(screen.getByRole('textbox')).toHaveValue('seed');
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('requests opening once for a controlled initial value under a disabled Form', () => {
    const onOpenChange = vi.fn();

    render(
      <Provider locale="en-US">
        <Form isDisabled>
          <SearchExpandable
            isOpen={false}
            value="seed"
            onOpenChange={onOpenChange}
          />
        </Form>
      </Provider>
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('does not emit on mount when defaultOpen and an initial value open the field', () => {
    const onOpenChange = vi.fn();

    render(
      <StrictMode>
        <Provider locale="en-US">
          <SearchExpandable
            defaultOpen
            defaultValue="seed"
            onOpenChange={onOpenChange}
          />
        </Provider>
      </StrictMode>
    );

    expect(screen.getByRole('textbox')).toHaveValue('seed');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('stays editable under a read-only Form', async () => {
    const readOnlyIsPublic: ReadOnlyIsPublic = false;

    expect(readOnlyIsPublic).toBe(false);

    const onChange = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <Provider locale="en-US">
        <Form isReadOnly>
          <SearchExpandable
            defaultOpen
            defaultValue="typed"
            onChange={onChange}
            onOpenChange={onOpenChange}
          />
        </Form>
      </Provider>
    );

    const input = screen.getByRole('textbox', { name: 'Search' });
    const closeButton = screen.getByRole('button', { name: 'Close' });

    expect(input).not.toHaveAttribute('readonly');
    expect(closeButton).toBeEnabled();

    await user.click(input);
    await user.keyboard('{Escape}');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});

describe('SearchExpandable keyboard composition', () => {
  const user = userEvent.setup({ delay: null });

  it('closes only the search field on Escape inside a Modal', async () => {
    const onModalOpenChange = vi.fn();

    render(
      <Provider locale="en-US">
        <Modal isOpen hideCloseButton onOpenChange={onModalOpenChange}>
          <SearchExpandable defaultOpen />
        </Modal>
      </Provider>
    );

    const input = screen.getByRole('textbox', { name: 'Search' });

    await user.click(input);
    await user.type(input, 'typed');
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toHaveFocus();
    expect(onModalOpenChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onModalOpenChange).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');

    expect(onModalOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });
});

describe('SearchExpandable accessibility', () => {
  let restoreGetComputedStyle: (() => void) | undefined;

  beforeAll(() => {
    const getComputedStyle = window.getComputedStyle;

    const spy = vi
      .spyOn(window, 'getComputedStyle')
      // jsdom logs a "Not implemented" error for pseudo-element styles, which
      // axe reads for its color-contrast analysis. Ignoring the pseudo-element
      // argument silences the noise; the default axe rule set still runs and no
      // rules are disabled by the test.
      .mockImplementation((element) => getComputedStyle.call(window, element));

    restoreGetComputedStyle = () => spy.mockRestore();
  });

  afterAll(() => {
    restoreGetComputedStyle?.();
  });

  it('has no axe violations when collapsed', async () => {
    const { container } = render(
      <Provider locale="en-US">
        <SearchExpandable />
      </Provider>
    );

    const results = await axe.run(container);

    expect(results.violations).toEqual([]);
  });

  it('has no axe violations when expanded', async () => {
    const { container } = render(
      <Provider locale="en-US">
        <SearchExpandable defaultOpen />
      </Provider>
    );

    const results = await axe.run(container);

    expect(results.violations).toEqual([]);
  });

  it('has no axe violations with two expanded instances', async () => {
    const { container } = render(
      <Provider locale="en-US">
        <SearchExpandable defaultOpen />
        <SearchExpandable defaultOpen />
      </Provider>
    );

    const results = await axe.run(container);

    expect(results.violations).toEqual([]);
  });
});

describe('SearchExpandable value normalization', () => {
  it('treats a null controlled value as an empty controlled value', () => {
    expect(normalizeSearchExpandableValue(null)).toBe('');
    expect(normalizeSearchExpandableValue('seed')).toBe('seed');
    expect(normalizeSearchExpandableValue(undefined)).toBeUndefined();
  });

  it('preserves empty strings in the label fallback', () => {
    expect(resolveSearchExpandableText('', 'Search')).toBe('');
    expect(resolveSearchExpandableText(null, 'Search')).toBe('Search');
    expect(resolveSearchExpandableText(undefined, 'Search')).toBe('Search');
    expect(resolveSearchExpandableText('Find', 'Search')).toBe('Find');
  });
});
