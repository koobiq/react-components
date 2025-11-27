import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Form } from '../Form';
import { Checkbox, CheckboxGroup, type CheckboxGroupProps } from '../index';

const CHECKBOX__TEST_ID = 'CHECKBOX';

const baseProps: CheckboxGroupProps = {
  'aria-label': 'root',
};

const renderComponent = (props: Omit<CheckboxGroupProps, 'children'>) => (
  <CheckboxGroup {...baseProps} {...props}>
    <Checkbox value="1">1</Checkbox>
    <Checkbox value="2" data-testid={CHECKBOX__TEST_ID}>
      2
    </Checkbox>
    <Checkbox value="3">3</Checkbox>
    <Checkbox value="4">4</Checkbox>
  </CheckboxGroup>
);

describe('CheckboxGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getRoot = () => screen.getByLabelText('root');
  const getCheckbox = () => screen.getByTestId(CHECKBOX__TEST_ID);

  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<CheckboxGroup {...baseProps} ref={ref} />);
    const el = container.querySelector('div');
    expect(ref.current).toBe(el);
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    const { container } = render(
      renderComponent({
        style,
      })
    );

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle('padding: 20px');
  });

  it('should accept a custom class', () => {
    render(renderComponent({ className: 'foo' }));

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display a label', () => {
    render(renderComponent({ label: 'bar' }));

    expect(screen.getByText('bar')).toBeInTheDocument();
  });

  it('should display a caption', () => {
    render(renderComponent({ caption: 'qux' }));

    expect(screen.getByText('qux')).toBeInTheDocument();
  });

  it('should be invalid when isInvalid prop sets true', async () => {
    const { rerender } = render(renderComponent({ isInvalid: true }));

    expect(getRoot()).toHaveAttribute('data-invalid', 'true');

    rerender(renderComponent({ isInvalid: false }));

    expect(getRoot()).not.toHaveAttribute('data-invalid', 'true');
  });

  it('should be disabled when isDisabled prop sets true', async () => {
    const onChange = vi.fn();

    render(renderComponent({ isDisabled: true, onChange, value: ['1'] }));

    expect(getRoot()).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(screen.getByTestId(CHECKBOX__TEST_ID));

    expect(onChange).toBeCalledTimes(0);
  });

  it('should onChange get correct value', async () => {
    const onChange = vi.fn();

    render(
      renderComponent({
        onChange,
        value: ['1'],
      })
    );

    await userEvent.click(screen.getByTestId(CHECKBOX__TEST_ID));

    expect(onChange).toBeCalledWith(['1', '2']);
  });

  it('should apply a correct size to a group', () => {
    const { rerender } = render(renderComponent({ size: 'big' }));

    expect(getCheckbox()).toHaveAttribute('data-size', 'big');

    rerender(renderComponent({ size: 'normal' }));

    expect(getCheckbox()).toHaveAttribute('data-size', 'normal');
  });

  it('should apply an orientation to a group', () => {
    render(renderComponent({ orientation: 'horizontal' }));

    expect(getRoot()).toHaveAttribute('data-orientation', 'horizontal');
  });

  describe('form', () => {
    it('should pass name to input', () => {
      const { container } = render(
        renderComponent({
          name: 'numbers',
        })
      );

      const input = container.querySelectorAll('input[name="numbers"]')[0];

      expect(input).toBeInTheDocument();
    });

    it('should handle aria validation', () => {
      render(
        renderComponent({
          defaultValue: ['1'],
          validationBehavior: 'aria',
          validate: () => 'validation error',
        })
      );

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
      expect(getRoot()).toHaveTextContent('validation error');
    });

    it('should propagate Form isDisabled to fields unless overridden', async () => {
      const onChange = vi.fn();

      const { rerender } = render(
        <Form isDisabled>{renderComponent({ onChange })}</Form>
      );

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');

      await userEvent.click(screen.getByTestId(CHECKBOX__TEST_ID));

      expect(onChange).not.toBeCalled();

      rerender(
        <Form isDisabled>{renderComponent({ isDisabled: false })}</Form>
      );

      expect(getRoot()).not.toHaveAttribute('aria-disabled', 'true');
    });

    it('should propagate Form isReadOnly to fields unless overridden', async () => {
      const onChange = vi.fn();

      const { rerender } = render(
        <Form isReadOnly>{renderComponent({ onChange })}</Form>
      );

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');

      await userEvent.click(screen.getByTestId(CHECKBOX__TEST_ID));

      expect(onChange).not.toBeCalled();

      rerender(
        <Form isReadOnly>{renderComponent({ isReadOnly: false })}</Form>
      );

      expect(getRoot()).not.toHaveAttribute('data-readonly', 'true');
    });
  });
});
