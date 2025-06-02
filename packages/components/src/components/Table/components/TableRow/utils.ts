export function getBackground(
  isSelected: boolean,
  isPressed: boolean,
  index: number
) {
  if (isSelected) {
    return 'blueviolet';
  }

  if (isPressed) {
    return 'var(--spectrum-global-color-gray-400)';
  }

  if (index % 2) {
    return 'var(--spectrum-alias-highlight-hover)';
  }

  return 'none';
}
