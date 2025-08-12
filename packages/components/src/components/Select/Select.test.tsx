import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Select, type SelectProps } from './index';

describe('Select', () => {
  const baseProps: SelectProps<object> = {
    'data-testid': 'root',
    label: 'label',
    children: null,
    slotProps: {
      control: {
        'data-testid': 'control',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');
  const getControl = () => screen.getByTestId('control');

  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Select {...baseProps} ref={ref} />);
    expect(ref.current).toBe(getControl());
  });

  it('should merge a custom class name with the default ones', () => {
    render(<Select {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display the label', () => {
    render(<Select {...baseProps} />);

    expect(screen.getAllByText('label')[0]).toBeInTheDocument();
  });

  it('should display a placeholder', () => {
    render(<Select {...baseProps} placeholder="baz" />);

    expect(screen.getByText('baz')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', async () => {
    render(<Select {...baseProps} isDisabled />);

    await userEvent.tab();

    expect(getControl()).not.toHaveFocus();
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

  describe('value', () => {
    it(`should set the defaultSelectedKey correctly`, () => {
      render(
        <Select {...baseProps} defaultSelectedKey="1">
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
          <Select.Item key="1">1</Select.Item>
          <Select.Item key="2">2</Select.Item>
          <Select.Item key="3">3</Select.Item>
        </Select>
      );

      const [, firstItem] = screen.getAllByText('1');

      await userEvent.click(firstItem);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);

      expect(onSelectionChange.mock.results[0]?.value).toStrictEqual('1');

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

    it('check the isInvalid  prop', () => {
      render(<Select {...baseProps} isInvalid />);

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
    });
  });
});
