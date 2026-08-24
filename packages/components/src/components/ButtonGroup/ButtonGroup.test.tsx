import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Button } from '../Button';

import {
  ButtonGroup,
  buttonGroupPropOrientation,
  buttonGroupPropVariant,
} from './index.js';

describe('ButtonGroup', () => {
  const baseProps = { 'data-testid': 'button-group' };

  const getRoot = () => screen.getByTestId<HTMLDivElement>('button-group');

  it('should receive ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ButtonGroup {...baseProps} ref={ref} />);
    const group = container.querySelector('div');

    expect(ref.current).toBe(group);
  });

  it('should render the component with the correct tag', () => {
    render(<ButtonGroup {...baseProps} as="section" />);

    expect(getRoot().tagName).toBe('SECTION');
  });

  it('should apply a custom class name', () => {
    render(<ButtonGroup {...baseProps} className="custom" />);

    expect(getRoot()).toHaveClass('custom');
  });

  it('should apply custom styles', () => {
    render(<ButtonGroup {...baseProps} style={{ opacity: 0.5 }} />);

    expect(getRoot()).toHaveStyle({ opacity: '0.5' });
  });

  it('should render children', () => {
    render(
      <ButtonGroup {...baseProps}>
        <Button>Archive</Button>
        <Button>Delete</Button>
      </ButtonGroup>
    );

    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('should have the group role', () => {
    render(<ButtonGroup {...baseProps} />);

    expect(getRoot()).toHaveAttribute('role', 'group');
  });

  describe('check the orientation prop', () => {
    it('should default to the horizontal orientation', () => {
      render(<ButtonGroup {...baseProps} />);

      expect(getRoot()).toHaveAttribute('data-orientation', 'horizontal');
    });

    it.each(buttonGroupPropOrientation)(
      'should apply the orientation as a "%s"',
      (orientation) => {
        render(<ButtonGroup {...baseProps} orientation={orientation} />);

        expect(getRoot()).toHaveAttribute('data-orientation', orientation);
      }
    );
  });

  describe('check the variant prop', () => {
    it('should default to the fade-contrast-outline variant', () => {
      render(
        <ButtonGroup {...baseProps}>
          <Button>Archive</Button>
        </ButtonGroup>
      );

      expect(getRoot()).toHaveAttribute(
        'data-variant',
        'fade-contrast-outline'
      );

      expect(screen.getByRole('button')).toHaveAttribute(
        'data-variant',
        'fade-contrast-outline'
      );
    });

    it.each(buttonGroupPropVariant)(
      'should pass the "%s" variant to the nested buttons',
      (variant) => {
        render(
          <ButtonGroup {...baseProps} variant={variant}>
            <Button>Archive</Button>
          </ButtonGroup>
        );

        expect(getRoot()).toHaveAttribute('data-variant', variant);

        expect(screen.getByRole('button')).toHaveAttribute(
          'data-variant',
          variant
        );
      }
    );

    it("should override the button's own variant", () => {
      render(
        <ButtonGroup {...baseProps} variant="fade-contrast-outline">
          <Button>Archive</Button>
          <Button variant="contrast-filled">Delete</Button>
        </ButtonGroup>
      );

      screen.getAllByRole('button').forEach((button) => {
        expect(button).toHaveAttribute('data-variant', 'fade-contrast-outline');
      });
    });

    it('should not affect a button rendered outside of the group', () => {
      render(<Button>Archive</Button>);

      expect(screen.getByRole('button')).toHaveAttribute(
        'data-variant',
        'contrast-filled'
      );
    });
  });

  describe('check the isDisabled prop', () => {
    it('should be enabled by default', () => {
      render(
        <ButtonGroup {...baseProps}>
          <Button>Archive</Button>
        </ButtonGroup>
      );

      expect(getRoot()).not.toHaveAttribute('data-disabled');
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('should disable every nested button', () => {
      render(
        <ButtonGroup {...baseProps} isDisabled>
          <Button>Archive</Button>
          <Button>Delete</Button>
        </ButtonGroup>
      );

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');

      screen.getAllByRole('button').forEach((button) => {
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('data-disabled', 'true');
      });
    });

    it('should disable a single button while the group stays enabled', () => {
      render(
        <ButtonGroup {...baseProps}>
          <Button>Archive</Button>
          <Button isDisabled>Delete</Button>
        </ButtonGroup>
      );

      const [archive, remove] = screen.getAllByRole('button');

      expect(archive).not.toBeDisabled();
      expect(remove).toBeDisabled();
    });
  });

  describe('check the isLoading prop', () => {
    it('should not be in progress by default', () => {
      render(
        <ButtonGroup {...baseProps}>
          <Button>Archive</Button>
        </ButtonGroup>
      );

      expect(getRoot()).not.toHaveAttribute('data-loading');
      expect(screen.getByRole('button')).not.toHaveAttribute('data-loading');
    });

    it('should show a loader on every nested button', () => {
      render(
        <ButtonGroup {...baseProps} isLoading>
          <Button>Archive</Button>
          <Button>Delete</Button>
        </ButtonGroup>
      );

      expect(getRoot()).toHaveAttribute('data-loading', 'true');

      screen.getAllByRole('button').forEach((button) => {
        expect(button).toHaveAttribute('data-loading', 'true');
        expect(button).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('should show a loader on a single button while the group stays idle', () => {
      render(
        <ButtonGroup {...baseProps}>
          <Button>Archive</Button>
          <Button isLoading>Delete</Button>
        </ButtonGroup>
      );

      const [archive, remove] = screen.getAllByRole('button');

      expect(archive).not.toHaveAttribute('data-loading');
      expect(remove).toHaveAttribute('data-loading', 'true');
    });
  });
});
