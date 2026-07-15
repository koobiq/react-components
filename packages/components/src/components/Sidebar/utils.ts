export const normalizeSize = (value: number) => `${value}px`;

/**
 * Whether the event target is somewhere the user types, so a printable-character
 * shortcut must not steal the key.
 */
export const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
};
