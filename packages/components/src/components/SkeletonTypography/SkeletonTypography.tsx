import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { utilClasses } from '../../styles/utility';
import { SkeletonBlock } from '../SkeletonBlock';

import type { SkeletonTypographyBaseProps } from './index';
import s from './SkeletonTypography.module.css';
import { getRowWidth } from './utils';

const textVariant = utilClasses.typography;

export const SkeletonTypography = polymorphicForwardRef<
  'span',
  SkeletonTypographyBaseProps
>((props, ref) => {
  const {
    as: Tag = 'span',
    variant = 'inherit',
    rows,
    inlineSize,
    style,
    bgColor,
    waveColor,
    className,
    ...other
  } = props;

  return (
    <Tag
      className={clsx(s.base, textVariant[variant], className)}
      style={{ inlineSize }}
      {...other}
      ref={ref}
    >
      {new Array(rows).fill(0).map((_, idx) => (
        <span className={clsx(s.row, variant && s[variant])} key={idx}>
          <SkeletonBlock
            bgColor={bgColor}
            className={s.skeleton}
            waveColor={waveColor}
            style={{
              width: getRowWidth(idx, rows),
              ...style,
            }}
          />
        </span>
      ))}
    </Tag>
  );
});

export type SkeletonTypographyProps<As extends ElementType = 'span'> =
  ComponentPropsWithRef<typeof SkeletonTypography<As>>;
