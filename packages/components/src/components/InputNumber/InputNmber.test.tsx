import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { InputNumber, type InputNumberProps } from './index';

describe('InputNumber', () => {
  const baseProps: InputNumberProps = {
    'data-testid': 'root',
    label: 'label',
    slotProps: {
      input: {
        'data-testid': 'input',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');
  const getInputNumber = () => screen.getByTestId('input');

  it('should accept a ref', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<InputNumber {...baseProps} ref={ref} />);
    const field = container.querySelector(`input`);
    expect(ref.current).toBe(field);
  });

  it('should merge a custom class name with the default ones', () => {
    render(<InputNumber {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display the label', () => {
    render(<InputNumber {...baseProps} />);

    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', async () => {
    const handleChange = vi.fn();
    render(<InputNumber {...baseProps} onChange={handleChange} isDisabled />);

    expect(getInputNumber()).toBeDisabled();

    await userEvent.type(getInputNumber(), '250');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should be required when isRequired is true', () => {
    render(<InputNumber {...baseProps} isRequired />);

    expect(getInputNumber()).toBeRequired();
  });

  it('should display a caption', () => {
    render(<InputNumber {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display an errorMessage', () => {
    render(<InputNumber {...baseProps} errorMessage="fail" isInvalid />);

    expect(getRoot()).toHaveTextContent('fail');
  });

  it('should NOT display a caption when isInvalid is true', () => {
    render(
      <InputNumber
        {...baseProps}
        errorMessage="fail"
        caption="description"
        isInvalid
      />
    );

    expect(getRoot()).toHaveTextContent('fail');
    expect(getRoot()).not.toHaveTextContent('description');
  });

  it('should NOT display an errorMessage when isInvalid is false', () => {
    render(<InputNumber {...baseProps} errorMessage="fail" />);

    expect(getRoot()).not.toHaveTextContent('fail');
  });

  describe('value', () => {
    it(`should set the defaultValue correctly`, () => {
      render(<InputNumber {...baseProps} defaultValue={10} />);

      expect(getInputNumber()).toHaveValue('10');
    });

    it('should call onChange with number when input changes', async () => {
      const handleChange = vi.fn();

      render(<InputNumber {...baseProps} onChange={handleChange} />);

      const input = getInputNumber();
      await userEvent.type(input, '250');
      await userEvent.tab();

      expect(handleChange).toHaveBeenCalledTimes(1);

      expect(handleChange.mock.calls.at(-1)?.[0]).toBe(250);

      expect(input).toHaveValue('250');
    });

    it('should NOT call onChange when when isReadOnly is true', async () => {
      const handleChange = vi.fn();
      render(<InputNumber {...baseProps} onChange={handleChange} isReadOnly />);

      const input = getInputNumber();

      await userEvent.type(input, '250');

      expect(handleChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  describe('addons', () => {
    it(`should render the startAddon`, () => {
      render(<InputNumber {...baseProps} startAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render the endAddon`, () => {
      render(<InputNumber {...baseProps} endAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });
  });

  describe('check data-attributes', () => {
    it('check the variant prop', () => {
      render(<InputNumber {...baseProps} variant="transparent" />);

      expect(getRoot()).toHaveAttribute('data-variant', 'transparent');
    });

    it('check the fullWidth prop', () => {
      render(<InputNumber {...baseProps} fullWidth />);

      expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');
    });

    it('check the isDisabled prop', () => {
      render(<InputNumber {...baseProps} isDisabled />);

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    });

    it('check the isRequired prop', () => {
      render(<InputNumber {...baseProps} isRequired />);

      expect(getRoot()).toHaveAttribute('data-required', 'true');
    });

    it('check the isInvalid prop', () => {
      render(<InputNumber {...baseProps} isInvalid />);

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
    });

    it('check the isReadOnly prop', () => {
      render(<InputNumber {...baseProps} isReadOnly />);

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');
    });
  });
});
