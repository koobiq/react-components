import { clsx } from '@koobiq/react-core';
import { IconChevronDownS16, IconChevronUpS16 } from '@koobiq/react-icons';

import { useFieldContentGroup } from '../../FieldComponents';
import { IconButton } from '../../IconButton';

import s from './InputNumberCounterControls.module.css';

export const InputNumberCounterControls = () => {
  const { isInvalid } = useFieldContentGroup();

  const variant = isInvalid ? 'error' : 'fade-contrast';

  return (
    <div className={s.base}>
      <IconButton
        className={clsx(s.counter, s.increment)}
        slot="increment"
        variant={variant}
        size="l"
        isCompact
      >
        <IconChevronUpS16 />
      </IconButton>
      <IconButton
        className={clsx(s.counter, s.decrement)}
        slot="decrement"
        variant={variant}
        size="l"
        isCompact
      >
        <IconChevronDownS16 />
      </IconButton>
    </div>
  );
};
