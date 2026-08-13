export const getRowsCount = (element: HTMLElement) => {
  const range = document.createRange();
  const textNodes = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const rects: Array<[top: number, bottom: number]> = [];
  let textNode = textNodes.nextNode();

  while (textNode) {
    if (textNode.textContent?.trim()) {
      range.selectNodeContents(textNode);

      Array.from(range.getClientRects()).forEach(({ top, bottom, height }) => {
        if (height) rects.push([top, bottom]);
      });
    }

    textNode = textNodes.nextNode();
  }

  rects.sort(([firstTop], [secondTop]) => firstTop - secondTop);

  let rowsCount = 0;
  let rowBottom = -Infinity;

  rects.forEach(([top, bottom]) => {
    if (top >= rowBottom) rowsCount += 1;

    rowBottom = Math.max(rowBottom, bottom);
  });

  return rowsCount;
};
