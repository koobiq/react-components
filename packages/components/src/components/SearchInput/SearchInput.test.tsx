import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Form } from '../Form';

import { SearchInput, type SearchInputProps } from './index';

describe('SearchInput', () => {
  const baseProps: SearchInputProps = {
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
    const { container } = render(<SearchInput {...baseProps} ref={ref} />);
    const field = container.querySelector(`input`);
    expect(ref.current).toBe(field);
  });

  it('should merge a custom class name with the default ones', () => {
    render(<SearchInput {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display the label', () => {
    render(<SearchInput {...baseProps} />);

    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', async () => {
    const handleChange = vi.fn();
    render(<SearchInput {...baseProps} onChange={handleChange} isDisabled />);

    expect(getInput()).toBeDisabled();

    await userEvent.type(getInput(), 'hello');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should be required when isRequired is true', () => {
    render(<SearchInput {...baseProps} isRequired />);

    expect(getInput()).toBeRequired();
  });

  it('should display a caption', () => {
    render(<SearchInput {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display an errorMessage', () => {
    render(<SearchInput {...baseProps} errorMessage="fail" isInvalid />);

    expect(getRoot()).toHaveTextContent('fail');
  });

  describe('check the clear button', () => {
    it('should render when input has value', () => {
      render(<SearchInput {...baseProps} defaultValue="value" />);
      expect(getClearButton()).not.toHaveAttribute('aria-hidden', 'true');
    });

    it('should not render when input is disabled', () => {
      render(<SearchInput {...baseProps} defaultValue="value" isDisabled />);
      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not render when input is read-only', () => {
      render(<SearchInput {...baseProps} defaultValue="value" isReadOnly />);
      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');
    });

    it('should clear the input and call handlers when clicked', async () => {
      const onClear = vi.fn();
      const onChange = vi.fn();

      render(
        <SearchInput
          {...baseProps}
          defaultValue="value"
          onClear={onClear}
          onChange={onChange}
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
      render(<SearchInput {...baseProps} defaultValue="value" />);

      expect(getInput()).toHaveValue('value');
    });

    it(`should call the onChange when changing the text field`, async () => {
      const handleChange = vi.fn((obj) => obj);
      render(<SearchInput {...baseProps} onChange={handleChange} />);

      await userEvent.type(getInput(), 'hello');

      expect(handleChange).toHaveBeenCalledTimes(5);

      expect(handleChange.mock.results[4]?.value).toStrictEqual('hello');

      expect(getInput()).toHaveValue('hello');
    });

    it('should NOT call onChange when when isReadOnly is true', async () => {
      const handleChange = vi.fn();
      render(<SearchInput {...baseProps} onChange={handleChange} isReadOnly />);

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
      render(<SearchInput {...baseProps} startAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render an endAddon`, () => {
      render(<SearchInput {...baseProps} endAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render addons in an error state`, () => {
      render(
        <SearchInput
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
        <SearchInput
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
      render(<SearchInput {...baseProps} variant="transparent" />);

      expect(getRoot()).toHaveAttribute('data-variant', 'transparent');
    });

    it('check the fullWidth prop', () => {
      render(<SearchInput {...baseProps} fullWidth />);

      expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');
    });

    it('check the isDisabled prop', () => {
      render(<SearchInput {...baseProps} isDisabled />);

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    });

    it('check the isRequired prop', () => {
      render(<SearchInput {...baseProps} isRequired />);

      expect(getRoot()).toHaveAttribute('data-required', 'true');
    });

    it('check the isInvalid prop', () => {
      render(<SearchInput {...baseProps} isInvalid />);

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
    });

    it('check the isReadOnly prop', () => {
      render(<SearchInput {...baseProps} isReadOnly />);

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');
    });
  });

  describe('form', () => {
    it('should pass name to input', () => {
      render(<SearchInput name="query" aria-label="query" />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('name', 'query');
    });

    it('should handle aria validation', () => {
      render(
        <SearchInput
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
          <SearchInput {...baseProps} />
        </Form>
      );

      expect(getInput()).toBeDisabled();

      rerender(
        <Form isDisabled>
          <SearchInput {...baseProps} isDisabled={false} />
        </Form>
      );

      expect(getInput()).not.toBeDisabled();
    });

    it('should propagate Form isReadOnly to fields unless overridden', () => {
      const { rerender } = render(
        <Form isReadOnly>
          <SearchInput {...baseProps} />
        </Form>
      );

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');

      rerender(
        <Form isReadOnly>
          <SearchInput {...baseProps} isReadOnly={false} />
        </Form>
      );

      expect(getRoot()).not.toHaveAttribute('data-readonly', 'true');
    });
  });
});
