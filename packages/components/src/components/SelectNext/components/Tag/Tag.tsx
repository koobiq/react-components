import { useRef, type CSSProperties, type ReactNode } from 'react';

import { clsx, mergeProps, isNotNil } from '@koobiq/react-core';
import { IconXmarkS16 } from '@koobiq/react-icons';

import { utilClasses } from '../../../../styles/utility';
import { IconButton } from '../../../IconButton';
import type { TagGroupPropVariant } from '../../../TagGroup';
import s from '../../../TagGroup/components/Tag/Tag.module.css';

import { matchVariantToCloseButton } from './utils';

type TagProps = {
  /**
   * The variant to use.
   * @default 'theme-fade'
   */
  variant?: TagGroupPropVariant;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  icon?: ReactNode;
  isDisabled?: boolean;
  onRemove?: () => void;
};

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export function Tag(props: TagProps) {
  const {
    variant = 'theme-fade',
    icon,
    className,
    style,
    isDisabled,
    children,
    onRemove,
  } = props;

  const ref = useRef(null);

  const rootProps = mergeProps({
    className: clsx(
      s.base,
      s[variant],
      isDisabled && s.disabled,
      textNormalMedium,
      className
    ),
    style,
  });

  const removeButtonProps = {
    isCompact: true,
    isDisabled,
    className: s.cancelIcon,
    variant: matchVariantToCloseButton[variant],
    'aria-label': 'remove',
  };

  const contentProps = mergeProps({
    className: s.content,
  });

  const iconProps = mergeProps({
    className: s.icon,
  });

  return (
    <div ref={ref} {...rootProps}>
      {isNotNil(icon) && <span {...iconProps}>{icon}</span>}
      {isNotNil(children) && <span {...contentProps}>{children}</span>}
      <IconButton
        as="div"
        size="l"
        {...removeButtonProps}
        tabIndex={undefined}
        onPress={onRemove}
      >
        <IconXmarkS16 />
      </IconButton>
    </div>
  );
}
