import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Form } from '../../Form';
import { Select, type SelectProps } from '../index';

describe('Select', () => {
  const baseProps: SelectProps<object> = {
    'data-testid': 'root',
    label: 'label',
    selectionMode: 'single',
    children: null,
    slotProps: {
      popover: {
        'data-testid': 'popover',
      },
      control: {
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
  const getControl = () => screen.getByTestId('control');
  const getPopover = () => screen.getByTestId('popover');
  const getClearButton = () => screen?.queryByLabelText('clear-button');
  const getGroup = () => screen.getByTestId('group');

  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Select {...baseProps} ref={ref} />);
    expect(ref.current).toBe(getControl());
  });

  it('should merge a custom class name with the default ones', () => {
    render(<Select {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display a label', () => {
    render(<Select {...baseProps} />);

    expect(screen.getAllByText('label')[0]).toBeInTheDocument();
  });

  it('should display a placeholder', () => {
    render(<Select {...baseProps} placeholder="baz" />);

    expect(screen.getAllByText('baz')[1]).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', async () => {
    const onOpenChange = vi.fn((val) => val);

    render(<Select {...baseProps} onOpenChange={onOpenChange} isDisabled />);

    await userEvent.tab();
    await userEvent.click(getGroup());

    expect(getControl()).not.toHaveFocus();
    expect(onOpenChange).toBeCalledTimes(0);
  });

  it('should be required when isRequired is true', () => {
    render(<Select {...baseProps} isRequired />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display a caption', () => {
    render(<Select {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display an errorMessage', () => {
    render(<Select {...baseProps} errorMessage="fail" isInvalid />);

    expect(getRoot()).toHaveTextContent('fail');
  });

  describe('noItemsText', () => {
    it('should display noItemsText for static items', () => {
      render(<Select {...baseProps} defaultOpen noItemsText="empty"></Select>);

      expect(getPopover()).toHaveTextContent('empty');
    });

    it('should display noItemsText for dynamic items', () => {
      render(
        <Select {...baseProps} defaultOpen items={[]} noItemsText="empty" />
      );

      expect(getPopover()).toHaveTextContent('empty');
    });
  });

  describe('loading', () => {
    it('should display the loading text when isLoading={true}', async () => {
      render(
        <Select {...baseProps} defaultOpen isLoading>
          <Select.Item key="1">1</Select.Item>
          <Select.Item key="2">2</Select.Item>
          <Select.Item key="3">3</Select.Item>
        </Select>
      );

      expect(screen.getByText('Loading…')).toBeInTheDocument();
    });

    it('should NOT display noItemsText when isLoading={true}', () => {
      render(
        <Select
          {...baseProps}
          noItemsText="empty"
          items={[]}
          defaultOpen
          isLoading
        />
      );

      expect(getPopover()).not.toHaveTextContent('empty');
    });

    it('should display the custom loading text when isLoading={true}', async () => {
      render(<Select {...baseProps} loadingText="foo" defaultOpen isLoading />);

      expect(screen.getByText('foo')).toBeInTheDocument();
    });
  });

  describe('items', () => {
    it('should NOT fail when options change with a selected item', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { rerender } = render(
        <Select {...baseProps} defaultSelectedKeys={['first']}>
          <Select.Item key="first">first</Select.Item>
        </Select>
      );

      expect(() =>
        rerender(
          <Select {...baseProps} defaultSelectedKeys={['first']}>
            <Select.Item key="second">second</Select.Item>
          </Select>
        )
      ).not.toThrow();

      expect(
        warnSpy.mock.calls.some(([msg]) =>
          String(msg).includes(
            'Select: Keys "first" passed to "selectedKeys" are not present in the collection.'
          )
        )
      ).toBe(true);

      warnSpy.mockRestore();
    });
  });

  describe('value', () => {
    it(`should set the defaultSelectedKey correctly`, () => {
      render(
        <Select {...baseProps} defaultSelectedKeys={['1']}>
          <Select.Item key="1">1</Select.Item>
          <Select.Item key="2">2</Select.Item>
          <Select.Item key="3">3</Select.Item>
        </Select>
      );

      expect(getControl()).toHaveTextContent('1');
    });

    it(`should call the onSelectionChange when selecting an item`, async () => {
      const onSelectionChange = vi.fn((val) => val);

      render(
        <Select
          {...baseProps}
          onSelectionChange={onSelectionChange}
          defaultOpen
        >
          <Select.Item key="1" data-testid="option-1">
            1
          </Select.Item>
          <Select.Item key="2">2</Select.Item>
          <Select.Item key="3">3</Select.Item>
        </Select>
      );

      const option = screen.getByTestId('option-1');

      await userEvent.click(option);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);

      const result = onSelectionChange.mock.results[0]?.value;
      expect(result).toBeInstanceOf(Set);
      expect(result.has('1')).toBe(true);
      expect(result.size).toBe(1);

      expect(getControl()).toHaveTextContent('1');
    });
  });

  describe('addons', () => {
    const getStartAddon = () => screen.getByTestId('field-addon-start');
    const getEndAddon = () => screen.getByTestId('field-addon-end');

    it(`should render a startAddon`, () => {
      render(<Select {...baseProps} startAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render an endAddon`, () => {
      render(<Select {...baseProps} endAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render addons in an error state`, () => {
      render(
        <Select
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
        <Select
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
      render(<Select {...baseProps} fullWidth />);

      expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');
    });

    it('check the isDisabled prop', () => {
      render(<Select {...baseProps} isDisabled />);

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    });

    it('check the isRequired prop', () => {
      render(<Select {...baseProps} isRequired />);

      expect(getRoot()).toHaveAttribute('data-required', 'true');
    });

    it('check the isInvalid prop', () => {
      render(<Select {...baseProps} isInvalid />);

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
    });
  });

  describe('clear button', () => {
    it('should render clear button only when a value is selected', () => {
      const { rerender } = render(
        <Select {...baseProps} selectedKeys={[]} isClearable>
          <Select.Item key="1">1</Select.Item>
          <Select.Item key="2">2</Select.Item>
          <Select.Item key="3">3</Select.Item>
        </Select>
      );

      expect(getClearButton()).not.toBeInTheDocument();

      rerender(
        <Select {...baseProps} selectedKeys={['1']} isClearable>
          <Select.Item key="1">1</Select.Item>
          <Select.Item key="2">2</Select.Item>
          <Select.Item key="3">3</Select.Item>
        </Select>
      );

      expect(getClearButton()).toBeInTheDocument();
    });

    it('should call onSelectionChange with empty value when cleared', async () => {
      const onSelectionChange = vi.fn((val) => val);

      render(
        <Select
          {...baseProps}
          selectedKeys={['1']}
          onSelectionChange={onSelectionChange}
          isClearable
        >
          <Select.Item key="1">1</Select.Item>
          <Select.Item key="2">2</Select.Item>
          <Select.Item key="3">3</Select.Item>
        </Select>
      );

      const clearButton = getClearButton();

      if (clearButton) await userEvent.click(clearButton);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);

      const selection = onSelectionChange.mock.calls?.[0]?.[0];

      expect([...selection]).toEqual([]);
    });

    it('should call onClear when clear button is clicked', async () => {
      const onClear = vi.fn();

      render(
        <Select
          {...baseProps}
          selectedKeys={['1']}
          onClear={onClear}
          isClearable
        >
          <Select.Item key="1">1</Select.Item>
          <Select.Item key="2">2</Select.Item>
          <Select.Item key="3">3</Select.Item>
        </Select>
      );

      const clearButton = getClearButton();

      if (clearButton) await userEvent.click(clearButton);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should NOT render clear button when Select is disabled', async () => {
      const onClear = vi.fn();

      render(
        <Select
          {...baseProps}
          selectedKeys={['1']}
          onClear={onClear}
          isDisabled
          isClearable
        >
          <Select.Item key="1">1</Select.Item>
          <Select.Item key="2">2</Select.Item>
          <Select.Item key="3">3</Select.Item>
        </Select>
      );

      const clearButton = getClearButton();

      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('form', () => {
    it('should handle aria validation', () => {
      render(
        <Select
          {...baseProps}
          validationBehavior="aria"
          validate={() => 'validation error'}
        >
          <Select.Item key="1">1</Select.Item>
          <Select.Item key="2">2</Select.Item>
          <Select.Item key="3">3</Select.Item>
        </Select>
      );

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
      expect(getRoot()).toHaveTextContent('validation error');
    });

    it('should propagate Form isDisabled to fields unless overridden', () => {
      const { rerender } = render(
        <Form isDisabled>
          <Select {...baseProps}>
            <Select.Item key="1">1</Select.Item>
            <Select.Item key="2">2</Select.Item>
            <Select.Item key="3">3</Select.Item>
          </Select>
        </Form>
      );

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');

      rerender(
        <Form isDisabled>
          <Select {...baseProps} isDisabled={false}>
            <Select.Item key="1">1</Select.Item>
            <Select.Item key="2">2</Select.Item>
            <Select.Item key="3">3</Select.Item>
          </Select>
        </Form>
      );

      expect(getRoot()).not.toHaveAttribute('data-disabled', 'true');
    });
  });
});
