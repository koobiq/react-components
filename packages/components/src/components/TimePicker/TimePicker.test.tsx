import { createRef } from 'react';

import type { Time } from '@internationalized/date';
import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { TimePicker, type TimePickerProps } from './index';

describe('TimePicker', () => {
  const baseProps: TimePickerProps<Time> = {
    'data-testid': 'root',
    label: 'label',
    slotProps: {
      inputDate: {
        'data-testid': 'input',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');

  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<TimePicker {...baseProps} ref={ref} />);
    const field = container.querySelectorAll(`div[role="group"]`);

    expect(ref.current).toBe(field[1]);
  });

  it('should merge a custom class name with the default ones', () => {
    render(<TimePicker {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display the label', () => {
    render(<TimePicker {...baseProps} />);

    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', async () => {
    const { container } = render(<TimePicker {...baseProps} isDisabled />);

    const elements = container.querySelectorAll('[contenteditable="false"]');
    expect(elements).toHaveLength(3);
  });

  it('should be disabled when isReadOnly is true', async () => {
    const { container } = render(<TimePicker {...baseProps} isReadOnly />);

    const elements = container.querySelectorAll('[contenteditable="false"]');
    expect(elements).toHaveLength(3);
  });

  it('should be required when isRequired is true', () => {
    render(<TimePicker {...baseProps} isRequired />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display a caption', () => {
    render(<TimePicker {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display an errorMessage', () => {
    render(<TimePicker {...baseProps} errorMessage="fail" isInvalid />);

    expect(getRoot()).toHaveTextContent('fail');
  });

  describe('addons', () => {
    const getStartAddon = () => screen.getByTestId('field-addon-start');
    const getEndAddon = () => screen.getByTestId('field-addon-end');

    it(`should render a startAddon`, () => {
      render(<TimePicker {...baseProps} startAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render an endAddon`, () => {
      render(<TimePicker {...baseProps} endAddon="addon" />);

      expect(getRoot()).toHaveTextContent('addon');
    });

    it(`should render addons in an error state`, () => {
      render(
        <TimePicker
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
        <TimePicker
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
      render(<TimePicker {...baseProps} variant="transparent" />);

      expect(getRoot()).toHaveAttribute('data-variant', 'transparent');
    });

    it('check the fullWidth prop', () => {
      render(<TimePicker {...baseProps} fullWidth />);

      expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');
    });

    it('check the isDisabled prop', () => {
      render(<TimePicker {...baseProps} isDisabled />);

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    });

    it('check the isRequired prop', () => {
      render(<TimePicker {...baseProps} isRequired />);

      expect(getRoot()).toHaveAttribute('data-required', 'true');
    });

    it('check the isInvalid prop', () => {
      render(<TimePicker {...baseProps} isInvalid />);

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
    });

    it('check the isReadOnly prop', () => {
      render(<TimePicker {...baseProps} isReadOnly />);

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');
    });
  });
});
