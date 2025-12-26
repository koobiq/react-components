import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import { Form, Provider, Autocomplete, type AutocompleteProps } from '../index';

declare global {
  // eslint-disable-next-line no-var,vars-on-top
  var jest: { [key in string]: unknown };
}

describe('Autocomplete', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // HACK: Temporary workaround for a bug in @testing-library/react when
    // using  @testing-library/user-event with fake timers.
    // https://github.com/testing-library/react-testing-library/issues/1197
    const originalJest = globalThis.jest;

    globalThis.jest = {
      ...globalThis.jest,
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    };

    return () => {
      globalThis.jest = originalJest;
    };
  });

  const user = userEvent.setup({ delay: null });

  const baseProps: AutocompleteProps<object> = {
    label: 'label',
    children: null,
    slotProps: {
      root: {
        'data-testid': 'root',
      },
      popover: {
        'data-testid': 'popover',
      },
      input: {
        'data-testid': 'control',
      },
      group: {
        'data-testid': 'group',
      },
      clearButton: {
        'aria-label': 'clear-button',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');
  const getInput = () => screen.getByTestId('control');
  const getPopover = () => screen.getByTestId('popover');
  const getClearButton = () => screen?.queryByLabelText('clear-button');
  const getGroup = () => screen.getByTestId('group');
  const getChevron = () => screen.queryByLabelText('Show suggestions');

  it('should accept a ref', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Autocomplete {...baseProps} ref={ref} />);
    expect(ref.current).toBe(container.querySelector('input'));
  });

  it('should merge a custom class name with the default ones', () => {
    render(<Autocomplete {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display a label', () => {
    render(<Autocomplete {...baseProps} />);

    expect(screen.getAllByText('label')[0]).toBeInTheDocument();
  });

  it('should display a placeholder', () => {
    render(<Autocomplete {...baseProps} placeholder="baz" />);

    const input = getInput();

    expect(input).toHaveAttribute('placeholder', 'baz');
  });

  it('should be disabled when isDisabled is true', async () => {
    const onOpenChange = vi.fn((val) => val);

    render(
      <Autocomplete {...baseProps} onOpenChange={onOpenChange} isDisabled />
    );

    await userEvent.tab();
    await userEvent.click(getGroup());

    expect(getInput()).not.toHaveFocus();
    expect(onOpenChange).toBeCalledTimes(0);
  });

  it('should be required when isRequired is true', () => {
    render(<Autocomplete {...baseProps} isRequired />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display a caption', () => {
    render(<Autocomplete {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display an errorMessage', () => {
    render(<Autocomplete {...baseProps} errorMessage="fail" isInvalid />);

    expect(getRoot()).toHaveTextContent('fail');
  });

  describe('addons', () => {
    const getStartAddon = () => screen.getByTestId('field-addon-start');
    const getEndAddon = () => screen.getByTestId('field-addon-end');

    it(`should render a startAddon`, () => {
      render(<Autocomplete {...baseProps} startAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render an endAddon`, () => {
      render(<Autocomplete {...baseProps} endAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render addons in an error state`, () => {
      render(
        <Autocomplete
          {...baseProps}
          startAddon="start-addon"
          endAddon="end-addon"
          isInvalid
        />
      );

      expect(getStartAddon()).toHaveAttribute('data-invalid', 'true');
      expect(getEndAddon()).toHaveAttribute('data-invalid', 'true');
    });

    it(`should render addons in a disabled state`, () => {
      render(
        <Autocomplete
          {...baseProps}
          startAddon="start-addon"
          endAddon="end-addon"
          isDisabled
        />
      );

      expect(getStartAddon()).toHaveAttribute('data-disabled', 'true');
      expect(getEndAddon()).toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('check data-attributes', () => {
    it('check the fullWidth prop', () => {
      render(<Autocomplete {...baseProps} fullWidth />);

      expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');
    });

    it('check the isDisabled prop', () => {
      render(<Autocomplete {...baseProps} isDisabled />);

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    });

    it('check the isRequired prop', () => {
      render(<Autocomplete {...baseProps} isRequired />);

      expect(getRoot()).toHaveAttribute('data-required', 'true');
    });

    it('check the isInvalid prop', () => {
      render(<Autocomplete {...baseProps} isInvalid />);

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
    });
  });

  it('should not render chevron when disableShowChevron is set', () => {
    render(<Autocomplete {...baseProps} disableShowChevron />);

    expect(getChevron()).not.toBeInTheDocument();
  });

  describe('noItemsText', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should display noItemsText for static items', async () => {
      render(
        <Autocomplete
          {...baseProps}
          menuTrigger="focus"
          noItemsText="empty"
        ></Autocomplete>
      );

      const input = getInput();

      await user.click(input);

      vi.useFakeTimers();

      expect(getPopover()).toHaveTextContent('empty');
    });

    it('should display noItemsText for dynamic items', async () => {
      render(
        <Autocomplete
          {...baseProps}
          items={[]}
          menuTrigger="focus"
          noItemsText="empty"
        />
      );

      const input = getInput();
      await user.click(input);

      expect(getPopover()).toHaveTextContent('empty');
    });
  });

  describe('loading', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should display the loading text when isLoading={true}', async () => {
      render(
        <Autocomplete {...baseProps} menuTrigger="focus" isLoading>
          <Autocomplete.Item key="1">1</Autocomplete.Item>
          <Autocomplete.Item key="2">2</Autocomplete.Item>
          <Autocomplete.Item key="3">3</Autocomplete.Item>
        </Autocomplete>
      );

      const input = getInput();
      await user.click(input);

      expect(screen.getByText('Loading…')).toBeInTheDocument();
    });

    it('should NOT display noItemsText when isLoading={true}', async () => {
      render(
        <Autocomplete
          {...baseProps}
          menuTrigger="focus"
          noItemsText="empty"
          items={[]}
          isLoading
        />
      );

      const input = getInput();
      await user.click(input);

      expect(getPopover()).not.toHaveTextContent('empty');
    });

    it('should display the custom loading text when isLoading={true}', async () => {
      render(
        <Autocomplete
          {...baseProps}
          menuTrigger="focus"
          loadingText="foo"
          isLoading
        />
      );

      const input = getInput();
      await user.click(input);

      expect(screen.getByText('foo')).toBeInTheDocument();
    });
  });

  describe('clear button', () => {
    it('should render clear button only when a value is selected', () => {
      const { rerender } = render(
        <Autocomplete {...baseProps} selectedKey={null} isClearable>
          <Autocomplete.Item key="1">1</Autocomplete.Item>
          <Autocomplete.Item key="2">2</Autocomplete.Item>
          <Autocomplete.Item key="3">3</Autocomplete.Item>
        </Autocomplete>
      );

      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');

      rerender(
        <Autocomplete {...baseProps} selectedKey="1" isClearable>
          <Autocomplete.Item key="1">1</Autocomplete.Item>
          <Autocomplete.Item key="2">2</Autocomplete.Item>
          <Autocomplete.Item key="3">3</Autocomplete.Item>
        </Autocomplete>
      );

      expect(getClearButton()).not.toHaveAttribute('aria-hidden', 'true');
    });

    it('should call onSelectionChange with empty value when cleared', async () => {
      const onSelectionChange = vi.fn((val) => val);

      render(
        <Autocomplete
          {...baseProps}
          selectedKey="1"
          onSelectionChange={onSelectionChange}
          isClearable
        >
          <Autocomplete.Item key="1">1</Autocomplete.Item>
          <Autocomplete.Item key="2">2</Autocomplete.Item>
          <Autocomplete.Item key="3">3</Autocomplete.Item>
        </Autocomplete>
      );

      const clearButton = getClearButton();

      if (clearButton) await userEvent.click(clearButton);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);

      const selection = onSelectionChange.mock.calls?.[0]?.[0];

      expect(selection).toEqual(null);
    });

    it('should call onClear when clear button is clicked', async () => {
      const onClear = vi.fn();

      render(
        <Autocomplete
          {...baseProps}
          selectedKey="1"
          onClear={onClear}
          isClearable
        >
          <Autocomplete.Item key="1">1</Autocomplete.Item>
          <Autocomplete.Item key="2">2</Autocomplete.Item>
          <Autocomplete.Item key="3">3</Autocomplete.Item>
        </Autocomplete>
      );

      const clearButton = getClearButton();

      if (clearButton) await userEvent.click(clearButton);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should NOT render clear button when the component is disabled', async () => {
      const onClear = vi.fn();

      render(
        <Autocomplete
          {...baseProps}
          selectedKey="1"
          onClear={onClear}
          isDisabled
          isClearable
        >
          <Autocomplete.Item key="1">1</Autocomplete.Item>
          <Autocomplete.Item key="2">2</Autocomplete.Item>
          <Autocomplete.Item key="3">3</Autocomplete.Item>
        </Autocomplete>
      );

      const clearButton = getClearButton();

      expect(clearButton).toHaveAttribute('aria-hidden', 'true');
    });

    it('should NOT render clear button when the component is read only', async () => {
      const onClear = vi.fn();

      render(
        <Autocomplete
          {...baseProps}
          selectedKey="1"
          onClear={onClear}
          isReadOnly
          isClearable
        >
          <Autocomplete.Item key="1">1</Autocomplete.Item>
          <Autocomplete.Item key="2">2</Autocomplete.Item>
          <Autocomplete.Item key="3">3</Autocomplete.Item>
        </Autocomplete>
      );

      const clearButton = getClearButton();

      expect(clearButton).toHaveAttribute('aria-hidden', 'true');
    });

    it('should show clear button when any value is entered with allowsCustomValue', async () => {
      const onClear = vi.fn();

      render(
        <Autocomplete
          {...baseProps}
          allowsCustomValue
          onClear={onClear}
          isClearable
        >
          <Autocomplete.Item key="1">1</Autocomplete.Item>
          <Autocomplete.Item key="2">2</Autocomplete.Item>
          <Autocomplete.Item key="3">3</Autocomplete.Item>
        </Autocomplete>
      );

      await userEvent.type(getInput(), 'foo');

      const clearButton = getClearButton();

      expect(clearButton).not.toHaveAttribute('aria-hidden', 'true');

      if (clearButton) await userEvent.click(clearButton);

      expect(clearButton).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('check a filter', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should filter items by contains (case insensitive)', async () => {
      render(
        <Autocomplete {...baseProps} label="Test" data-testid="autocomplete">
          <Autocomplete.Item key="1">Apple</Autocomplete.Item>
          <Autocomplete.Item key="2">Banana</Autocomplete.Item>
          <Autocomplete.Item key="3">Grapes</Autocomplete.Item>
        </Autocomplete>
      );

      const input = getInput();

      await user.click(input);

      await user.type(getInput(), 'ap');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Grapes')).toBeInTheDocument();
      expect(screen.queryByText('Banana')).not.toBeInTheDocument();
    });

    it('should return empty results if nothing matches', async () => {
      render(
        <Autocomplete {...baseProps} label="Test" menuTrigger="focus">
          <Autocomplete.Item key="1">Orange</Autocomplete.Item>
        </Autocomplete>
      );

      const input = getInput();

      await user.click(input);
      await user.type(input, 'xyz');

      expect(screen.queryByText('Orange')).not.toBeInTheDocument();
    });

    it('should use custom defaultFilter to filter items manually', async () => {
      const defaultFilter = vi.fn(
        (textValue: string, inputValue: string) =>
          textValue.startsWith(inputValue) // кастомная логика
      );

      render(
        <Autocomplete
          {...baseProps}
          label="Test"
          defaultFilter={defaultFilter}
          menuTrigger="focus"
        >
          <Autocomplete.Item key="1">Apple</Autocomplete.Item>
          <Autocomplete.Item key="2">Banana</Autocomplete.Item>
          <Autocomplete.Item key="3">Apricot</Autocomplete.Item>
        </Autocomplete>
      );

      const input = getInput();

      await user.click(input);
      await user.type(input, 'Ap');

      expect(defaultFilter).toHaveBeenCalled();

      // Результаты фильтрации
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Apricot')).toBeInTheDocument();
      expect(screen.queryByText('Banana')).not.toBeInTheDocument();
    });
  });

  describe('form', () => {
    it('should pass name to input', () => {
      render(<Autocomplete name="query" aria-label="query" {...baseProps} />);
      const input = getInput();
      expect(input).toHaveAttribute('name', 'query');
    });

    it('should handle aria validation', () => {
      render(
        <Autocomplete
          {...baseProps}
          aria-label="query"
          validationBehavior="aria"
          validate={() => 'validation error'}
        />
      );

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
      expect(getRoot()).toHaveTextContent('validation error');
    });

    it('should propagate Form isDisabled to fields unless overridden', () => {
      const { rerender } = render(
        <Form isDisabled>
          <Autocomplete {...baseProps} />
        </Form>
      );

      expect(getInput()).toBeDisabled();

      rerender(
        <Form isDisabled>
          <Autocomplete {...baseProps} isDisabled={false} />
        </Form>
      );

      expect(getInput()).not.toBeDisabled();
    });
  });

  it('check a client side routing', async () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const onNavigate = vi.fn();

    render(
      <Provider
        router={{
          navigate: () => {
            onNavigate();
          },
        }}
      >
        <Autocomplete menuTrigger="focus" aria-label="Links" {...baseProps}>
          <Autocomplete.Item href="/" data-testid="link">
            link
          </Autocomplete.Item>
        </Autocomplete>
      </Provider>
    );

    await userEvent.click(getInput());

    await userEvent.click(screen.getByTestId('link'));

    expect(onNavigate).toBeCalled();
  });
});
