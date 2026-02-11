import { useCachedChildren } from '@koobiq/react-primitives';

export function useCollectionRender(collection: any, parent: any) {
  return useCachedChildren({
    items: parent ? collection.getChildren!(parent.key) : collection,
    dependencies: [],
    children(node: any) {
      return node.render!(node);
    },
  });
}

export function CollectionRoot({ collection }: { collection: any }) {
  return useCollectionRender(collection, null);
}

export function CollectionBranch({
  collection,
  parent,
}: {
  collection: any;
  parent: any;
}) {
  return useCollectionRender(collection, parent);
}
