import { clsx } from '@koobiq/react-core';
import { IconChevronDown16, IconChevronUp16 } from '@koobiq/react-icons';

import { useFieldInputGroup } from '../../FieldComponents';
import { IconButton } from '../../IconButton';

import s from './InputNumberCounterControls.module.css';

export const InputNumberCounterControls = () => {
  const { isHovered, hasValue, isFocusWithin } = useFieldInputGroup();

  const visible = (isHovered || isFocusWithin) && hasValue;

  return (
    <div className={clsx(s.base, visible && s.visible)}>
      <IconButton
        className={s.counter}
        slot="increment"
        variant="fade-contrast"
        size="l"
        isCompact
      >
        <IconChevronUp16 />
      </IconButton>
      <IconButton
        className={s.counter}
        slot="decrement"
        variant="fade-contrast"
        size="l"
        isCompact
      >
        <IconChevronDown16 />
      </IconButton>
    </div>
  );
};
