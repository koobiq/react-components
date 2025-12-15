import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Form } from '../Form';

import { Textarea, type TextareaProps } from './index';

describe('Textarea', () => {
  const baseProps: TextareaProps = {
    'data-testid': 'root',
    label: 'label',
    slotProps: {
      textarea: {
        'data-testid': 'textarea',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');
  const getTextarea = () => screen.getByTestId('textarea');

  it('should accept a ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(<Textarea {...baseProps} ref={ref} />);
    const field = container.querySelector(`textarea`);
    expect(ref.current).toBe(field);
  });

  it('should merge a custom class name with the default ones', () => {
    render(<Textarea {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should display the label', () => {
    render(<Textarea {...baseProps} />);

    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    render(<Textarea {...baseProps} style={style} />);

    expect(getRoot()).toHaveStyle({ padding: '20px' });
  });

  it('should be disabled when isDisabled is true', async () => {
    const handleChange = vi.fn();
    render(<Textarea {...baseProps} onChange={handleChange} isDisabled />);

    expect(getTextarea()).toBeDisabled();

    await userEvent.type(getTextarea(), 'hello');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should be required when isRequired is true', () => {
    render(<Textarea {...baseProps} isRequired />);

    expect(getTextarea()).toBeRequired();
  });

  it('should display a caption', () => {
    render(<Textarea {...baseProps} caption="helper" />);

    expect(getRoot()).toHaveTextContent('helper');
  });

  it('should display an errorMessage', () => {
    render(<Textarea {...baseProps} errorMessage="fail" isInvalid />);

    expect(getRoot()).toHaveTextContent('fail');
  });

  describe('value', () => {
    it(`should set the defaultValue correctly`, () => {
      render(<Textarea {...baseProps} defaultValue="value" />);

      expect(getTextarea()).toHaveValue('value');
    });

    it(`should call the onChange when changing the text field`, async () => {
      const handleChange = vi.fn((obj) => obj);
      render(<Textarea {...baseProps} onChange={handleChange} />);

      await userEvent.type(getTextarea(), 'hello');

      expect(handleChange).toHaveBeenCalledTimes(5);

      expect(handleChange.mock.results[4]?.value).toStrictEqual('hello');

      expect(getTextarea()).toHaveValue('hello');
    });

    it('should NOT call onChange when when isReadOnly is true', async () => {
      const handleChange = vi.fn();
      render(<Textarea {...baseProps} onChange={handleChange} isReadOnly />);

      const textarea = getTextarea();

      await userEvent.type(textarea, 'hello');

      expect(handleChange).not.toHaveBeenCalled();
      expect(textarea).toHaveValue('');
    });
  });

  describe('check data-attributes', () => {
    it('check the variant prop', () => {
      render(<Textarea {...baseProps} variant="transparent" />);

      expect(getRoot()).toHaveAttribute('data-variant', 'transparent');
    });

    it('check the fullWidth prop', () => {
      render(<Textarea {...baseProps} fullWidth />);

      expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');
    });

    it('check the isDisabled prop', () => {
      render(<Textarea {...baseProps} isDisabled />);

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    });

    it('check the isRequired prop', () => {
      render(<Textarea {...baseProps} isRequired />);

      expect(getRoot()).toHaveAttribute('data-required', 'true');
    });

    it('check the isInvalid prop', () => {
      render(<Textarea {...baseProps} isInvalid />);

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
    });

    it('check the isReadOnly prop', () => {
      render(<Textarea {...baseProps} isReadOnly />);

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');
    });
  });

  describe('form', () => {
    it('should pass name to textarea', () => {
      render(<Textarea {...baseProps} name="info" aria-label="info" />);
      expect(getTextarea()).toHaveAttribute('name', 'info');
    });

    it('should handle aria validation', () => {
      render(
        <Textarea
          {...baseProps}
          name="info"
          aria-label="info"
          validationBehavior="aria"
          validate={() => 'validation error'}
        />
      );

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
      expect(getRoot()).toHaveTextContent('validation error');
    });

    it('should propagate Form isDisabled to fields unless overridden', () => {
      const { rerender } = render(
        <Form isDisabled>
          <Textarea {...baseProps} />
        </Form>
      );

      expect(getTextarea()).toBeDisabled();

      rerender(
        <Form isDisabled>
          <Textarea {...baseProps} isDisabled={false} />
        </Form>
      );

      expect(getTextarea()).not.toBeDisabled();
    });

    it('should propagate Form isReadOnly to fields unless overridden', () => {
      const { rerender } = render(
        <Form isReadOnly>
          <Textarea {...baseProps} />
        </Form>
      );

      expect(getRoot()).toHaveAttribute('data-readonly', 'true');

      rerender(
        <Form isReadOnly>
          <Textarea {...baseProps} isReadOnly={false} />
        </Form>
      );

      expect(getRoot()).not.toHaveAttribute('data-readonly', 'true');
    });
  });
});
