import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Tag } from './index.js';
import { tagPropVariant } from './types.js';
import { matchTagVariantToIconButton } from './utils.js';

describe('Tag', () => {
  const baseProps = { 'data-testid': 'tag' };

  const getTag = () => screen.getByTestId<HTMLDivElement>('tag');
  const getRemoveButton = () => screen.getByRole('button', { name: 'Remove' });

  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Tag ref={ref}>Label</Tag>);
    expect(ref.current).toBe(container.firstElementChild);
  });

  it('should render the children content', () => {
    render(<Tag>Label</Tag>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('should render nothing inside the body when there is no icon, children or remove button', () => {
    const { container } = render(<Tag {...baseProps} />);
    const body = getTag().firstElementChild;
    expect(body?.childElementCount).toBe(0);
    expect(container.firstElementChild).toBe(getTag());
  });

  it('should render the icon when provided', () => {
    render(<Tag icon={<span data-testid="icon" />}>Label</Tag>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should accept a custom class', () => {
    render(<Tag {...baseProps} className="foo" />);
    expect(getTag()).toHaveClass('foo');
  });

  it('should set a custom style', () => {
    render(<Tag {...baseProps} style={{ padding: 20 }} />);
    expect(getTag()).toHaveStyle({ padding: '20px' });
  });

  it('should set data-variant to "theme-fade" by default', () => {
    render(<Tag {...baseProps} />);
    expect(getTag()).toHaveAttribute('data-variant', 'theme-fade');
  });

  it.each(tagPropVariant)('should set data-variant to "%s"', (variant) => {
    render(<Tag {...baseProps} variant={variant} />);
    expect(getTag()).toHaveAttribute('data-variant', variant);
  });

  it('should not set data-disabled by default', () => {
    render(<Tag {...baseProps} />);
    expect(getTag()).not.toHaveAttribute('data-disabled');
  });

  it('should set data-disabled when isDisabled is true', () => {
    render(<Tag {...baseProps} isDisabled />);
    expect(getTag()).toHaveAttribute('data-disabled', 'true');
  });

  it('should apply slotProps to the body, icon and content slots', () => {
    const { container } = render(
      <Tag
        icon={<span>icon</span>}
        slotProps={{
          body: { id: 'body' },
          icon: { id: 'icon' },
          content: { id: 'content' },
        }}
      >
        Label
      </Tag>
    );

    expect(container.querySelector('#body')).toBeInTheDocument();
    expect(container.querySelector('#icon')).toBeInTheDocument();
    expect(container.querySelector('#content')).toHaveTextContent('Label');
  });

  describe('remove button', () => {
    it('should not render a remove button by default', () => {
      render(<Tag>Label</Tag>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render a remove button when allowsRemoving is true', () => {
      render(<Tag allowsRemoving>Label</Tag>);
      expect(getRemoveButton()).toBeInTheDocument();
    });

    it('should call the onPress handler passed through slotProps.removeIcon when clicked', async () => {
      const onPress = vi.fn();

      render(
        <Tag allowsRemoving slotProps={{ removeIcon: { onPress } }}>
          Label
        </Tag>
      );

      await userEvent.click(getRemoveButton());

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should disable the remove button when isDisabled is true', async () => {
      const onPress = vi.fn();

      render(
        <Tag allowsRemoving isDisabled slotProps={{ removeIcon: { onPress } }}>
          Label
        </Tag>
      );

      const removeButton = getRemoveButton();

      expect(removeButton).toBeDisabled();

      await userEvent.click(removeButton);

      expect(onPress).not.toHaveBeenCalled();
    });

    it.each(Object.entries(matchTagVariantToIconButton))(
      'should map the "%s" tag variant to the "%s" remove button variant',
      async (tagVariant, iconButtonVariant) => {
        render(
          <Tag
            allowsRemoving
            variant={tagVariant as (typeof tagPropVariant)[number]}
          >
            Label
          </Tag>
        );

        expect(getRemoveButton()).toHaveAttribute(
          'data-variant',
          iconButtonVariant
        );
      }
    );
  });
});
