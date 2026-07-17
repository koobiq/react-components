import { isNumber } from '@koobiq/react-core';

import type { SidebarPropKeyboardShortcut, SidebarPropSize } from './types';

export const normalizeSize = (value: SidebarPropSize) =>
  isNumber(value) ? `${value}px` : value;

export const matchesKeyboardShortcut = (
  event: KeyboardEvent,
  shortcut: SidebarPropKeyboardShortcut
) =>
  event.code === shortcut.code &&
  event.altKey === Boolean(shortcut.altKey) &&
  event.ctrlKey === Boolean(shortcut.ctrlKey) &&
  event.metaKey === Boolean(shortcut.metaKey) &&
  event.shiftKey === Boolean(shortcut.shiftKey);

/**
 * Whether the event target is somewhere the user types, so a printable-character
 * shortcut must not steal the key.
 */
export const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
};
