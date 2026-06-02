import { useRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { useListData } from '../index';
import { TagInput } from '../TagInput';

import { TagAutocomplete } from './index';

type TagItem = { id: string; name: string };

type HarnessProps = {
  initialTags?: TagItem[];
  suggestions?: TagItem[];
  onAdd?: (values: string[], ctx: { source: string }) => void;
  onSelect?: (item: TagItem) => void;
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
    onSelect: userOnSelect,
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
      onSelect={(item) => {
        tags.append(newTag(item.name));
        userOnSelect?.(item);
      }}
    >
      <TagInput<TagItem>
        aria-label="Tags"
        slotProps={{ input: { 'data-testid': 'input' } }}
        items={tags.items}
        onAdd={(values, ctx) => {
          tags.append(...values.map(newTag));
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

  it('fires onSelect when a suggestion is clicked and keeps the popover open', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);

    await user.click(getInput());
    const option = await screen.findByRole('option', { name: 'React' });
    await user.click(option);

    expect(onSelect).toHaveBeenCalledWith({ id: 'react', name: 'React' });
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
      const onSelect = vi.fn();
      render(<Harness onSelect={onSelect} />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard('{ArrowDown}{Enter}');

      expect(getInput()).toHaveFocus();
      expect(onSelect).toHaveBeenCalledWith({ id: 'react', name: 'React' });
    });

    it('walks ArrowDown across options and stops at the last', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Harness onSelect={onSelect} />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard(
        '{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}'
      );

      expect(onSelect).toHaveBeenCalledWith({
        id: 'storybook',
        name: 'Storybook',
      });
    });

    it('ArrowUp from nothing focuses the last option', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Harness onSelect={onSelect} />);

      await user.click(getInput());
      await waitFor(() => expect(queryListbox()).toBeInTheDocument());

      await user.keyboard('{ArrowUp}{Enter}');

      expect(onSelect).toHaveBeenCalledWith({
        id: 'storybook',
        name: 'Storybook',
      });
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
      const onSelect = vi.fn();
      render(<Harness onAdd={onAdd} onSelect={onSelect} />);

      await user.click(getInput());
      await user.type(getInput(), 'foo');
      await user.keyboard('{Enter}');

      expect(onSelect).not.toHaveBeenCalled();
      expect(onAdd).toHaveBeenLastCalledWith(['foo'], { source: 'enter' });
    });
  });

  it('does not commit typed text as a tag when a suggestion is clicked', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onSelect = vi.fn();
    render(<Harness onAdd={onAdd} onSelect={onSelect} />);

    await user.click(getInput());
    await user.type(getInput(), 'foo');

    const option = await screen.findByRole('option', { name: 'React' });
    await user.click(option);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onAdd).not.toHaveBeenCalled();
  });
});
