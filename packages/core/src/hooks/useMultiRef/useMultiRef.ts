import { useMemo, useRef } from 'react';
import type {
  Dispatch,
  SetStateAction,
  RefCallback,
  Ref as ReactRef,
} from 'react';

import { setRef } from '../../utils/setRef.js';

type Ref<T> = ReactRef<T> | Dispatch<SetStateAction<T | undefined>> | null;

export function useMultiRef<T>(
  refs: Array<Ref<T> | undefined>
): RefCallback<T> | null {
  // memo
  const arrRefs = useRef(refs);

  return useMemo(() => {
    if (!arrRefs.current.length) {
      return null;
    }

    return (node: T): void => {
      arrRefs.current.forEach((ref) => {
        setRef<T>(ref, node);
      });
    };
  }, [arrRefs]);
}
