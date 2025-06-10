import { createRef } from 'react';

import { useBoolean } from '@koobiq/react-core';
import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import {
  Checkbox,
  checkboxPropLabelPlacement,
  type CheckboxPropOnChange,
  type CheckboxProps,
  checkboxPropSize,
} from './index';

const ControlledCheckbox = ({
  isSelected: isSelectedProp,
  onChange: onChangeProp,
  ...restProps
}: Omit<CheckboxProps, 'children'>) => {
  const [isSelected, { set }] = useBoolean(isSelectedProp);

  const onChange: CheckboxPropOnChange = (value) => {
    onChangeProp?.(value);
    set(value);
  };

  return (
    <Checkbox
      aria-label="input"
      data-testid="root"
      isSelected={isSelected}
      onChange={onChange}
      {...restProps}
    />
  );
};

describe('Checkbox', () => {
  const baseProps = {
    'data-testid': 'root',
  };

  const getRoot = () => screen.getByTestId('root');

  describe('business logic', () => {
    it('should accept the ref', () => {
      const ref = createRef<HTMLLabelElement>();
      const { container } = render(<Checkbox {...baseProps} ref={ref} />);
      const labelElement = container.querySelector('label');
      expect(ref.current).toBe(labelElement);
    });

    it('should accept a custom class', () => {
      render(<Checkbox {...baseProps} className="foo" />);

      expect(getRoot()).toHaveClass('foo');
    });

    it('should set custom style', () => {
      const style = { padding: 20 };

      const { container } = render(<Checkbox style={style} />);

      const firstElement = container.firstChild;

      expect(firstElement).toHaveStyle('padding: 20px');
    });

    describe('check the size prop', () => {
      it.each(checkboxPropSize)('should apply the size as a "%s"', (size) => {
        render(<Checkbox {...baseProps} size={size} />);

        expect(getRoot()).toHaveAttribute('data-size', size);
      });
    });

    describe('check the labelPlacement prop', () => {
      it.each(checkboxPropLabelPlacement)(
        'should apply the labelPlacement as a "%s"',
        (labelPlacement) => {
          render(<Checkbox {...baseProps} labelPlacement={labelPlacement} />);

          expect(getRoot()).toHaveAttribute(
            'data-label-placement',
            labelPlacement
          );
        }
      );
    });

    it('should render the Checkbox label text', async () => {
      render(<Checkbox>label</Checkbox>);
      expect(screen.getByText('label')).toBeInTheDocument();
    });

    it('should display the text', () => {
      render(<Checkbox {...baseProps}>foo</Checkbox>);

      expect(screen.getByText('foo')).toBeInTheDocument();
    });

    it('should update checked state on click in uncontrolled mode', async () => {
      render(<Checkbox {...baseProps} aria-label="input" />);

      const inputEl = screen.getByLabelText('input');
      await userEvent.click(getRoot());
      expect(inputEl).toBeChecked();
    });

    it('should update checked state on click in controlled mode', async () => {
      const onChange = vi.fn();

      render(<ControlledCheckbox onChange={onChange} />);

      const inputEl = screen.getByLabelText('input');
      expect(inputEl).not.toBeChecked();

      await userEvent.click(getRoot());
      expect(inputEl).toBeChecked();

      expect(onChange).toBeCalledWith(true);
    });

    it('should render as checked when defaultSelected is true (uncontrolled mode)', async () => {
      render(<Checkbox {...baseProps} defaultSelected aria-label="input" />);

      const inputEl = screen.getByLabelText('input');
      expect(inputEl).toBeChecked();
    });

    it('should be disabled when isDisabled prop sets true', async () => {
      const { rerender } = render(
        <Checkbox {...baseProps} aria-label="input" isDisabled />
      );

      const inputEl = screen.getByLabelText('input');

      rerender(
        <Checkbox {...baseProps} aria-label="input" isDisabled={false} />
      );

      expect(inputEl).not.toBeDisabled();
    });

    it('should be indeterminate when isIndeterminate prop sets true', async () => {
      const { rerender } = render(<Checkbox {...baseProps} isIndeterminate />);

      expect(getRoot()).toHaveAttribute('data-indeterminate', 'true');

      rerender(<Checkbox {...baseProps} isIndeterminate={false} />);

      expect(getRoot()).not.toHaveAttribute('data-indeterminate', 'true');
    });

    it('should be invalid when isInvalid prop sets true', async () => {
      const { rerender } = render(
        <Checkbox {...baseProps} aria-label="input" isInvalid />
      );

      const inputEl = screen.getByLabelText('input');

      expect(inputEl).toHaveAttribute('aria-invalid', 'true');

      rerender(
        <Checkbox {...baseProps} aria-label="input" isIndeterminate={false} />
      );

      expect(inputEl).not.toHaveAttribute('aria-invalid', 'true');
    });
  });
});
