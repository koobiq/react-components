import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Form } from '../Form';

import { Input, type InputProps } from './index';

describe('Input', () => {
  const baseProps: InputProps = {
    'data-testid': 'root',
    label: 'label',
    slotProps: {
      input: {
        'data-testid': 'input',
      },
      clearButton: {
        'aria-label': 'clear-button',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');
  const getInput = () => screen.getByTestId('input');
  const getClearButton = () => screen.queryByLabelText('clear-button');

  it('should accept a ref', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Input {...baseProps} ref={ref} />);
    const field = container.querySelector(`input`);
    expect(ref.current).toBe(field);
  });

  it('should merge a custom class name with the default ones', () => {
    render(<Input {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display the label', () => {
    render(<Input {...baseProps} />);

    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', async () => {
    const handleChange = vi.fn();
    render(<Input {...baseProps} onChange={handleChange} isDisabled />);

    expect(getInput()).toBeDisabled();

    await userEvent.type(getInput(), 'hello');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should be required when isRequired is true', () => {
    render(<Input {...baseProps} isRequired />);

    expect(getInput()).toBeRequired();
  });

  it('should display a caption', () => {
    render(<Input {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display an errorMessage', () => {
    render(<Input {...baseProps} errorMessage="fail" isInvalid />);

    expect(getRoot()).toHaveTextContent('fail');
  });

  describe('check the clear button', () => {
    it('should render when input has value', () => {
      render(<Input {...baseProps} defaultValue="value" isClearable />);
      expect(getClearButton()).not.toHaveAttribute('aria-hidden', 'true');
    });

    it('should not render when input is disabled', () => {
      render(
        <Input {...baseProps} defaultValue="value" isDisabled isClearable />
      );

      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not render when input is read-only', () => {
      render(
        <Input {...baseProps} defaultValue="value" isReadOnly isClearable />
      );

      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');
    });

    it('should clear the input and call handlers when clicked', async () => {
      const onClear = vi.fn();
      const onChange = vi.fn();

      render(
        <Input
          {...baseProps}
          defaultValue="value"
          onClear={onClear}
          onChange={onChange}
          isClearable
        />
      );

      const clearButton = getClearButton();

      expect(clearButton).not.toHaveAttribute('aria-hidden', 'true');

      if (clearButton) await userEvent.click(clearButton);

      expect(clearButton).toHaveAttribute('aria-hidden', 'true');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('value', () => {
    it(`should set the defaultValue correctly`, () => {
      render(<Input {...baseProps} defaultValue="value" />);

      expect(getInput()).toHaveValue('value');
    });

    it(`should call the onChange when changing the text field`, async () => {
      const handleChange = vi.fn((obj) => obj);
      render(<Input {...baseProps} onChange={handleChange} />);

      await userEvent.type(getInput(), 'hello');

      expect(handleChange).toHaveBeenCalledTimes(5);

      expect(handleChange.mock.results[4]?.value).toStrictEqual('hello');

      expect(getInput()).toHaveValue('hello');
    });

    it('should NOT call onChange when when isReadOnly is true', async () => {
      const handleChange = vi.fn();
      render(<Input {...baseProps} onChange={handleChange} isReadOnly />);

      const input = getInput();

      await userEvent.type(input, 'hello');

      expect(handleChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  describe('addons', () => {
    const getStartAddon = () => screen.getByTestId('field-addon-start');
    const getEndAddon = () => screen.getByTestId('field-addon-end');

    it(`should render a startAddon`, () => {
      render(<Input {...baseProps} startAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render an endAddon`, () => {
      render(<Input {...baseProps} endAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render addons in an error state`, () => {
      render(
        <Input
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
        <Input
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
    it('check the variant prop', () => {
      render(<Input {...baseProps} variant="transparent" />);

      expect(getRoot()).toHaveAttribute('data-variant', 'transparent');
    });

    it('check the fullWidth prop', () => {
      render(<Input {...baseProps} fullWidth />);

      expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');
    });

    it('check the isDisabled prop', () => {
      render(<Input {...baseProps} isDisabled />);

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    });

    it('check the isRequired prop', () => {
      render(<Input {...baseProps} isRequired />);

      expect(getRoot()).toHaveAttribute('data-required', 'true');
    });

    it('check the isInvalid prop', () => {
      render(<Input {...baseProps} isInvalid />);

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
    });

    it('check the isReadOnly prop', () => {
      render(<Input {...baseProps} isReadOnly />);

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');
    });
  });

  describe('form', () => {
    it('should pass name to input', () => {
      render(<Input {...baseProps} name="email" aria-label="email" />);
      expect(getInput()).toHaveAttribute('name', 'email');
    });

    it('should handle aria validation', () => {
      render(
        <Input
          {...baseProps}
          name="email"
          aria-label="email"
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
          <Input {...baseProps} aria-label="input" />
        </Form>
      );

      expect(getInput()).toBeDisabled();

      rerender(
        <Form isDisabled>
          <Input {...baseProps} isDisabled={false} aria-label="input" />
        </Form>
      );

      expect(getInput()).not.toBeDisabled();
    });

    it('should propagate Form isReadOnly to fields unless overridden', () => {
      const { rerender } = render(
        <Form isReadOnly>
          <Input {...baseProps} aria-label="input" />
        </Form>
      );

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');

      rerender(
        <Form isReadOnly>
          <Input {...baseProps} isReadOnly={false} aria-label="input" />
        </Form>
      );

      expect(getRoot()).not.toHaveAttribute('data-readonly', 'true');
    });
  });
});
