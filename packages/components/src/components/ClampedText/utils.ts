export const getRowsCount = (element: HTMLElement) => {
  const range = document.createRange();
  const textNodes = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const rowTops = new Set<number>();
  let textNode = textNodes.nextNode();

  while (textNode) {
    if (textNode.textContent?.trim()) {
      range.selectNodeContents(textNode);

      Array.from(range.getClientRects()).forEach(({ top }) => {
        rowTops.add(top);
      });
    }

    textNode = textNodes.nextNode();
  }

  return rowTops.size;
};
