import { useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import {
  useToggleGroupState,
  useToggleButtonGroup,
} from '@koobiq/react-primitives';

import s from './ButtonToggleGroup.module.css';
import { ButtonToggleGroupContext } from './ButtonToggleGroupContext';
import type { ButtonToggleGroupProps } from './types';

export const ButtonToggleGroup = (props: ButtonToggleGroupProps) => {
  const state = useToggleGroupState({ ...props, disallowEmptySelection: true });
  const ref = useRef<HTMLDivElement | null>(null);

  const { groupProps } = useToggleButtonGroup(
    { ...props, disallowEmptySelection: true },
    state,
    ref
  );

  return (
    <div {...groupProps} className={clsx(s.base)} ref={ref}>
      <ButtonToggleGroupContext.Provider value={state}>
        {props.children}
      </ButtonToggleGroupContext.Provider>
    </div>
  );
};
