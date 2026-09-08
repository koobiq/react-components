import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { TagGroup, Tag, type TagGroupProps } from './index';

const TAG_GROUP__TEST_ID = 'TAG_GROUP';

const renderComponent = (props: Omit<TagGroupProps<object>, 'children'>) => (
  <TagGroup {...props} aria-label="tag-group">
    <Tag key={1}>one</Tag>
    <Tag
      key={2}
      data-testid={TAG_GROUP__TEST_ID}
      className="bar"
      style={{ padding: 20 }}
    >
      two
    </Tag>
    <Tag key={3}>Three</Tag>
    <Tag key={4}>Four</Tag>
  </TagGroup>
);

describe('TagGroup', () => {
  it('should set className', () => {
    const className = 'foo';

    const { container } = render(
      renderComponent({
        className,
      })
    );

    expect(container.firstElementChild).toHaveClass(className);
  });

  it('should set custom style', () => {
    const style = { padding: 20 };

    const { container } = render(
      renderComponent({
        style,
      })
    );

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle({ padding: '20px' });
  });

  it('should accept a ref', () => {
    const ref = createRef<HTMLButtonElement>();

    const { container } = render(
      renderComponent({
        ref,
      })
    );

    const tagGroup = container.querySelector(`div`);
    expect(ref.current).toBe(tagGroup);
  });

  describe('check Tag', () => {
    const getTag = () => screen.getByTestId(TAG_GROUP__TEST_ID);

    it('should apply root slot props and preserve keyboard navigation', async () => {
      const ref = createRef<HTMLDivElement>();
      const onFocus = vi.fn();
      const user = userEvent.setup();

      const { unmount } = render(
        <TagGroup aria-label="tag-group">
          <Tag
            key="one"
            className="tag"
            slotProps={{
              root: { ref, onFocus, className: 'slot', style: { padding: 20 } },
            }}
          >
            one
          </Tag>
          <Tag key="two">two</Tag>
        </TagGroup>
      );

      const [first, second] = screen.getAllByRole('row');

      expect(ref.current).toBe(first);
      expect(first).toHaveClass('tag', 'slot');
      expect(first).toHaveStyle({ padding: '20px' });

      await user.tab();

      expect(first).toHaveFocus();
      expect(onFocus).toHaveBeenCalledTimes(1);

      await user.keyboard('{ArrowRight}');

      expect(second).toHaveFocus();

      unmount();

      expect(ref.current).toBeNull();
    });

    it('should set className', () => {
      render(renderComponent({}));

      expect(getTag()).toHaveClass('bar');
    });

    it('should set custom style', () => {
      render(renderComponent({}));

      expect(getTag()).toHaveStyle({ padding: '20px' });
    });

    it('should be disabled', () => {
      render(renderComponent({}));

      expect(getTag()).not.toHaveFocus();
    });
  });
});
