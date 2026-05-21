'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
//
// DRAFT — work in progress.
//
// Not exported from `@koobiq/react-components`. Lives here as the seed for
// a future stable `TagInput` component. The goal of this file is to
// demonstrate how the `TagListInner` render-layer is composed with an
// `<Input>` via lifted `useListState`:
//
//   - the parent owns the items collection (`useListData` here, but a
//     consumer can pass plain `useState<string[]>` or a controlled value)
//   - the parent creates the React-Aria `state` via `useListState`, so
//     `state.selectionManager.setFocusedKey(...)` is available for
//     programmatic focus moves (Backspace from empty input → focus last
//     tag) without DOM queries
//   - tag removal flows through `onRemove`; tag creation through input
//     keydown handlers (Enter / `,` / `;`) and (in a future iteration)
//     paste with split
//
// API and UX details (controlled vs uncontrolled value, paste splitting,
// distinct, blur-commit, validation hooks) will be finalised when this
// graduates to a real component with stories, tests, and MDX.
//

import { useRef, useState, type KeyboardEvent } from 'react';

import type { Key } from '@koobiq/react-core';
import { useListData, useListState } from '@koobiq/react-primitives';

import { Input } from '../Input';
import { Tag } from '../TagList/Tag';
import { TagListInner } from '../TagList/TagListInner';

export interface TagInputProps {
  /** Initial tags (uncontrolled mode). */
  defaultValue?: string[];
  /** Notified whenever the set of committed tags changes. */
  onChange?: (next: string[]) => void;
  /**
   * Characters (besides Enter) that commit the current input value as a
   * new tag.
   * @default /[,;]/
   */
  splitPattern?: RegExp;
  /** Placeholder for the text input. */
  placeholder?: string;
  /** Accessibility label, applied to both the input and the tag list. */
  'aria-label'?: string;
  /** Whether the whole control is disabled. */
  isDisabled?: boolean;
  /** Whether the control is read-only (tags shown, can't add or remove). */
  isReadOnly?: boolean;
}

interface TagInputItem {
  id: string;
  value: string;
}

const makeItem = (value: string): TagInputItem => ({ id: value, value });

export function TagInput(props: TagInputProps) {
  const {
    defaultValue = [],
    onChange,
    splitPattern = /[,;]/,
    placeholder,
    'aria-label': ariaLabel,
    isDisabled,
    isReadOnly,
  } = props;

  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const list = useListData<TagInputItem>({
    initialItems: defaultValue.map(makeItem),
    getKey: (item) => item.id,
  });

  // Lifted React-Aria state. The parent (this component) gets direct
  // access to `state.selectionManager`, so we can drive focus from outside
  // the tag list without DOM queries.
  const state = useListState<TagInputItem>({
    items: list.items,
    children: (item) => <Tag key={item.id}>{item.value}</Tag>,
    selectionMode: 'multiple',
  });

  const commit = () => onChange?.(list.items.map((i) => i.value));

  const addTags = (raw: string) => {
    if (isDisabled || isReadOnly) return;
    const existing = new Set(list.items.map((i) => i.value));
    const candidates = raw
      .split(splitPattern)
      .map((s) => s.trim())
      .filter((s) => s && !existing.has(s));
    if (candidates.length === 0) {
      setInputValue('');
      return;
    }
    candidates.forEach((value) => list.append(makeItem(value)));
    setInputValue('');
    commit();
  };

  const removeKeys = (keys: Set<Key>) => {
    if (isDisabled || isReadOnly) return;
    list.remove(...keys);
    commit();
  };

  const focusLastTag = () => {
    const lastKey = state.collection.getLastKey();
    if (lastKey == null) return;
    state.selectionManager.setFocused(true);
    state.selectionManager.setFocusedKey(lastKey);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled || isReadOnly) return;

    // Enter / configured separator characters commit the current input.
    if (event.key === 'Enter' || splitPattern.test(event.key)) {
      if (inputValue.trim()) {
        event.preventDefault();
        addTags(inputValue);
      }
      return;
    }

    // Backspace / ArrowLeft at the very start of an empty input moves focus
    // to the last tag — typed-safe via lifted state, no querySelector hack.
    const { selectionStart, selectionEnd } = event.currentTarget;
    if (
      (event.key === 'Backspace' || event.key === 'ArrowLeft') &&
      selectionStart === 0 &&
      selectionEnd === 0 &&
      !inputValue
    ) {
      event.preventDefault();
      focusLastTag();
    }
  };

  return (
    <>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={setInputValue}
        placeholder={placeholder}
        aria-label={ariaLabel}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        slotProps={{ input: { onKeyDown: handleInputKeyDown } }}
        fullWidth
      />
      <TagListInner<TagInputItem>
        state={state}
        onRemove={isReadOnly ? undefined : removeKeys}
        aria-label={ariaLabel ?? 'Selected tags'}
      />
    </>
  );
}
