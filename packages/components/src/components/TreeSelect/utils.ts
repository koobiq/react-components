import type { TreeSelectNode } from './types';

/** Resolve the text a node is searched/matched by. */
export function getNodeTextValue(node: TreeSelectNode): string {
  if (node.textValue != null) return node.textValue;

  return typeof node.label === 'string' ? node.label : '';
}

/**
 * Prune the tree to nodes that match `hit` (or have a matching descendant),
 * collecting the ids of branches that must be expanded to reveal the matches.
 */
export function filterTree(
  nodes: TreeSelectNode[],
  hit: (text: string) => boolean
): { items: TreeSelectNode[]; expandedIds: string[] } {
  const expandedIds: string[] = [];

  const walk = (list: TreeSelectNode[]): TreeSelectNode[] =>
    list.flatMap((node) => {
      const children = node.children ? walk(node.children) : [];

      if (children.length) expandedIds.push(node.id);

      if (hit(getNodeTextValue(node)) || children.length) {
        return [
          { ...node, children: children.length ? children : node.children },
        ];
      }

      return [];
    });

  return { items: walk(nodes), expandedIds };
}
