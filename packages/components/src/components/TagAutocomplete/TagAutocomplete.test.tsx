import { useRef } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { useListData } from '../index';
import { TagInput } from '../TagInput';
import type { TagInputAddContext } from '../TagInput';

import { TagAutocomplete } from './index';

type TagItem = { id: string; name: string };

type HarnessProps = {
  initialTags?: TagItem[];
  suggestions?: TagItem[];
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
    <TagAutocomplete>
      <TagInput<TagItem>
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
      >
        {(item) => (
          <TagInput.Tag key={item.id} textValue={item.name}>
            {item.name}
          </TagInput.Tag>
        )}
      </TagInput>
      <TagAutocomplete.List<TagItem> items={suggestions}>
        {(item) => (
          <TagAutocomplete.Item key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.Item>
        )}
      </TagAutocomplete.List>
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
