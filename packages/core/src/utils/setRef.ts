import type {
  Dispatch,
  SetStateAction,
  MutableRefObject,
  Ref as ReactRef,
} from 'react';

type Ref<T> = ReactRef<T> | Dispatch<SetStateAction<T | undefined>> | null;

export const setRef = <T>(ref: Ref<T> | undefined, value: T) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    // eslint-disable-next-line no-param-reassign
    (ref as MutableRefObject<T>).current = value;
  }
};
