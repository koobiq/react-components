import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { DateInput, type DateInputProps } from './index';

describe('DateInput', () => {
  const baseProps: DateInputProps = {
    'data-testid': 'root',
    label: 'label',
    slotProps: {
      inputDate: {
        'data-testid': 'input',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');
  const getDateInput = () => screen.getByTestId('input');

  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<DateInput {...baseProps} ref={ref} />);
    const field = container.querySelectorAll(`div[role="group"]`);

    expect(ref.current).toBe(field[1]);
  });

  it('should merge a custom class name with the default ones', () => {
    render(<DateInput {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display the label', () => {
    render(<DateInput {...baseProps} />);

    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', async () => {
    const { container } = render(<DateInput {...baseProps} isDisabled />);

    const elements = container.querySelectorAll('[contenteditable="false"]');
    expect(elements).toHaveLength(3);
  });

  it('should be disabled when isReadOnly is true', async () => {
    const { container } = render(<DateInput {...baseProps} isReadOnly />);

    const elements = container.querySelectorAll('[contenteditable="false"]');
    expect(elements).toHaveLength(3);
  });

  it('should be required when isRequired is true', () => {
    render(<DateInput {...baseProps} isRequired />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display a caption', () => {
    render(<DateInput {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display an errorMessage', () => {
    render(<DateInput {...baseProps} errorMessage="fail" isInvalid />);

    expect(getRoot()).toHaveTextContent('fail');
  });

  describe('value', () => {
    it.skip(`should set the defaultValue correctly`, () => {
      render(<DateInput {...baseProps} defaultValue="value" />);

      expect(getDateInput()).toHaveValue('value');
    });

    it.skip(`should call the onChange when changing the text field`, async () => {
      const handleChange = vi.fn((obj) => obj);
      render(<DateInput {...baseProps} onChange={handleChange} />);

      await userEvent.type(getDateInput(), 'hello');

      expect(handleChange).toHaveBeenCalledTimes(5);

      expect(handleChange.mock.results[4]?.value).toStrictEqual('hello');

      expect(getDateInput()).toHaveValue('hello');
    });
  });

  describe('addons', () => {
    it(`should render the startAddon`, () => {
      render(<DateInput {...baseProps} startAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render the endAddon`, () => {
      render(<DateInput {...baseProps} endAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });
  });

  describe('check data-attributes', () => {
    it('check the variant prop', () => {
      render(<DateInput {...baseProps} variant="transparent" />);

      expect(getRoot()).toHaveAttribute('data-variant', 'transparent');
    });

    it('check the fullWidth prop', () => {
      render(<DateInput {...baseProps} fullWidth />);

      expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');
    });

    it('check the isDisabled prop', () => {
      render(<DateInput {...baseProps} isDisabled />);

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    });

    it('check the isRequired prop', () => {
      render(<DateInput {...baseProps} isRequired />);

      expect(getRoot()).toHaveAttribute('data-required', 'true');
    });

    it('check the isInvalid prop', () => {
      render(<DateInput {...baseProps} isInvalid />);

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
    });

    it('check the isReadOnly prop', () => {
      render(<DateInput {...baseProps} isReadOnly />);

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');
    });
  });
});
