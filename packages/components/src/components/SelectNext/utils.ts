import { useCachedChildren } from '@koobiq/react-primitives';
import type { Collection, Node } from '@react-types/shared';

export function useCollectionRender<T>(
  collection: Collection<Node<T>>,
  parent: Node<T> | null
) {
  return useCachedChildren({
    items: parent ? collection.getChildren!(parent.key) : collection,
    dependencies: [],
    children(node) {
      return node.render!(node);
    },
  });
}

export function CollectionRoot<T>({
  collection,
}: {
  collection: Collection<Node<T>>;
}) {
  return useCollectionRender(collection, null);
}

export function CollectionBranch<T>({
  collection,
  parent,
}: {
  collection: Collection<Node<T>>;
  parent: Node<T>;
}) {
  return useCollectionRender(collection, parent);
}
