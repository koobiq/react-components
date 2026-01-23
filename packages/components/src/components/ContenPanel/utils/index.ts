export function getInlineSize(el: HTMLElement | null) {
  if (!el) return 0;
  const cs = getComputedStyle(el);
  const mis = parseFloat(cs.marginInlineStart) || 0;
  const mie = parseFloat(cs.marginInlineEnd) || 0;

  return mis + mie + el.getBoundingClientRect().width;
}
