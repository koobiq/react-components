import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

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
