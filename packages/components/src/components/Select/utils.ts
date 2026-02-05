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

export function CollectionRoot({
  collection,
}: {
  collection: any;
  scrollRef: any;
}) {
  return useCollectionRender(collection, null);
}
