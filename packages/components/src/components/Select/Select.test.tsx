import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { ListItem } from '../List';

import { Select, type SelectProps } from './index';

describe('Select', () => {
  const baseProps: SelectProps<object> = {
    'data-testid': 'root',
    label: 'label',
    slotProps: {
      control: {
        'data-testid': 'control',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');
  const getControl = () => screen.getByTestId('control');

  it('should accept a ref', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(<Select {...baseProps} ref={ref} />);
    const field = container.querySelector(`button`);
    expect(ref.current).toBe(field);
  });

  it('should merge a custom class name with the default ones', () => {
    render(<Select {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display the label', () => {
    render(<Select {...baseProps} />);

    expect(screen.getAllByText('label')[0]).toBeInTheDocument();
  });

  it('should be blocked when disabled={true} is set', async () => {
    const handleChange = vi.fn();
    render(<Select {...baseProps} onSelectionChange={handleChange} />);

    await userEvent.click(getControl());

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should be required when set to required', () => {
    render(<Select {...baseProps} required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display a caption', () => {
    render(<Select {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display a errorMessage', () => {
    render(<Select {...baseProps} errorMessage="fail" error />);

    expect(getRoot()).toHaveTextContent('fail');
  });

  describe('value', () => {
    it(`should set the defaultSelectedKey correctly`, () => {
      render(
        <Select {...baseProps} defaultSelectedKey="1">
          <ListItem key="1">1</ListItem>
          <ListItem key="2">2</ListItem>
          <ListItem key="3">3</ListItem>
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
          <ListItem key="1">1</ListItem>
          <ListItem key="2">2</ListItem>
          <ListItem key="3">3</ListItem>
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
    it(`should render the startAddon`, () => {
      render(<Select {...baseProps} startAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render the endAddon`, () => {
      render(<Select {...baseProps} endAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });
  });

  describe('check data-attributes', () => {
    it('check the fullWidth prop', () => {
      render(<Select {...baseProps} fullWidth />);

      expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');
    });

    it('check the disabled prop', () => {
      render(<Select {...baseProps} disabled />);

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    });

    it('check the required prop', () => {
      render(<Select {...baseProps} required />);

      expect(getRoot()).toHaveAttribute('data-required', 'true');
    });

    it('check the error prop', () => {
      render(<Select {...baseProps} error />);

      expect(getRoot()).toHaveAttribute('data-error', 'true');
    });
  });
});
