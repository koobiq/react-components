import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Radio, RadioGroup, type RadioProps } from '../index';

const RADIO__TEST_ID = 'RADIO';
const RADIO__CHILDREN = 'CONTENT';
const RADIO__VALUE = 'VALUE';

const baseProps: RadioProps = {
  'data-testid': RADIO__TEST_ID,
  children: RADIO__CHILDREN,
  value: RADIO__VALUE,
};

describe('Radio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getRadio = () => screen.getByTestId(RADIO__TEST_ID);

  it('should accept a ref', () => {
    const ref = createRef<HTMLLabelElement>();

    const { container } = render(
      <RadioGroup aria-label="root">
        <Radio {...baseProps} ref={ref} />
      </RadioGroup>
    );

    const el = container.querySelector('label');
    expect(ref.current).toBe(el);
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    render(
      <RadioGroup aria-label="root">
        <Radio {...baseProps} style={style} />
      </RadioGroup>
    );

    expect(getRadio()).toHaveStyle('padding: 20px');
  });

  it('should accept a custom class', () => {
    render(
      <RadioGroup aria-label="root">
        <Radio {...baseProps} className="foo" />
      </RadioGroup>
    );

    expect(getRadio()).toHaveClass('foo');
  });

  it('should display a content', () => {
    render(
      <RadioGroup aria-label="root">
        <Radio {...baseProps} />
      </RadioGroup>
    );

    expect(screen.getByText(RADIO__CHILDREN)).toBeInTheDocument();
  });

  it('should be disabled when isDisabled prop sets true', async () => {
    const onChange = vi.fn();

    const { container } = render(
      <RadioGroup aria-label="root" onChange={onChange}>
        <Radio {...baseProps} isDisabled />
      </RadioGroup>
    );

    const el = container.querySelector('input');

    expect(el).toBeDisabled();

    await userEvent.click(screen.getByTestId(RADIO__TEST_ID));

    expect(onChange).toBeCalledTimes(0);
  });

  it('should apply a correct size', () => {
    render(
      <RadioGroup aria-label="root" size="normal">
        <Radio {...baseProps} size="big" />
      </RadioGroup>
    );

    expect(getRadio()).toHaveAttribute('data-size', 'big');
  });
});
