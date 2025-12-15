import { createRef } from 'react';

import { useBoolean } from '@koobiq/react-core';
import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import {
  Toggle,
  togglePropLabelPlacement,
  type ToggleProps,
  togglePropSize,
} from './index';

const ControlledToggle = ({
  isSelected: isSelectedProp,
  onChange: onChangeProp,
  ...restProps
}: Omit<ToggleProps, 'children'>) => {
  const [isSelected, { set }] = useBoolean(isSelectedProp);

  const onChange: ToggleProps['onChange'] = (value) => {
    onChangeProp?.(value);
    set(value);
  };

  return (
    <Toggle
      aria-label="input"
      data-testid="root"
      isSelected={isSelected}
      onChange={onChange}
      {...restProps}
    />
  );
};

describe('Toggle', () => {
  const baseProps = {
    'data-testid': 'root',
  };

  const getRoot = () => screen.getByTestId('root');

  describe('business logic', () => {
    it('should accept the ref', () => {
      const ref = createRef<HTMLLabelElement>();
      const { container } = render(<Toggle {...baseProps} ref={ref} />);
      const labelElement = container.querySelector('label');
      expect(ref.current).toBe(labelElement);
    });

    it('should accept a custom class', () => {
      render(<Toggle {...baseProps} className="foo" />);

      expect(getRoot()).toHaveClass('foo');
    });

    it('should set custom style', () => {
      const style = { padding: 20 };

      const { container } = render(<Toggle style={style} />);

      const firstElement = container.firstChild;

      expect(firstElement).toHaveStyle({ padding: '20px' });
    });

    describe('check the size prop', () => {
      it.each(togglePropSize)('should apply the size as a "%s"', (size) => {
        render(<Toggle {...baseProps} size={size} />);

        expect(getRoot()).toHaveAttribute('data-size', size);
      });
    });

    describe('check the labelPlacement prop', () => {
      it.each(togglePropLabelPlacement)(
        'should apply the labelPlacement as a "%s"',
        (labelPlacement) => {
          render(<Toggle {...baseProps} labelPlacement={labelPlacement} />);

          expect(getRoot()).toHaveAttribute(
            'data-label-placement',
            labelPlacement
          );
        }
      );
    });

    it('should display the text', () => {
      render(<Toggle {...baseProps}>foo</Toggle>);

      expect(screen.getByText('foo')).toBeInTheDocument();
    });

    it('should update checked state on click in uncontrolled mode', async () => {
      render(<Toggle {...baseProps} aria-label="input" />);

      const inputEl = screen.getByLabelText('input');
      await userEvent.click(getRoot());
      expect(inputEl).toBeChecked();
    });

    it('should update checked state on click in controlled mode', async () => {
      const onChange = vi.fn();

      render(<ControlledToggle onChange={onChange} />);

      const inputEl = screen.getByLabelText('input');
      expect(inputEl).not.toBeChecked();

      await userEvent.click(getRoot());
      expect(inputEl).toBeChecked();

      expect(onChange).toBeCalledWith(true);
    });

    it('should render as checked when isSelected is true (uncontrolled mode)', async () => {
      render(<Toggle {...baseProps} defaultSelected aria-label="input" />);

      const inputEl = screen.getByLabelText('input');
      expect(inputEl).toBeChecked();
    });

    it('should be disabled when isDisabled prop sets true', async () => {
      const { rerender } = render(
        <Toggle {...baseProps} aria-label="input" isDisabled />
      );

      const inputEl = screen.getByLabelText('input');

      rerender(<Toggle {...baseProps} aria-label="input" isDisabled={false} />);

      expect(inputEl).not.toBeDisabled();
    });

    it('should be invalid when isInvalid prop sets true', async () => {
      const { rerender } = render(
        <Toggle {...baseProps} aria-label="input" isInvalid />
      );

      const inputEl = screen.getByLabelText('input');

      expect(inputEl).toHaveAttribute('aria-invalid', 'true');

      rerender(<Toggle {...baseProps} aria-label="input" isInvalid={false} />);

      expect(inputEl).not.toHaveAttribute('aria-invalid', 'true');
    });
  });
});
