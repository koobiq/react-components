import { createRef, useRef, useState } from 'react';

import type { Key, Selection } from '@koobiq/react-core';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Form } from '../Form';
import { useListData } from '../index';

import { TagInput } from './TagInput';
import type { TagInputProps } from './types';

type TagItem = { id: string; name: string };

type WrapperProps = Partial<TagInputProps<TagItem>> & {
  initialItems?: TagItem[];
};

function Wrapper(props: WrapperProps) {
  const {
    initialItems = [],
    onAdd: userOnAdd,
    onRemove: userOnRemove,
    ...rest
  } = props;

  const list = useListData<TagItem>({
    initialItems,
    getKey: (item) => item.id,
  });

  const counter = useRef(0);

  const newTag = (name: string): TagItem => {
    counter.current += 1;

    return { id: `t-${counter.current}-${name}`, name };
  };

  return (
    <TagInput<TagItem>
      data-testid="root"
      label="Tags"
      slotProps={{
        input: { 'data-testid': 'input' },
        clearButton: { 'aria-label': 'clear-button' },
      }}
      items={list.items}
      {...rest}
      onAdd={(values, ctx) => {
        list.append(...values.map(newTag));
        userOnAdd?.(values, ctx);
      }}
      onRemove={(keys) => {
        list.remove(...keys);
        userOnRemove?.(keys);
      }}
    >
      {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
    </TagInput>
  );
}

const getInput = () => screen.getByTestId('input') as HTMLInputElement;
const getClearButton = () => screen.queryByLabelText('clear-button');

const queryTag = (label: string): HTMLElement | null => {
  const node = screen.queryByText(label);

  return (node?.closest('[role="row"]') as HTMLElement | null) ?? null;
};

const seed = (names: string[]): TagItem[] =>
  names.map((name, i) => ({ id: `seed-${i}-${name}`, name }));

describe('TagInput', () => {
  it('should forward ref to the underlying input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Wrapper ref={ref} />);
    expect(ref.current).toBe(getInput());
  });

  it('should render the label', () => {
    render(<Wrapper />);
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('should render initial tags from items', () => {
    render(<Wrapper initialItems={seed(['one', 'two'])} />);
    expect(queryTag('one')).toBeInTheDocument();
    expect(queryTag('two')).toBeInTheDocument();
  });

  describe('onAdd', () => {
    it("fires with source='enter' on Enter", async () => {
      const onAdd = vi.fn();
      render(<Wrapper onAdd={onAdd} />);

      await userEvent.click(getInput());
      await userEvent.type(getInput(), 'react{Enter}');

      expect(onAdd).toHaveBeenLastCalledWith(['react'], { source: 'enter' });
    });

    it("fires with source='separator' on a split character", async () => {
      const onAdd = vi.fn();
      render(<Wrapper onAdd={onAdd} />);

      await userEvent.click(getInput());
      await userEvent.type(getInput(), 'react,');

      expect(onAdd).toHaveBeenLastCalledWith(['react'], {
        source: 'separator',
      });

      expect(getInput()).toHaveValue('');
    });

    it("fires with source='paste' on a delimited paste", async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<Wrapper onAdd={onAdd} />);

      await user.click(getInput());
      await user.paste('one, two, three');

      expect(onAdd).toHaveBeenLastCalledWith(['one', 'two', 'three'], {
        source: 'paste',
      });
    });

    it('replaces the selected input value before splitting pasted tags', async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<Wrapper onAdd={onAdd} />);

      await user.click(getInput());
      await user.type(getInput(), 'draft');
      getInput().select();
      await user.paste('one, two');

      expect(onAdd).toHaveBeenLastCalledWith(['one', 'two'], {
        source: 'paste',
      });

      expect(getInput()).toHaveValue('');
    });

    it("fires with source='blur' on focus loss with non-empty input", async () => {
      const onAdd = vi.fn();

      render(
        <>
          <Wrapper onAdd={onAdd} />
          <button data-testid="outside">outside</button>
        </>
      );

      await userEvent.click(getInput());
      await userEvent.type(getInput(), 'committed');
      await userEvent.click(screen.getByTestId('outside'));

      expect(onAdd).toHaveBeenLastCalledWith(['committed'], {
        source: 'blur',
      });
    });

    it('does not commit on blur when disableCommitOnBlur is set', async () => {
      const onAdd = vi.fn();

      render(
        <>
          <Wrapper onAdd={onAdd} disableCommitOnBlur />
          <button data-testid="outside">outside</button>
        </>
      );

      await userEvent.click(getInput());
      await userEvent.type(getInput(), 'pending');
      await userEvent.click(screen.getByTestId('outside'));

      expect(onAdd).not.toHaveBeenCalled();
      expect(getInput()).toHaveValue('pending');
    });

    it('respects a custom splitPattern', async () => {
      const onAdd = vi.fn();
      render(<Wrapper onAdd={onAdd} splitPattern={/[,;]/} />);

      await userEvent.click(getInput());
      await userEvent.type(getInput(), 'a;');
      expect(onAdd).toHaveBeenLastCalledWith(['a'], { source: 'separator' });
    });

    it('trims whitespace before committing', async () => {
      const onAdd = vi.fn();
      render(<Wrapper onAdd={onAdd} />);

      await userEvent.click(getInput());
      await userEvent.type(getInput(), '  spaced  {Enter}');

      expect(onAdd).toHaveBeenLastCalledWith(['spaced'], { source: 'enter' });
    });

    it('does not split a paste without separators', async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<Wrapper onAdd={onAdd} />);

      await user.click(getInput());
      await user.paste('plain text');

      expect(onAdd).not.toHaveBeenCalled();
      expect(getInput()).toHaveValue('plain text');
    });

    it('does not clear committed input when onAdd is not provided', async () => {
      render(
        <TagInput<TagItem>
          aria-label="Tags"
          items={[]}
          slotProps={{ input: { 'data-testid': 'input' } }}
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
      );

      await userEvent.click(getInput());
      await userEvent.type(getInput(), 'react{Enter}');

      expect(getInput()).toHaveValue('react');
    });

    it('does not intercept a delimited paste when onAdd is not provided', async () => {
      const user = userEvent.setup();

      render(
        <TagInput<TagItem>
          aria-label="Tags"
          items={[]}
          slotProps={{ input: { 'data-testid': 'input' } }}
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
      );

      await user.click(getInput());
      await user.paste('one, two');

      expect(getInput()).toHaveValue('one, two');
    });

    it('keeps focus in the input (no focus ring on the new tag) after Enter', async () => {
      render(<Wrapper />);

      await userEvent.click(getInput());
      await userEvent.type(getInput(), 'react{Enter}');

      await waitFor(() => expect(queryTag('react')).toBeInTheDocument());
      expect(queryTag('react')).not.toHaveAttribute('data-focus-visible');
      expect(getInput()).toHaveFocus();
    });
  });

  describe('onRemove', () => {
    it('fires with the clicked tag key', async () => {
      const onRemove = vi.fn();
      render(<Wrapper initialItems={seed(['a', 'b'])} onRemove={onRemove} />);

      const tagA = queryTag('a');
      const button = within(tagA as HTMLElement).getByRole('button');
      await userEvent.click(button);

      const lastCall = onRemove.mock.lastCall as [Set<Key>] | undefined;
      expect(lastCall?.[0].has('seed-0-a')).toBe(true);

      await waitFor(() => {
        expect(queryTag('a')).not.toBeInTheDocument();
        expect(getInput()).toHaveFocus();
      });
    });

    it('removes a focused tag via Delete', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();

      render(
        <Wrapper
          initialItems={seed(['one', 'two', 'three'])}
          onRemove={onRemove}
        />
      );

      await user.click(getInput());
      await user.keyboard('{Backspace}');
      await user.keyboard('{ArrowLeft}');
      await waitFor(() => expect(queryTag('two')).toHaveFocus());
      await user.keyboard('{Delete}');

      const lastCall = onRemove.mock.lastCall as [Set<Key>] | undefined;
      expect(lastCall?.[0].has('seed-1-two')).toBe(true);
      await waitFor(() => expect(queryTag('two')).not.toBeInTheDocument());
    });

    it('removes all selected tags via Ctrl+A → Backspace from input', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();

      render(
        <Wrapper
          initialItems={seed(['one', 'two', 'three'])}
          onRemove={onRemove}
        />
      );

      await user.click(getInput());
      await user.keyboard('{Control>}a{/Control}');
      await user.keyboard('{Backspace}');

      const lastCall = onRemove.mock.lastCall as [Set<Key>] | undefined;
      expect(lastCall?.[0].size).toBe(3);
    });

    it('returns focus to the input after the last tag is removed', async () => {
      const user = userEvent.setup();
      render(<Wrapper initialItems={seed(['only'])} />);

      const button = within(queryTag('only') as HTMLElement).getByRole(
        'button'
      );

      await user.click(button);

      await waitFor(() => {
        expect(queryTag('only')).not.toBeInTheDocument();
        expect(getInput()).toHaveFocus();
      });
    });
  });

  describe('duplicate values', () => {
    it('does not collide keys: removing one duplicate keeps the other', async () => {
      const user = userEvent.setup();

      // Two tags with the same NAME but distinct ids (consumer-owned).
      const initialItems: TagItem[] = [
        { id: 'a1', name: 'foo' },
        { id: 'a2', name: 'foo' },
      ];

      render(<Wrapper initialItems={initialItems} />);

      // Two role=row elements present.
      expect(screen.getAllByRole('row')).toHaveLength(2);

      // Click × on the FIRST "foo".
      const firstRow = screen.getAllByRole('row')[0] as HTMLElement;
      const firstRemove = within(firstRow).getByRole('button');
      await user.click(firstRemove);

      // One "foo" remains, the second one with id 'a2'.
      await waitFor(() => {
        expect(screen.getAllByRole('row')).toHaveLength(1);
        expect(screen.getByRole('row')).toHaveAttribute('data-key', 'a2');
      });
    });

    it('arrow keys navigate across duplicates', async () => {
      const user = userEvent.setup();

      const initialItems: TagItem[] = [
        { id: 'a1', name: 'foo' },
        { id: 'a2', name: 'foo' },
      ];

      render(<Wrapper initialItems={initialItems} />);

      await user.click(getInput());
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      await waitFor(() => expect(screen.getAllByRole('row')[0]).toHaveFocus());
      await user.keyboard('{ArrowRight}');
      const rows = screen.getAllByRole('row') as HTMLElement[];
      await waitFor(() => expect(rows[1]).toHaveFocus());
    });
  });

  describe('focus navigation', () => {
    it('focuses the last tag on Backspace from empty input', async () => {
      const user = userEvent.setup();
      render(<Wrapper initialItems={seed(['one', 'two'])} />);

      await user.click(getInput());
      await user.keyboard('{Backspace}');

      await waitFor(() => expect(queryTag('two')).toHaveFocus());
    });

    it('focuses the last tag on ArrowLeft from empty input', async () => {
      const user = userEvent.setup();
      render(<Wrapper initialItems={seed(['one', 'two'])} />);

      await user.click(getInput());
      await user.keyboard('{ArrowLeft}');

      await waitFor(() => expect(queryTag('two')).toHaveFocus());
    });

    it('focuses the first tag on Shift+Tab from empty input', async () => {
      const user = userEvent.setup();
      render(<Wrapper initialItems={seed(['one', 'two'])} />);

      await user.click(getInput());
      await user.keyboard('{Shift>}{Tab}{/Shift}');

      await waitFor(() => expect(queryTag('one')).toHaveFocus());
    });

    it('focuses the input when the canvas between tags is clicked', () => {
      const { container } = render(<Wrapper initialItems={seed(['one'])} />);
      expect(getInput()).not.toHaveFocus();

      const canvas = container.querySelector(
        '[role="presentation"]'
      ) as HTMLElement;

      fireEvent.mouseDown(canvas);
      expect(getInput()).toHaveFocus();
    });

    it('keeps focus in the input when a tag is clicked', async () => {
      const user = userEvent.setup();
      render(<Wrapper initialItems={seed(['one'])} />);

      await user.click(getInput());
      await user.click(queryTag('one') as HTMLElement);

      expect(getInput()).toHaveFocus();
      expect(queryTag('one')).not.toHaveFocus();
    });

    it('returns to the input when tabbing back into the field after a tag was focused', async () => {
      const user = userEvent.setup();

      render(
        <>
          <button data-testid="before">before</button>
          <Wrapper initialItems={seed(['one', 'two'])} />
        </>
      );

      await user.click(getInput());
      await user.keyboard('{Backspace}');
      await waitFor(() => expect(queryTag('two')).toHaveFocus());

      await user.click(screen.getByTestId('before'));
      await user.tab();

      expect(getInput()).toHaveFocus();
    });
  });

  describe('selection', () => {
    it('selects all tags on Ctrl+A from empty input', async () => {
      const user = userEvent.setup();
      render(<Wrapper initialItems={seed(['one', 'two'])} />);

      await user.click(getInput());
      await user.keyboard('{Control>}a{/Control}');

      await waitFor(() => {
        expect(queryTag('one')).toHaveAttribute('aria-selected', 'true');
        expect(queryTag('two')).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('passes through controlled selectedKeys and emits onSelectionChange', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      function Controlled() {
        const [selected, setSelected] = useState<Selection>(new Set<Key>());

        return (
          <Wrapper
            initialItems={seed(['one', 'two'])}
            selectedKeys={selected}
            onSelectionChange={(keys) => {
              setSelected(keys);
              onSelectionChange(keys);
            }}
          />
        );
      }

      render(<Controlled />);

      await user.click(getInput());
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      await waitFor(() => expect(queryTag('one')).toHaveFocus());
      await user.keyboard('{Space}');

      expect(onSelectionChange).toHaveBeenCalled();
    });
  });

  describe('disabled / read-only', () => {
    it('does not allow typing when disabled', async () => {
      const onAdd = vi.fn();
      render(<Wrapper onAdd={onAdd} isDisabled />);

      expect(getInput()).toBeDisabled();
      await userEvent.type(getInput(), 'x{Enter}');
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('marks every tag as disabled when the field is disabled', () => {
      render(<Wrapper initialItems={seed(['one', 'two'])} isDisabled />);

      [queryTag('one'), queryTag('two')].forEach((tag) => {
        expect(tag).toHaveAttribute('data-disabled', 'true');
        const removeBtn = within(tag as HTMLElement).getByRole('button');
        expect(removeBtn).toBeDisabled();
      });
    });

    it('disables tags rendered as a static JSX list', () => {
      render(
        <TagInput<TagItem>
          aria-label="Static"
          onAdd={() => undefined}
          onRemove={() => undefined}
          isDisabled
        >
          <TagInput.Tag key="r">React</TagInput.Tag>
          <TagInput.Tag key="t">TypeScript</TagInput.Tag>
        </TagInput>
      );

      [queryTag('React'), queryTag('TypeScript')].forEach((tag) => {
        expect(tag).toHaveAttribute('data-disabled', 'true');
      });
    });

    it('does not consume iterable items while disabling the whole field', () => {
      function* items() {
        yield { id: 'r', name: 'React' };
        yield { id: 't', name: 'TypeScript' };
      }

      render(
        <TagInput<TagItem>
          aria-label="Generated"
          items={items()}
          onAdd={() => undefined}
          onRemove={() => undefined}
          isDisabled
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
      );

      [queryTag('React'), queryTag('TypeScript')].forEach((tag) => {
        expect(tag).toBeInTheDocument();
        expect(tag).toHaveAttribute('data-disabled', 'true');
      });
    });

    it('does not allow modification when read-only', async () => {
      const onAdd = vi.fn();
      const onRemove = vi.fn();

      render(
        <Wrapper
          initialItems={seed(['a'])}
          onAdd={onAdd}
          onRemove={onRemove}
          isReadOnly
        />
      );

      await userEvent.click(getInput());
      await userEvent.type(getInput(), 'b{Enter}');
      expect(onAdd).not.toHaveBeenCalled();
      expect(queryTag('a')).toBeInTheDocument();
    });

    it('disables tag selection in read-only but keeps focus navigation', async () => {
      const user = userEvent.setup();
      render(<Wrapper initialItems={seed(['one', 'two'])} isReadOnly />);

      const firstTag = queryTag('one') as HTMLElement;
      await user.click(getInput());
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      await waitFor(() => expect(firstTag).toHaveFocus());
      await user.keyboard('{Space}');
      expect(firstTag).not.toHaveAttribute('aria-selected', 'true');

      await user.keyboard('{ArrowRight}');
      await waitFor(() => expect(queryTag('two')).toHaveFocus());
    });

    it('marks every tag as disabled via consumer disabledKeys', () => {
      const initialItems = seed(['one', 'two']);

      render(
        <Wrapper
          initialItems={initialItems}
          disabledKeys={initialItems.map((item) => item.id)}
        />
      );

      [queryTag('one'), queryTag('two')].forEach((tag) => {
        expect(tag).toHaveAttribute('data-disabled', 'true');
        const removeBtn = within(tag as HTMLElement).getByRole('button');
        expect(removeBtn).toBeDisabled();
      });
    });

    it('renders tags in the error variant when invalid', () => {
      render(
        <Wrapper
          initialItems={seed(['one', 'two'])}
          isInvalid
          errorMessage="Invalid"
        />
      );

      [queryTag('one'), queryTag('two')].forEach((tag) => {
        expect(tag).toHaveAttribute('data-variant', 'error-fade');
      });
    });

    it('displays an error message when isInvalid', () => {
      render(<Wrapper isInvalid errorMessage="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('displays a caption', () => {
      render(<Wrapper caption="Helper" />);
      expect(screen.getByText('Helper')).toBeInTheDocument();
    });

    it('inherits isDisabled from a parent Form', () => {
      render(
        <Form isDisabled>
          <Wrapper />
        </Form>
      );

      expect(getInput()).toBeDisabled();
    });
  });

  describe('onInputChange', () => {
    it('fires on every keystroke', async () => {
      const onInputChange = vi.fn();
      render(<Wrapper onInputChange={onInputChange} />);

      await userEvent.click(getInput());
      await userEvent.type(getInput(), 'ab');

      expect(onInputChange).toHaveBeenCalledWith('a');
      expect(onInputChange).toHaveBeenCalledWith('ab');
    });
  });

  describe('Cleaner', () => {
    it('does not render when isClearable is false', () => {
      render(<Wrapper initialItems={seed(['a'])} />);
      expect(getClearButton()).toBeNull();
    });

    it('is hidden when there are no tags and no input value', () => {
      render(<Wrapper isClearable />);
      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');
    });

    it('is visible when there are tags', () => {
      render(<Wrapper initialItems={seed(['a'])} isClearable />);
      expect(getClearButton()).not.toHaveAttribute('aria-hidden', 'true');
    });

    it('auto-emits onRemove(allKeys) + onClear + refocus on press', async () => {
      const onRemove = vi.fn();
      const onClear = vi.fn();

      render(
        <Wrapper
          initialItems={seed(['a', 'b'])}
          isClearable
          onRemove={onRemove}
          onClear={onClear}
        />
      );

      const clearBtn = getClearButton();
      await userEvent.click(clearBtn as HTMLElement);

      const lastCall = onRemove.mock.lastCall as [Set<Key>] | undefined;
      expect(lastCall?.[0].size).toBe(2);
      expect(onClear).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(queryTag('a')).not.toBeInTheDocument();
        expect(queryTag('b')).not.toBeInTheDocument();
      });

      expect(getInput()).toHaveFocus();
    });

    it('is hidden when disabled even with tags', () => {
      render(<Wrapper initialItems={seed(['a'])} isClearable isDisabled />);
      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
