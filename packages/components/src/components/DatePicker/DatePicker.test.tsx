import { createRef } from 'react';

import type { CalendarDate } from '@internationalized/date';
import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { DatePicker, type DatePickerProps } from './index';

describe('DatePicker', () => {
  const baseProps: DatePickerProps<CalendarDate> = {
    'data-testid': 'root',
    label: 'label',
  };

  const getRoot = () => screen.getByTestId('root');

  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<DatePicker {...baseProps} ref={ref} />);
    const field = container.querySelector(`div[role="presentation"]`);

    expect(ref.current).toBe(field);
  });

  it('should merge a custom class name with the default ones', () => {
    render(<DatePicker {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display the label', () => {
    render(<DatePicker {...baseProps} />);

    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', async () => {
    const { container } = render(<DatePicker {...baseProps} isDisabled />);

    const elements = container.querySelectorAll('[contenteditable="false"]');
    expect(elements).toHaveLength(3);
  });

  it('should be disabled when isReadOnly is true', async () => {
    const { container } = render(<DatePicker {...baseProps} isReadOnly />);

    const elements = container.querySelectorAll('[contenteditable="false"]');
    expect(elements).toHaveLength(3);
  });

  it('should be required when isRequired is true', () => {
    render(<DatePicker {...baseProps} isRequired />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display a caption', () => {
    render(<DatePicker {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display an errorMessage', () => {
    render(<DatePicker {...baseProps} errorMessage="fail" isInvalid />);

    expect(getRoot()).toHaveTextContent('fail');
  });
});
