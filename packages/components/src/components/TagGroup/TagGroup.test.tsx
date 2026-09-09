import { createRef, useState, type ComponentPropsWithRef } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Provider } from '../Provider';

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

const removableItems = [
  { id: '1', name: 'one' },
  { id: '2', name: 'two' },
  { id: '3', name: 'three' },
];

function RemovableTagGroup({ disabledKeys }: { disabledKeys?: string[] }) {
  const [items, setItems] = useState(removableItems);

  return (
    <TagGroup<(typeof removableItems)[number]>
      aria-label="removable-tag-group"
      items={items}
      disabledKeys={disabledKeys}
      onRemove={(keys) =>
        setItems((current) => current.filter((item) => !keys.has(item.id)))
      }
    >
      {(item) => (
        <Tag key={item.id} data-testid={`tag-${item.id}`}>
          {item.name}
        </Tag>
      )}
    </TagGroup>
  );
}

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

      render(
        <TagGroup aria-label="tag-group">
          <Tag
            key="one"
            className="tag"
            slotProps={{
              root: { ref, onFocus, className: 'slot' },
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

      // Roving tabindex: `Tab` lands on the grid, and React Aria hands DOM
      // focus to the row in a later commit.
      await user.tab();

      await waitFor(() => expect(first).toHaveFocus());
      expect(onFocus).toHaveBeenCalled();

      await user.keyboard('{ArrowRight}');

      await waitFor(() => expect(second).toHaveFocus());
    });

    it('should let root slot props win over the tag style', () => {
      render(
        <TagGroup aria-label="tag-group">
          <Tag
            key="one"
            style={{ padding: 10 }}
            slotProps={{ root: { style: { padding: 20 } } }}
          >
            one
          </Tag>
        </TagGroup>
      );

      // `mergeProps` replaces `style` wholesale, so the slot — the more
      // specific escape hatch — has to be the one that survives.
      expect(screen.getByRole('row')).toHaveStyle({ padding: '20px' });
    });

    it('should keep the computed state attributes authoritative', () => {
      // A consumer must not be able to desync the visual state from the real
      // one: `data-*` is applied after `slotProps.root`.
      const root = {
        'data-hovered': 'true',
        'data-focus-visible': 'true',
      } as ComponentPropsWithRef<'div'>;

      render(
        <TagGroup aria-label="tag-group">
          <Tag key="one" slotProps={{ root }}>
            one
          </Tag>
        </TagGroup>
      );

      const tag = screen.getByRole('row');

      expect(tag).not.toHaveAttribute('data-hovered');
      expect(tag).not.toHaveAttribute('data-focus-visible');
    });

    it('should apply the icon and content slot props', () => {
      render(
        <TagGroup aria-label="tag-group">
          <Tag
            key="one"
            icon={<span data-testid="icon" />}
            slotProps={{
              icon: { className: 'icon-slot' },
              content: { className: 'content-slot' },
            }}
          >
            one
          </Tag>
        </TagGroup>
      );

      const tag = screen.getByRole('row');

      expect(tag.querySelector('.icon-slot')).toBeInTheDocument();
      expect(tag.querySelector('.content-slot')).toHaveTextContent('one');
    });

    it('should set className', () => {
      render(renderComponent({}));

      expect(getTag()).toHaveClass('bar');
    });

    it('should set custom style', () => {
      render(renderComponent({}));

      expect(getTag()).toHaveStyle({ padding: '20px' });
    });

    it('should be disabled', async () => {
      const user = userEvent.setup();

      render(renderComponent({ disabledKeys: ['2'] }));

      const tag = getTag();

      expect(tag).toHaveAttribute('aria-disabled', 'true');
      expect(tag).toHaveAttribute('data-disabled');

      await user.click(tag);

      expect(tag).not.toHaveFocus();
    });
  });

  describe('removable tags', () => {
    it('should render a remove button for every tag', () => {
      render(<RemovableTagGroup />);

      expect(screen.getAllByRole('button')).toHaveLength(removableItems.length);
    });

    it('should remove the pressed tag', async () => {
      const user = userEvent.setup();

      render(<RemovableTagGroup />);

      await user.click(within(screen.getByTestId('tag-2')).getByRole('button'));

      await waitFor(() => expect(screen.queryByTestId('tag-2')).toBeNull());
      expect(screen.getAllByRole('row')).toHaveLength(2);
    });

    it('should keep the remove button out of the tab order', () => {
      render(<RemovableTagGroup />);

      for (const button of screen.getAllByRole('button')) {
        expect(button).toHaveAttribute('tabindex', '-1');
      }
    });

    it('should localize the remove button aria-label (en-US by default)', () => {
      const { container } = render(<RemovableTagGroup />);

      expect(
        container.querySelectorAll('button[aria-label="Remove"]')
      ).toHaveLength(removableItems.length);
    });

    it('should localize the remove button aria-label under ru-RU locale', () => {
      const { container } = render(
        <Provider locale="ru-RU">
          <RemovableTagGroup />
        </Provider>
      );

      expect(
        container.querySelectorAll('button[aria-label="Удалить"]')
      ).toHaveLength(removableItems.length);
    });

    it('should render a disabled remove button on a disabled tag', async () => {
      const user = userEvent.setup();

      render(<RemovableTagGroup disabledKeys={['2']} />);

      const button = within(screen.getByTestId('tag-2')).getByRole('button');

      expect(button).toBeDisabled();

      await user.click(button);

      expect(screen.getByTestId('tag-2')).toBeInTheDocument();
    });

    it('should let the removeIcon slot props replace the default glyph', () => {
      render(
        <TagGroup aria-label="tag-group" onRemove={() => undefined}>
          <Tag
            key="one"
            slotProps={{
              removeIcon: {
                className: 'remove-slot',
                children: <span data-testid="custom-glyph" />,
              },
            }}
          >
            one
          </Tag>
        </TagGroup>
      );

      const button = screen.getByRole('button');

      expect(button).toHaveClass('remove-slot');
      expect(within(button).getByTestId('custom-glyph')).toBeInTheDocument();
    });
  });
});
