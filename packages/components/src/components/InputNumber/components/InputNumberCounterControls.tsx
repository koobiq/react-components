import { clsx } from '@koobiq/react-core';
import { IconChevronDown16, IconChevronUp16 } from '@koobiq/react-icons';

import { useFieldInputGroup } from '../../FieldComponents';
import { IconButton } from '../../IconButton';

import s from './InputNumberCounterControls.module.css';

export const InputNumberCounterControls = () => {
  const { hovered, hasValue, focusWithin } = useFieldInputGroup();

  const visible = (hovered || focusWithin) && hasValue;

  return (
    <div className={clsx(s.base, visible && s.visible)}>
      <IconButton
        className={s.counter}
        slot="increment"
        variant="fade-contrast"
        size="l"
        compact
      >
        <IconChevronUp16 />
      </IconButton>
      <IconButton
        className={s.counter}
        slot="decrement"
        variant="fade-contrast"
        size="l"
        compact
      >
        <IconChevronDown16 />
      </IconButton>
    </div>
  );
};
