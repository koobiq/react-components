import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../Button';
import { Menu } from '../Menu';

import { SplitButton, splitButtonPropVariant } from './index.js';

describe('SplitButton', () => {
  const baseProps = { 'data-testid': 'root' };

  const getRoot = () => screen.getByTestId<HTMLDivElement>('root');

  const menu = (props: Record<string, unknown> = {}) => (
    <Menu
      data-testid="menu"
      control={(controlProps) => (
        <Button {...controlProps} aria-label="More options" />
      )}
      {...props}
    >
      <Menu.Item key="import">Import</Menu.Item>
    </Menu>
  );

  it('should receive a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <SplitButton {...baseProps} ref={ref}>
        <Button>Split Button</Button>
        {menu()}
      </SplitButton>
    );

    expect(ref.current).toBe(getRoot());
  });

  it('should render the component with the correct tag', () => {
    render(
      <SplitButton {...baseProps} as="section">
        <Button>Split Button</Button>
        {menu()}
      </SplitButton>
    );

    expect(getRoot().tagName).toBe('SECTION');
  });

  it('should apply a custom class name', () => {
    render(
      <SplitButton {...baseProps} className="custom">
        <Button>Split Button</Button>
        {menu()}
      </SplitButton>
    );

    expect(getRoot()).toHaveClass('custom');
  });

  describe('check the variant prop', () => {
    it("should default to the 'fade-contrast-filled' variant", () => {
      render(
        <SplitButton {...baseProps}>
          <Button>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      expect(getRoot()).toHaveAttribute('data-variant', 'fade-contrast-filled');

      screen.getAllByRole('button').forEach((button) => {
        expect(button).toHaveAttribute('data-variant', 'fade-contrast-filled');
      });
    });

    it.each(splitButtonPropVariant)(
      'should pass the "%s" variant to both nested buttons',
      (variant) => {
        render(
          <SplitButton {...baseProps} variant={variant}>
            <Button>Split Button</Button>
            {menu()}
          </SplitButton>
        );

        screen.getAllByRole('button').forEach((button) => {
          expect(button).toHaveAttribute('data-variant', variant);
        });
      }
    );
  });

  describe('check the isDisabled prop', () => {
    it('should be enabled by default', () => {
      render(
        <SplitButton {...baseProps}>
          <Button>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      expect(getRoot()).not.toHaveAttribute('data-disabled');
    });

    it('should disable both nested buttons', () => {
      render(
        <SplitButton {...baseProps} isDisabled>
          <Button>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');

      screen.getAllByRole('button').forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('should disable a single button while the split button stays enabled', () => {
      render(
        <SplitButton {...baseProps}>
          <Button>Split Button</Button>
          {menu({
            control: (controlProps: Record<string, unknown>) => (
              <Button {...controlProps} isDisabled aria-label="More options" />
            ),
          })}
        </SplitButton>
      );

      const [primary, trigger] = screen.getAllByRole('button');

      expect(primary).not.toBeDisabled();
      expect(trigger).toBeDisabled();
    });
  });

  describe('check the isLoading prop', () => {
    it('should not be in progress by default', () => {
      render(
        <SplitButton {...baseProps}>
          <Button>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      expect(getRoot()).not.toHaveAttribute('data-loading');

      screen.getAllByRole('button').forEach((button) => {
        expect(button).not.toHaveAttribute('data-loading');
      });
    });

    it('should show a loader on both the primary button and the menu trigger button', () => {
      render(
        <SplitButton {...baseProps} isLoading>
          <Button>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      expect(getRoot()).toHaveAttribute('data-loading', 'true');

      const [primary, trigger] = screen.getAllByRole('button');

      expect(primary).toHaveAttribute('data-loading', 'true');
      expect(primary).toHaveAttribute('aria-disabled', 'true');
      expect(trigger).toHaveAttribute('data-loading', 'true');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });

    it('should show a loader on a single button while the split button stays idle', () => {
      render(
        <SplitButton {...baseProps}>
          <Button isLoading>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      const [primary, trigger] = screen.getAllByRole('button');

      expect(primary).toHaveAttribute('data-loading', 'true');
      expect(trigger).not.toHaveAttribute('data-loading');
    });
  });
});
