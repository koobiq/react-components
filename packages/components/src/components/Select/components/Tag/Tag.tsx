'use client';

import {
  type CSSProperties,
  type ReactNode,
  forwardRef,
  type ComponentRef,
} from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import {
  clsx,
  mergeProps,
  isNotNil,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconXmarkS16 } from '@koobiq/react-icons';

import { utilClasses } from '../../../../styles/utility';
import { IconButton } from '../../../IconButton';
import type { TagGroupPropVariant } from '../../../TagGroup';
import s from '../../../TagGroup/components/Tag/Tag.module.css';

import intlMessages from './intl.json';
import { matchVariantToCloseButton } from './utils';

type TagProps = ExtendableComponentPropsWithRef<
  {
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
  },
  'div'
>;

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export const Tag = forwardRef<ComponentRef<'div'>, TagProps>((props, ref) => {
  const {
    variant = 'theme-fade',
    icon,
    className,
    style,
    isDisabled,
    children,
    onRemove,
    ...other
  } = props;

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  const rootProps = mergeProps({
    className: clsx(
      s.base,
      s[variant],
      isDisabled && s.disabled,
      textNormalMedium,
      className
    ),
    ...other,
    style,
  });

  const removeButtonProps = {
    isCompact: true,
    isDisabled,
    className: s.cancelIcon,
    variant: matchVariantToCloseButton[variant],
    'aria-label': stringFormatter.format('remove'),
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
});

Tag.displayName = 'SelectTag';
