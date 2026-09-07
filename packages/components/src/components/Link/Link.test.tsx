import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Provider } from '../Provider';

import { Link } from './Link';

describe('Link', () => {
  const baseProps = {
    children: 'Link',
    'aria-label': 'link',
  };

  const getRoot = () => screen.getByLabelText('link');

  it('should accept the ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    const { container } = render(<Link {...baseProps} ref={ref} />);
    const anchorElement = container.querySelector('a');
    expect(ref.current).toBe(anchorElement);
  });

  it('should accept a custom class', () => {
    render(<Link {...baseProps} className="custom-class-name" />);

    expect(getRoot()).toHaveClass('custom-class-name');
  });

  it('should display the text', () => {
    render(<Link {...baseProps} />);

    expect(screen.getByText(baseProps.children)).toBeInTheDocument();
  });

  it('should be blocked when in a disabled state', async () => {
    const props = {
      ...baseProps,
      onPress: vi.fn(),
      href: '#',
      isDisabled: true,
    };

    render(<Link {...props} />);

    const link = getRoot();

    await userEvent.tab();

    expect(link).not.toHaveFocus();

    await userEvent.click(link);

    expect(props.onPress).toHaveBeenCalledTimes(0);
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  describe('button', () => {
    it('should accept the ref', () => {
      const ref = createRef<HTMLButtonElement>();

      const { container } = render(
        <Link {...baseProps} as="button" ref={ref} />
      );

      expect(ref.current).toBe(container.querySelector('button'));
    });

    it('should be like a button with as=button', async () => {
      const props = {
        ...baseProps,
        onPress: vi.fn(),
      };

      render(<Link {...props} as="button" />);
      const linkAsButton = getRoot();

      expect(linkAsButton.tagName).toBe('BUTTON');

      await userEvent.click(linkAsButton);

      expect(props.onPress).toHaveBeenCalledTimes(1);
    });

    it('should have button semantics instead of role=link', () => {
      render(<Link {...baseProps} as="button" />);

      expect(getRoot()).not.toHaveAttribute('role');
      expect(screen.getByRole('button', { name: 'link' })).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should keep the visual styles of the link', () => {
      const { rerender, container } = render(<Link {...baseProps} href="#" />);
      const linkClassName = container.querySelector('a')?.className;

      rerender(<Link {...baseProps} as="button" />);

      expect(container.querySelector('button')).toHaveClass(
        String(linkClassName)
      );
    });

    it('should not submit the enclosing form by default', async () => {
      const onSubmit = vi.fn((event) => event.preventDefault());

      render(
        <form onSubmit={onSubmit}>
          <Link {...baseProps} as="button" />
        </form>
      );

      expect(getRoot()).toHaveAttribute('type', 'button');

      await userEvent.click(getRoot());

      expect(onSubmit).toHaveBeenCalledTimes(0);
    });

    it('should submit the enclosing form with type=submit', async () => {
      const onSubmit = vi.fn((event) => event.preventDefault());

      render(
        <form onSubmit={onSubmit}>
          <Link {...baseProps} as="button" type="submit" />
        </form>
      );

      expect(getRoot()).toHaveAttribute('type', 'submit');

      await userEvent.click(getRoot());

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should forward button HTML props', () => {
      render(
        <>
          <form id="form-id" />
          <Link
            {...baseProps}
            as="button"
            form="form-id"
            name="action"
            value="save"
            formNoValidate
            formMethod="post"
            formTarget="_blank"
          />
        </>
      );

      const linkAsButton = getRoot();

      expect(linkAsButton).toHaveAttribute('form', 'form-id');
      expect(linkAsButton).toHaveAttribute('name', 'action');
      expect(linkAsButton).toHaveAttribute('value', 'save');
      expect(linkAsButton).toHaveAttribute('formnovalidate');
      expect(linkAsButton).toHaveAttribute('formmethod', 'post');
      expect(linkAsButton).toHaveAttribute('formtarget', '_blank');
    });

    it('should forward button ARIA props', () => {
      render(
        <Link
          {...baseProps}
          as="button"
          aria-expanded
          aria-pressed
          aria-haspopup="menu"
          aria-controls="panel-id"
        />
      );

      const linkAsButton = getRoot();

      expect(linkAsButton).toHaveAttribute('aria-expanded', 'true');
      expect(linkAsButton).toHaveAttribute('aria-pressed', 'true');
      expect(linkAsButton).toHaveAttribute('aria-haspopup', 'menu');
      expect(linkAsButton).toHaveAttribute('aria-controls', 'panel-id');
    });

    it('should be blocked, unfocused, non-clickable, and have correct accessibility attributes when in a disabled state', async () => {
      const props = {
        ...baseProps,
        onPress: vi.fn(),
        isDisabled: true,
      };

      render(<Link {...props} as="button" />);

      const linkAsButton = getRoot();

      await userEvent.tab();

      expect(linkAsButton).not.toHaveFocus();

      await userEvent.click(linkAsButton);

      expect(props.onPress).toHaveBeenCalledTimes(0);
      expect(linkAsButton).toBeDisabled();
      expect(linkAsButton).toHaveAttribute('data-disabled');
    });
  });

  it('check a client side routing', async () => {
    const onNavigate = vi.fn();

    render(
      <Provider
        router={{
          navigate: () => {
            onNavigate();
          },
        }}
      >
        <Link href="/" {...baseProps}>
          Link
        </Link>
      </Provider>
    );

    await userEvent.click(getRoot());

    expect(onNavigate).toBeCalled();
  });

  it('should call onMouseDown handler', async () => {
    const user = userEvent.setup();
    const handleMouseDown = vi.fn();

    render(<Link {...baseProps} as="button" onMouseDown={handleMouseDown} />);

    await user.pointer({ keys: '[MouseLeft]', target: getRoot() });

    expect(handleMouseDown).toHaveBeenCalledTimes(1);
  });
});
