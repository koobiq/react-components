import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Input, type InputProps } from './index';

describe('Input', () => {
  const baseProps: InputProps = {
    'data-testid': 'root',
    label: 'label',
    slotProps: {
      input: {
        'data-testid': 'input',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');
  const getInput = () => screen.getByTestId('input');

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

  it('should be blocked when disabled={true} is set', async () => {
    const handleChange = vi.fn();
    render(<Input {...baseProps} onChange={handleChange} disabled />);

    expect(getInput()).toBeDisabled();

    await userEvent.type(getInput(), 'hello');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should be required when set to required', () => {
    render(<Input {...baseProps} required />);

    expect(getInput()).toBeRequired();
  });

  it('should display a caption', () => {
    render(<Input {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display a errorMessage', () => {
    render(<Input {...baseProps} errorMessage="fail" error />);

    expect(getRoot()).toHaveTextContent('fail');
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

    describe('addons', () => {
      it(`should render the startAddon`, () => {
        render(<Input {...baseProps} startAddon="addon" />);

        expect(getRoot()).toHaveTextContent('addon');
      });

      it(`should render the endAddon`, () => {
        render(<Input {...baseProps} endAddon="addon" />);

        expect(getRoot()).toHaveTextContent('addon');
      });
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

    it('check the disabled prop', () => {
      render(<Input {...baseProps} disabled />);

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    });

    it('check the required prop', () => {
      render(<Input {...baseProps} required />);

      expect(getRoot()).toHaveAttribute('data-required', 'true');
    });

    it('check the error prop', () => {
      render(<Input {...baseProps} error />);

      expect(getRoot()).toHaveAttribute('data-error', 'true');
    });

    it('check the readonly prop', () => {
      render(<Input {...baseProps} readonly />);

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');
    });
  });
});
