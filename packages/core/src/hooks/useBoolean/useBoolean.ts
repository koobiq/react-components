import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';

export type UseBooleanControllers = {
  /** Set the value to `true` */
  on: () => void;
  /** Set the value to `false` */
  off: () => void;
  /** Toggle the value to the opposite state */
  toggle: () => void;
  /** Set the value to a specific state */
  set: Dispatch<SetStateAction<boolean>>;
};

export type UseBooleanReturnValue = [boolean, UseBooleanControllers];

export function useBoolean(defaultValue = false): UseBooleanReturnValue {
  const [value, setValue] = useState(defaultValue);

  const on = useCallback(() => setValue(true), []);
  const off = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((value) => !value), []);

  return [value, { on, off, toggle, set: setValue }];
}
