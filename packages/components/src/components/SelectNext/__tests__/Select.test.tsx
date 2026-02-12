import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Form } from '../../Form';
import type { SelectProps } from '../index';
import { Select } from '../index';

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
  const getClearButton = () => screen.queryByLabelText('clear-button');
  const getGroup = () => screen.getByTestId('group');
  const getOptions = () => screen.getAllByRole('option');

  const getSearchInput = () =>
    screen.getByRole('searchbox', { name: 'search' }) as HTMLInputElement;

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
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
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
      expect(() =>
        render(
          <Select {...baseProps} defaultValue="second">
            <Select.Item id="first">second</Select.Item>
          </Select>
        )
      ).not.toThrow();
    });
  });

  describe('value', () => {
    it('should set the defaultSelectedKey correctly', () => {
      render(
        <Select {...baseProps} defaultValue="1">
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      expect(getControl()).toHaveTextContent('1');
    });

    it('should call the onChange when selecting an item', async () => {
      const onChange = vi.fn((val) => val);

      render(
        <Select {...baseProps} onChange={onChange} defaultOpen>
          <Select.Item id="1" data-testid="option-1">
            1
          </Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      await userEvent.click(screen.getByTestId('option-1'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.results[0]?.value).toBe('1');
      expect(getControl()).toHaveTextContent('1');
    });
  });

  describe('addons', () => {
    const getStartAddon = () => screen.getByTestId('field-addon-start');
    const getEndAddon = () => screen.getByTestId('field-addon-end');

    it('should render a startAddon', () => {
      render(<Select {...baseProps} startAddon="addon" />);
      expect(getRoot()).toHaveTextContent('addon');
    });

    it('should render an endAddon', () => {
      render(<Select {...baseProps} endAddon="addon" />);
      expect(getRoot()).toHaveTextContent('addon');
    });

    it('should render addons in an error state', () => {
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

    it('should render addons in a disabled state', () => {
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
        <Select {...baseProps} value={null} isClearable>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');

      rerender(
        <Select {...baseProps} value="1" isClearable>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      expect(getClearButton()).not.toHaveAttribute('aria-hidden', 'true');
    });

    it('should call onChange with empty value when cleared', async () => {
      const onChange = vi.fn((val) => val);

      render(
        <Select {...baseProps} value="1" onChange={onChange} isClearable>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      const clearButton = getClearButton();
      if (clearButton) await userEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls?.[0]?.[0]).toEqual(null);
    });

    it('should call onClear when clear button is clicked', async () => {
      const onClear = vi.fn();

      render(
        <Select {...baseProps} value="1" onClear={onClear} isClearable>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
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
          value="1"
          onClear={onClear}
          isDisabled
          isClearable
        >
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('keyboard navigation', () => {
    it('should move focus through options with ArrowDown/ArrowUp', async () => {
      render(
        <Select {...baseProps} defaultOpen>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      const [opt1, opt2, opt3] = getOptions();

      await userEvent.keyboard('{ArrowDown}');
      expect(opt1).toBe(document.activeElement);

      await userEvent.keyboard('{ArrowDown}');
      expect(opt2).toBe(document.activeElement);

      await userEvent.keyboard('{ArrowDown}');
      expect(opt3).toBe(document.activeElement);

      await userEvent.keyboard('{ArrowUp}');
      expect(opt2).toBe(document.activeElement);
    });

    it('should support Home/End keys', async () => {
      render(
        <Select {...baseProps} defaultOpen>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      const [opt1, , opt3] = getOptions();

      await userEvent.keyboard('{End}');
      expect(opt3).toBe(document.activeElement);

      await userEvent.keyboard('{Home}');
      expect(opt1).toBe(document.activeElement);
    });

    it('should select focused option with Enter', async () => {
      const onChange = vi.fn((val) => val);

      render(
        <Select {...baseProps} defaultOpen onChange={onChange}>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.results[0]?.value).toBe('2');
      expect(getControl()).toHaveTextContent('2');
    });

    it('should close on Escape without changing selection', async () => {
      const onChange = vi.fn((val) => val);

      render(
        <Select {...baseProps} value="1" onChange={onChange} defaultOpen>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Escape}');

      expect(onChange).toHaveBeenCalledTimes(0);
      expect(getControl()).toHaveTextContent('1');
    });

    it('should set aria-selected after selection', async () => {
      render(
        <Select {...baseProps} defaultOpen>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');

      expect(screen.getByRole('option', { name: '3' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('should update aria-activedescendant on search input while navigating', async () => {
      render(
        <Select {...baseProps} defaultOpen isSearchable>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      const input = getSearchInput();
      input.focus();

      const [opt1, opt2] = getOptions();

      await userEvent.keyboard('{ArrowDown}');
      expect(document.activeElement).toBe(input);

      expect(opt1).toHaveAttribute(
        'id',
        input.getAttribute('aria-activedescendant')
      );

      await userEvent.keyboard('{ArrowDown}');
      expect(document.activeElement).toBe(input);

      expect(opt2).toHaveAttribute(
        'id',
        input.getAttribute('aria-activedescendant')
      );
    });

    it('should select active option with Enter while focus stays on search input', async () => {
      const onChange = vi.fn((val) => val);

      render(
        <Select {...baseProps} defaultOpen isSearchable onChange={onChange}>
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      const input = getSearchInput();
      input.focus();

      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

      expect(document.activeElement).toBe(input);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.results[0]?.value).toBe('2');
      expect(getControl()).toHaveTextContent('2');
    });
  });

  describe('form', () => {
    it('should handle aria validation', () => {
      render(
        <Select
          {...baseProps}
          defaultValue="1"
          validationBehavior="aria"
          validate={() => 'validation error'}
        >
          <Select.Item id="1">1</Select.Item>
          <Select.Item id="2">2</Select.Item>
          <Select.Item id="3">3</Select.Item>
        </Select>
      );

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
      expect(getRoot()).toHaveTextContent('validation error');
    });

    it('should propagate Form isDisabled to fields unless overridden', () => {
      const { rerender } = render(
        <Form isDisabled>
          <Select {...baseProps}>
            <Select.Item id="1">1</Select.Item>
            <Select.Item id="2">2</Select.Item>
            <Select.Item id="3">3</Select.Item>
          </Select>
        </Form>
      );

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');

      rerender(
        <Form isDisabled>
          <Select {...baseProps} isDisabled={false}>
            <Select.Item id="1">1</Select.Item>
            <Select.Item id="2">2</Select.Item>
            <Select.Item id="3">3</Select.Item>
          </Select>
        </Form>
      );

      expect(getRoot()).not.toHaveAttribute('data-disabled', 'true');
    });
  });
});
