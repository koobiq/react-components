import { createRef, useState } from 'react';

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

import { TagInput } from './TagInput';
import type { TagInputProps } from './types';

const baseProps: TagInputProps = {
  'data-testid': 'root',
  label: 'Tags',
  slotProps: {
    input: { 'data-testid': 'input' },
    clearButton: { 'aria-label': 'clear-button' },
  },
};

const getInput = () => screen.getByTestId('input') as HTMLInputElement;
const getClearButton = () => screen.queryByLabelText('clear-button');

const queryTag = (label: string): HTMLElement | null => {
  const node = screen.queryByText(label);

  return (node?.closest('[role="row"]') as HTMLElement | null) ?? null;
};

describe('TagInput', () => {
  it('should forward ref to the underlying input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TagInput {...baseProps} ref={ref} />);
    expect(ref.current).toBe(getInput());
  });

  it('should render the label', () => {
    render(<TagInput {...baseProps} />);
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('should render initial tags from defaultValue', () => {
    render(<TagInput {...baseProps} defaultValue={['one', 'two']} />);
    expect(queryTag('one')).toBeInTheDocument();
    expect(queryTag('two')).toBeInTheDocument();
  });

  it('should add a tag on Enter', async () => {
    const onChange = vi.fn();
    render(<TagInput {...baseProps} onChange={onChange} />);

    await userEvent.click(getInput());
    await userEvent.type(getInput(), 'react{Enter}');

    expect(onChange).toHaveBeenLastCalledWith(['react']);
    await waitFor(() => expect(queryTag('react')).toBeInTheDocument());
  });

  it('should add a tag on split character (comma by default)', async () => {
    const onChange = vi.fn();
    render(<TagInput {...baseProps} onChange={onChange} />);

    await userEvent.click(getInput());
    await userEvent.type(getInput(), 'react,');

    expect(onChange).toHaveBeenLastCalledWith(['react']);
    expect(getInput()).toHaveValue('');
  });

  it('should respect a custom splitPattern', async () => {
    const onChange = vi.fn();

    render(
      <TagInput {...baseProps} onChange={onChange} splitPattern={/[,;]/} />
    );

    await userEvent.click(getInput());
    await userEvent.type(getInput(), 'a;');
    expect(onChange).toHaveBeenLastCalledWith(['a']);

    await userEvent.type(getInput(), 'b,');
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
  });

  it('should trim whitespace from input before committing', async () => {
    const onChange = vi.fn();
    render(<TagInput {...baseProps} onChange={onChange} />);

    await userEvent.click(getInput());
    await userEvent.type(getInput(), '  spaced  {Enter}');

    expect(onChange).toHaveBeenLastCalledWith(['spaced']);
  });

  it('should commit input value on blur', async () => {
    const onChange = vi.fn();

    render(
      <>
        <TagInput {...baseProps} onChange={onChange} />
        <button data-testid="outside">outside</button>
      </>
    );

    await userEvent.click(getInput());
    await userEvent.type(getInput(), 'committed');
    await userEvent.click(screen.getByTestId('outside'));

    expect(onChange).toHaveBeenLastCalledWith(['committed']);
  });

  it('should split a pasted string into multiple tags', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput {...baseProps} onChange={onChange} />);

    await user.click(getInput());
    await user.paste('one, two, three');

    expect(onChange).toHaveBeenLastCalledWith(['one', 'two', 'three']);
    expect(queryTag('one')).toBeInTheDocument();
    expect(queryTag('two')).toBeInTheDocument();
    expect(queryTag('three')).toBeInTheDocument();
  });

  it('should not split a paste without separators', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput {...baseProps} onChange={onChange} />);

    await user.click(getInput());
    await user.paste('plain text');

    expect(onChange).not.toHaveBeenCalled();
    expect(getInput()).toHaveValue('plain text');
  });

  it('should remove a tag when its remove button is clicked', async () => {
    const onChange = vi.fn();

    render(
      <TagInput {...baseProps} onChange={onChange} defaultValue={['a', 'b']} />
    );

    const tagA = queryTag('a');
    expect(tagA).not.toBeNull();
    const removeButton = within(tagA as HTMLElement).getByRole('button');
    await userEvent.click(removeButton);

    expect(onChange).toHaveBeenLastCalledWith(['b']);
  });

  it('should focus the last tag on Backspace from empty input', async () => {
    const user = userEvent.setup();
    render(<TagInput {...baseProps} defaultValue={['one', 'two']} />);

    await user.click(getInput());
    await user.keyboard('{Backspace}');

    await waitFor(() => expect(queryTag('two')).toHaveFocus());
  });

  it('should focus the first tag on Shift+Tab from empty input', async () => {
    const user = userEvent.setup();
    render(<TagInput {...baseProps} defaultValue={['one', 'two']} />);

    await user.click(getInput());
    await user.keyboard('{Shift>}{Tab}{/Shift}');

    await waitFor(() => expect(queryTag('one')).toHaveFocus());
  });

  it('should focus the last tag on ArrowLeft from empty input', async () => {
    const user = userEvent.setup();
    render(<TagInput {...baseProps} defaultValue={['one', 'two']} />);

    await user.click(getInput());
    await user.keyboard('{ArrowLeft}');

    await waitFor(() => expect(queryTag('two')).toHaveFocus());
  });

  it('should select all tags on Ctrl+A from empty input', async () => {
    const user = userEvent.setup();
    render(<TagInput {...baseProps} defaultValue={['one', 'two']} />);

    await user.click(getInput());
    await user.keyboard('{Control>}a{/Control}');

    await waitFor(() => {
      expect(queryTag('one')).toHaveAttribute('aria-selected', 'true');
      expect(queryTag('two')).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('should delete a focused tag via Delete / Backspace', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TagInput
        {...baseProps}
        defaultValue={['one', 'two', 'three']}
        onChange={onChange}
      />
    );

    await user.click(queryTag('two') as HTMLElement);
    await user.keyboard('{Delete}');

    expect(onChange).toHaveBeenLastCalledWith(['one', 'three']);
    expect(queryTag('two')).not.toBeInTheDocument();
  });

  it('should remove all selected tags when Backspace is pressed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TagInput
        {...baseProps}
        defaultValue={['one', 'two', 'three']}
        onChange={onChange}
      />
    );

    await user.click(getInput());
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('should return focus to the input after the last tag is removed', async () => {
    const user = userEvent.setup();
    render(<TagInput {...baseProps} defaultValue={['only']} />);

    const removeButton = within(queryTag('only') as HTMLElement).getByRole(
      'button'
    );

    await user.click(removeButton);

    await waitFor(() => {
      expect(queryTag('only')).not.toBeInTheDocument();
      expect(getInput()).toHaveFocus();
    });
  });

  it('should focus the input when the canvas between tags is clicked', () => {
    const { container } = render(
      <TagInput {...baseProps} defaultValue={['one']} />
    );

    expect(getInput()).not.toHaveFocus();

    // Locate the flex-wrap canvas (role="presentation") and dispatch a
    // mousedown directly on it — that's the slice between tags / input.
    const canvas = container.querySelector(
      '[role="presentation"]'
    ) as HTMLElement;

    fireEvent.mouseDown(canvas);
    expect(getInput()).toHaveFocus();
  });

  it('should be controlled when value is provided', async () => {
    function Wrapper() {
      const [tags, setTags] = useState<string[]>(['initial']);

      return (
        <>
          <TagInput {...baseProps} value={tags} onChange={setTags} />
          <button onClick={() => setTags(['external'])}>swap</button>
        </>
      );
    }

    render(<Wrapper />);
    expect(queryTag('initial')).toBeInTheDocument();

    await userEvent.click(screen.getByText('swap'));

    await waitFor(() => {
      expect(queryTag('external')).toBeInTheDocument();
      expect(queryTag('initial')).not.toBeInTheDocument();
    });
  });

  it('should not update tag list when controlled parent ignores onChange', async () => {
    const onChange = vi.fn();
    render(<TagInput {...baseProps} value={['locked']} onChange={onChange} />);

    await userEvent.click(getInput());
    await userEvent.type(getInput(), 'attempt{Enter}');

    expect(onChange).toHaveBeenLastCalledWith(['locked', 'attempt']);
    // Parent never propagated → list still shows only 'locked'.
    expect(queryTag('locked')).toBeInTheDocument();
    expect(queryTag('attempt')).not.toBeInTheDocument();
  });

  it('should fire onInputChange on every keystroke', async () => {
    const onInputChange = vi.fn();
    render(<TagInput {...baseProps} onInputChange={onInputChange} />);

    await userEvent.click(getInput());
    await userEvent.type(getInput(), 'ab');

    expect(onInputChange).toHaveBeenCalledWith('a');
    expect(onInputChange).toHaveBeenCalledWith('ab');
  });

  it('should not allow typing when disabled', async () => {
    const onChange = vi.fn();
    render(<TagInput {...baseProps} onChange={onChange} isDisabled />);

    expect(getInput()).toBeDisabled();
    await userEvent.type(getInput(), 'x{Enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should mark every tag as disabled when the field is disabled', () => {
    render(
      <TagInput {...baseProps} defaultValue={['one', 'two']} isDisabled />
    );

    [queryTag('one'), queryTag('two')].forEach((tag) => {
      expect(tag).toHaveAttribute('data-disabled', 'true');
      // Remove button stays visible but disabled (see TagList behavior).
      const removeBtn = within(tag as HTMLElement).getByRole('button');
      expect(removeBtn).toBeDisabled();
    });
  });

  it('should render tags in the error variant when invalid', () => {
    render(
      <TagInput
        {...baseProps}
        defaultValue={['one', 'two']}
        isInvalid
        errorMessage="Invalid"
      />
    );

    [queryTag('one'), queryTag('two')].forEach((tag) => {
      expect(tag).toHaveAttribute('data-variant', 'error-fade');
    });
  });

  it('should not allow modification when read-only', async () => {
    const onChange = vi.fn();

    render(
      <TagInput
        {...baseProps}
        onChange={onChange}
        defaultValue={['a']}
        isReadOnly
      />
    );

    await userEvent.click(getInput());
    await userEvent.type(getInput(), 'b{Enter}');
    expect(onChange).not.toHaveBeenCalled();
    expect(queryTag('a')).toBeInTheDocument();
  });

  it('should disable tag selection in read-only but keep focus navigation', async () => {
    const user = userEvent.setup();

    render(
      <TagInput {...baseProps} defaultValue={['one', 'two']} isReadOnly />
    );

    // Selection is off — Space on a focused tag must not toggle aria-selected.
    const firstTag = queryTag('one') as HTMLElement;
    await user.click(firstTag);
    await user.keyboard('{Space}');
    expect(firstTag).not.toHaveAttribute('aria-selected', 'true');

    // Ctrl+A from a focused tag must not select all either.
    await user.keyboard('{Control>}a{/Control}');
    expect(queryTag('one')).not.toHaveAttribute('aria-selected', 'true');
    expect(queryTag('two')).not.toHaveAttribute('aria-selected', 'true');

    // Focus navigation between tags still works.
    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(queryTag('two')).toHaveFocus());
  });

  it('should display an error message when isInvalid', () => {
    render(<TagInput {...baseProps} isInvalid errorMessage="Required" />);

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('should display a caption', () => {
    render(<TagInput {...baseProps} caption="Helper" />);
    expect(screen.getByText('Helper')).toBeInTheDocument();
  });

  it('should inherit isDisabled from a parent Form', () => {
    render(
      <Form isDisabled>
        <TagInput {...baseProps} />
      </Form>
    );

    expect(getInput()).toBeDisabled();
  });

  describe('Cleaner', () => {
    it('should not render when isClearable is false', () => {
      render(<TagInput {...baseProps} defaultValue={['a']} />);
      expect(getClearButton()).toBeNull();
    });

    it('should be hidden when there are no tags and no input value', () => {
      render(<TagInput {...baseProps} isClearable />);
      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');
    });

    it('should be visible when there are tags', () => {
      render(<TagInput {...baseProps} defaultValue={['a']} isClearable />);
      expect(getClearButton()).not.toHaveAttribute('aria-hidden', 'true');
    });

    it('should clear tags and input and refocus when pressed', async () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(
        <TagInput
          {...baseProps}
          isClearable
          defaultValue={['a', 'b']}
          onChange={onChange}
          onClear={onClear}
        />
      );

      const clearBtn = getClearButton();
      expect(clearBtn).not.toBeNull();
      await userEvent.click(clearBtn as HTMLElement);

      await waitFor(() => {
        expect(queryTag('a')).not.toBeInTheDocument();
        expect(queryTag('b')).not.toBeInTheDocument();
      });

      expect(onChange).toHaveBeenLastCalledWith([]);
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(getInput()).toHaveFocus();
    });

    it('should be hidden when disabled even with tags', () => {
      render(
        <TagInput {...baseProps} defaultValue={['a']} isClearable isDisabled />
      );

      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
