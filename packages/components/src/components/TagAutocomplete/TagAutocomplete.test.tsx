import { useRef } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { useListData } from '../index';
import type { TagInputAddContext } from '../TagInput';

import { TagAutocomplete } from './index';

type TagItem = { id: string; name: string };

type HarnessProps = {
  initialTags?: TagItem[];
  suggestions?: TagItem[];
  isReadOnly?: boolean;
  allowsEmptyCollection?: boolean;
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
  onAdd?: (values: string[], ctx: TagInputAddContext<TagItem>) => void;
};

function Harness(props: HarnessProps) {
  const {
    initialTags = [],
    suggestions = [
      { id: 'react', name: 'React' },
      { id: 'typescript', name: 'TypeScript' },
      { id: 'storybook', name: 'Storybook' },
    ],
    isReadOnly,
    allowsEmptyCollection,
    defaultFilter,
    onAdd: userOnAdd,
  } = props;

  const tags = useListData<TagItem>({
    initialItems: initialTags,
    getKey: (item) => item.id,
  });

  const counter = useRef(0);

  const newTag = (name: string): TagItem => {
    counter.current += 1;

    return { id: `t-${counter.current}-${name}`, name };
  };

  return (
    <TagAutocomplete<TagItem>
      aria-label="Tags"
      slotProps={{ input: { 'data-testid': 'input' } }}
      items={tags.items}
      onAdd={(values, ctx) => {
        if (ctx.source === 'suggestion') {
          tags.append(ctx.suggestion);
        } else {
          tags.append(...values.map(newTag));
        }

        userOnAdd?.(values, ctx);
      }}
      onRemove={(keys) => tags.remove(...keys)}
      listItems={suggestions}
      isReadOnly={isReadOnly}
      allowsEmptyCollection={allowsEmptyCollection}
      renderListItem={(item) => (
        <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
          {item.name}
        </TagAutocomplete.ListItem>
      )}
      defaultFilter={defaultFilter}
    >
      {(item) => (
        <TagAutocomplete.Tag key={item.id} textValue={item.name}>
          {item.name}
        </TagAutocomplete.Tag>
      )}
    </TagAutocomplete>
  );
}

const getInput = () => screen.getByTestId<HTMLInputElement>('input');
const queryListbox = () => screen.queryByRole('listbox');

describe('TagAutocomplete', () => {
  it('does not render the popover until the input is focused', () => {
    render(<Harness />);
    expect(queryListbox()).toBeNull();
  });

  it('exposes combobox semantics while the popover is closed', () => {
    render(<Harness />);

    const input = getInput();

    expect(input).toHaveAttribute('role', 'combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).not.toHaveAttribute('aria-controls');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('autocorrect', 'off');
    expect(input).toHaveAttribute('spellcheck', 'false');
  });

  it('opens the popover on input focus', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(getInput());

    await waitFor(() => expect(queryListbox()).toBeInTheDocument());
  });

  it('does not open the popover when read-only input is focused', async () => {
    const user = userEvent.setup();
    render(<Harness isReadOnly />);

    await user.click(getInput());

    expect(getInput()).toHaveFocus();
    expect(queryListbox()).not.toBeInTheDocument();
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not open the popover from keyboard when read-only', async () => {
    const user = userEvent.setup();
    render(<Harness isReadOnly />);

    await user.click(getInput());
    await user.keyboard('{ArrowDown}');

    expect(queryListbox()).not.toBeInTheDocument();
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not render the popover when no suggestions are available', async () => {
    const user = userEvent.setup();
    render(<Harness suggestions={[]} />);

    await user.click(getInput());

    expect(queryListbox()).not.toBeInTheDocument();
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  it('allows rendering an empty popover when allowsEmptyCollection is true', async () => {
    const user = userEvent.setup();
    render(<Harness allowsEmptyCollection suggestions={[]} />);

    await user.click(getInput());

    await waitFor(() => expect(queryListbox()).toBeInTheDocument());
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders the provided suggestion items', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(getInput());

    expect(
      await screen.findByRole('option', { name: 'React' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', { name: 'TypeScript' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', { name: 'Storybook' })
    ).toBeInTheDocument();
  });

  it('excludes selected tags from the suggestions by key or textValue', async () => {
    const user = userEvent.setup();

    render(<Harness initialTags={[{ id: 'react', name: 'React' }]} />);

    await user.click(getInput());

    expect(
      await screen.findByRole('option', { name: 'TypeScript' })
    ).toBeInTheDocument();

    expect(screen.queryByRole('option', { name: 'React' })).toBeNull();
  });

  it('filters suggestions with defaultFilter', async () => {
    const user = userEvent.setup();

    render(
      <Harness
        defaultFilter={(textValue, inputValue) =>
          textValue.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
        }
      />
    );

    await user.click(getInput());
    await user.type(getInput(), 'type');

    expect(
      await screen.findByRole('option', { name: 'TypeScript' })
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByRole('option', { name: 'React' })).toBeNull()
    );
  });

  it('hides the popover when filtering leaves no suggestions', async () => {
    const user = userEvent.setup();

    render(
      <Harness
        defaultFilter={(textValue, inputValue) =>
          textValue.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
        }
      />
    );

    const input = getInput();

    await user.click(input);
    await waitFor(() => expect(queryListbox()).toBeInTheDocument());

    await user.type(input, 'missing');

    await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await user.clear(input);

    await waitFor(() => expect(queryListbox()).toBeInTheDocument());
  });

  it('closes the popover on Escape', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(getInput());
    await waitFor(() => expect(queryListbox()).toBeInTheDocument());

    await user.keyboard('{Escape}');

    await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
  });

  it('closes the popover when focus moves outside', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Harness />
        <button data-testid="outside">outside</button>
      </>
    );

    await user.click(getInput());
    await waitFor(() => expect(queryListbox()).toBeInTheDocument());

    await user.click(screen.getByTestId('outside'));

    await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
  });

  it('closes the popover when keyboard focus leaves the input', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Harness />
        <button data-testid="outside">outside</button>
      </>
    );

    await user.click(getInput());
    await waitFor(() => expect(queryListbox()).toBeInTheDocument());

    await user.tab();

    expect(screen.getByTestId('outside')).toHaveFocus();
    await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
  });

  it('closes the popover on click on a non-focusable element outside', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Harness />
        <div data-testid="bystander">bystander</div>
      </>
    );

    await user.click(getInput());
    await waitFor(() => expect(queryListbox()).toBeInTheDocument());

    await user.click(screen.getByTestId('bystander'));

    await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
  });

  it('does not close the popover when clicking back on the input', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(getInput());
    await waitFor(() => expect(queryListbox()).toBeInTheDocument());

    await user.click(getInput());

    expect(queryListbox()).toBeInTheDocument();
  });

  it('fires onAdd with source="suggestion" when a suggestion is clicked and keeps the popover open', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<Harness onAdd={onAdd} />);

    await user.click(getInput());
    const option = await screen.findByRole('option', { name: 'React' });
    await user.click(option);

    expect(onAdd).toHaveBeenCalledWith(
      ['React'],
      expect.objectContaining({
        source: 'suggestion',
        suggestion: { id: 'react', name: 'React' },
      })
    );

    expect(queryListbox()).toBeInTheDocument();
  });

  it('closes the popover on outside click AFTER an option was selected', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Harness />
        <div data-testid="bystander">bystander</div>
      </>
    );

    await user.click(getInput());
    await waitFor(() => expect(queryListbox()).toBeInTheDocument());

    const option = await screen.findByRole('option', { name: 'React' });
    await user.click(option);

    expect(queryListbox()).toBeInTheDocument();

    await user.click(screen.getByTestId('bystander'));

    await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
  });

  describe('keyboard navigation', () => {
    it('ArrowDown from a closed-collection state focuses the first option', async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<Harness onAdd={onAdd} />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard('{Escape}');
      await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());

      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());
      await user.keyboard('{Enter}');

      expect(getInput()).toHaveFocus();

      expect(onAdd).toHaveBeenCalledWith(
        ['React'],
        expect.objectContaining({
          source: 'suggestion',
          suggestion: { id: 'react', name: 'React' },
        })
      );
    });

    it('updates active descendant while DOM focus stays on the input', async () => {
      const user = userEvent.setup();
      render(<Harness />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard('{ArrowDown}');

      const input = getInput();
      const option = screen.getByRole('option', { name: 'React' });

      expect(input).toHaveFocus();

      expect(option).toHaveAttribute(
        'id',
        input.getAttribute('aria-activedescendant')
      );
    });

    it('walks ArrowDown across options and stops at the last', async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<Harness onAdd={onAdd} />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard(
        '{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}'
      );

      expect(onAdd).toHaveBeenCalledWith(
        ['Storybook'],
        expect.objectContaining({
          source: 'suggestion',
          suggestion: { id: 'storybook', name: 'Storybook' },
        })
      );
    });

    it('ArrowUp from nothing focuses the last option', async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<Harness onAdd={onAdd} />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard('{ArrowUp}{Enter}');

      expect(onAdd).toHaveBeenCalledWith(
        ['Storybook'],
        expect.objectContaining({
          source: 'suggestion',
          suggestion: { id: 'storybook', name: 'Storybook' },
        })
      );
    });

    it('ArrowUp from a closed-collection state focuses the last option', async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<Harness onAdd={onAdd} />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard('{Escape}');
      await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());

      await user.keyboard('{ArrowUp}');
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());
      await user.keyboard('{Enter}');

      expect(onAdd).toHaveBeenCalledWith(
        ['Storybook'],
        expect.objectContaining({
          source: 'suggestion',
          suggestion: { id: 'storybook', name: 'Storybook' },
        })
      );
    });

    it('Enter on a focused option keeps the popover open', async () => {
      const user = userEvent.setup();
      render(<Harness />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard('{ArrowDown}{Enter}');

      expect(queryListbox()).toBeInTheDocument();
    });

    it('clears option focus after keyboard selection while keeping list navigation available', async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<Harness onAdd={onAdd} />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard('{ArrowDown}{Enter}');

      expect(getInput()).toHaveFocus();
      expect(getInput()).not.toHaveAttribute('aria-activedescendant');

      expect(onAdd).toHaveBeenLastCalledWith(
        ['React'],
        expect.objectContaining({
          source: 'suggestion',
          suggestion: { id: 'react', name: 'React' },
        })
      );

      await user.keyboard('custom');
      await user.keyboard('{Enter}');

      expect(onAdd).toHaveBeenLastCalledWith(['custom'], { source: 'enter' });

      await user.keyboard('{ArrowDown}{Enter}');

      expect(onAdd).toHaveBeenLastCalledWith(
        ['TypeScript'],
        expect.objectContaining({
          source: 'suggestion',
          suggestion: { id: 'typescript', name: 'TypeScript' },
        })
      );
    });

    it('prevents boundary tag arrow keys from scrolling and closing the popover', async () => {
      const user = userEvent.setup();
      render(<Harness initialTags={[{ id: 'react', name: 'React' }]} />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard('{ArrowLeft}');

      const tag = screen
        .getByText('React')
        .closest<HTMLElement>('[role="row"]');

      expect(tag).not.toBeNull();
      await waitFor(() => expect(tag).toHaveFocus());

      expect(fireEvent.keyDown(tag as HTMLElement, { key: 'ArrowRight' })).toBe(
        false
      );

      expect(queryListbox()).toBeInTheDocument();

      expect(fireEvent.keyDown(tag as HTMLElement, { key: 'ArrowDown' })).toBe(
        false
      );

      expect(queryListbox()).toBeInTheDocument();
    });

    it('Enter without arrow-nav falls through to the existing tag-commit logic', async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<Harness onAdd={onAdd} />);

      await user.click(getInput());
      await user.type(getInput(), 'foo');
      await user.keyboard('{Enter}');

      expect(onAdd).toHaveBeenLastCalledWith(['foo'], { source: 'enter' });
    });

    it('ignores Enter while IME composition is active', async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<Harness onAdd={onAdd} />);

      await user.click(getInput());
      await user.type(getInput(), 'foo');

      fireEvent.keyDown(getInput(), {
        key: 'Enter',
        code: 'Enter',
        isComposing: true,
      });

      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  it('routes a clicked suggestion through onAdd and does not commit the typed text', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<Harness onAdd={onAdd} />);

    await user.click(getInput());
    await user.type(getInput(), 'foo');

    const option = await screen.findByRole('option', { name: 'React' });
    await user.click(option);

    expect(onAdd).toHaveBeenCalledTimes(1);

    expect(onAdd).toHaveBeenCalledWith(
      ['React'],
      expect.objectContaining({
        source: 'suggestion',
        suggestion: { id: 'react', name: 'React' },
      })
    );
  });
});
