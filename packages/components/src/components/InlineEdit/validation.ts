const isWithin = (
  rect: DOMRect,
  container: { top: number; left: number; bottom: number; right: number }
) =>
  rect.top >= container.top &&
  rect.left >= container.left &&
  rect.bottom <= container.bottom &&
  rect.right <= container.right;

export const isElementFullyVisible = (element: HTMLElement) => {
  const window = element.ownerDocument.defaultView;
  if (!window) return true;

  const rect = element.getBoundingClientRect();

  if (
    !isWithin(rect, {
      top: 0,
      left: 0,
      bottom: window.innerHeight,
      right: window.innerWidth,
    })
  ) {
    return false;
  }

  for (
    let parent = element.parentElement;
    parent && parent !== element.ownerDocument.body;
    parent = parent.parentElement
  ) {
    const style = window.getComputedStyle(parent);
    const clipsX = /(auto|scroll|hidden|clip)/.test(style.overflowX);
    const clipsY = /(auto|scroll|hidden|clip)/.test(style.overflowY);

    if ((clipsX || clipsY) && !isWithin(rect, parent.getBoundingClientRect())) {
      return false;
    }
  }

  return true;
};
