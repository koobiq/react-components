import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Radio, RadioGroup, type RadioGroupProps } from '../index';

const RADIO__TEST_ID = 'RADIO';

const baseProps: RadioGroupProps = {
  'aria-label': 'root',
};

const renderComponent = (props: Omit<RadioGroupProps, 'children'>) => (
  <RadioGroup {...baseProps} {...props}>
    <Radio value="1">1</Radio>
    <Radio value="2" data-testid={RADIO__TEST_ID}>
      2
    </Radio>
    <Radio value="3">3</Radio>
    <Radio value="4">4</Radio>
  </RadioGroup>
);

describe('RadioGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getRoot = () => screen.getByRole('radiogroup');
  const getRadio = () => screen.getByTestId(RADIO__TEST_ID);

  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<RadioGroup {...baseProps} ref={ref} />);
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

  it('should display a description', () => {
    render(renderComponent({ description: 'qux' }));

    expect(screen.getByText('qux')).toBeInTheDocument();
  });

  it('should be invalid when isInvalid prop sets true', async () => {
    const { rerender } = render(renderComponent({ isInvalid: true }));

    expect(getRoot()).toHaveAttribute('aria-invalid', 'true');

    rerender(renderComponent({ isInvalid: false }));

    expect(getRoot()).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('should be disabled when isDisabled prop sets true', async () => {
    const onChange = vi.fn();

    render(renderComponent({ isDisabled: true, onChange, value: '1' }));

    expect(getRoot()).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(screen.getByTestId(RADIO__TEST_ID));

    expect(onChange).toBeCalledTimes(0);
  });

  it('should onChange get correct value', async () => {
    const onChange = vi.fn();

    render(
      renderComponent({
        onChange,
        value: '1',
      })
    );

    await userEvent.click(screen.getByTestId(RADIO__TEST_ID));

    expect(onChange).toBeCalledWith('2');
  });

  it('should apply a correct size to a group', () => {
    const { rerender } = render(renderComponent({ size: 'big' }));

    expect(getRadio()).toHaveAttribute('data-size', 'big');

    rerender(renderComponent({ size: 'normal' }));

    expect(getRadio()).toHaveAttribute('data-size', 'normal');
  });

  it('should apply an orientation to a group', () => {
    render(renderComponent({ orientation: 'horizontal' }));

    expect(getRoot()).toHaveAttribute('aria-orientation', 'horizontal');
  });
});
