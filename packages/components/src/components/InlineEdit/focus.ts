const tabStopSelector = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

const overlaySelector = [
  '[data-slot="inline-edit-panel"]',
  '[data-slot="popover"]',
  '[data-slot="dropdown"]',
  '[role="dialog"]',
  '[role="menu"]',
  '[role="listbox"]',
  '[role="tree"]',
  '[role="grid"]',
].join(',');

const isHidden = (element: HTMLElement) => {
  for (
    let current: HTMLElement | null = element;
    current;
    current = current.parentElement
  ) {
    const style = current.ownerDocument.defaultView?.getComputedStyle(current);

    if (
      current.hidden ||
      current.getAttribute('aria-hidden') === 'true' ||
      style?.display === 'none' ||
      style?.visibility === 'hidden' ||
      style?.visibility === 'collapse'
    ) {
      return true;
    }
  }

  return false;
};

const isTabStop = (element: HTMLElement) =>
  element.tabIndex >= 0 &&
  !element.matches(':disabled') &&
  !(element instanceof HTMLInputElement && element.type === 'hidden') &&
  !element.closest('[inert]') &&
  !isHidden(element);

export const getTabStops = (root: ParentNode) =>
  Array.from(root.querySelectorAll<HTMLElement>(tabStopSelector)).filter(
    isTabStop
  );

export const focusAdjacentTabStop = (host: HTMLElement, backwards: boolean) => {
  const document = host.ownerDocument;

  const candidates = getTabStops(document).filter((element) => {
    if (host.contains(element)) return false;

    const overlay = element.closest(overlaySelector);
    if (overlay && !overlay.contains(host)) return false;

    const position = host.compareDocumentPosition(element);

    const direction = backwards
      ? Node.DOCUMENT_POSITION_PRECEDING
      : Node.DOCUMENT_POSITION_FOLLOWING;

    return Boolean(position & direction);
  });

  if (backwards) candidates.reverse();

  for (const candidate of candidates) {
    candidate.focus();

    if (candidate.contains(document.activeElement)) return candidate;
  }

  return null;
};
