export function clampEllipsisIndex(value: number, length: number) {
  if (length <= 1) return 0;

  return Math.max(0, Math.min(value, length - 1));
}

export function getSlotIndex(itemIndex: number, moreIndex: number) {
  return itemIndex < moreIndex ? itemIndex : itemIndex + 1;
}
