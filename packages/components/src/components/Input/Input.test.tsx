import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Input } from './index';

describe('Input', () => {
  const baseProps = {
    label: 'Label',
    'aria-label': 'input',
    slotProps: {
      root: { 'aria-label': 'root' },
    },
  };

  const getRoot = () => screen.getByLabelText('root');
  const getInput = () => screen.getByLabelText('input');

  it('should accept a ref', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Input {...baseProps} ref={ref} />);
    const field = container.querySelector(`input`);
    expect(ref.current).toBe(field);
  });

  it('should accept a custom class', () => {
    render(<Input {...baseProps} className="custom-class-name" />);

    expect(getRoot()).toHaveClass('custom-class-name');
  });

  it('should display the label', () => {
    render(<Input {...baseProps} />);

    expect(screen.getByText(baseProps.label)).toBeInTheDocument();
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
    render(<Input {...baseProps} caption="helper-text" />);

    expect(getRoot()).toHaveTextContent('helper-text');
  });

  describe('value', () => {
    it(`should set the defaultValue correctly`, () => {
      render(<Input {...baseProps} defaultValue="default-value" />);

      expect(getInput()).toHaveValue('default-value');
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
});
