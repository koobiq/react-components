import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';

import { clsx, isNotNil, polymorphicForwardRef } from '@koobiq/react-core';

import type { SkeletonBlockBaseProps } from './index';
import s from './SkeletonBlock.module.css';
import { normalizeSize } from './utils';

export const SkeletonBlock = polymorphicForwardRef<
  'span',
  SkeletonBlockBaseProps
>((props, ref) => {
  const {
    as: Tag = 'span',
    style: styleProp,
    children,
    bgColor,
    waveColor,
    className,
    inlineSize,
    blockSize,
    ...other
  } = props;

  const style = {
    '--skeleton-inline-size': normalizeSize(inlineSize),
    '--skeleton-block-size': normalizeSize(blockSize),
    '--skeleton-wave-color': waveColor,
    '--skeleton-bg-color': bgColor,
    ...styleProp,
  } as CSSProperties;

  return (
    <Tag
      className={clsx(s.base, isNotNil(children) && s.hasChildren, className)}
      style={style}
      {...other}
      ref={ref}
    >
      {children}
    </Tag>
  );
});

export type SkeletonBlockProps<As extends ElementType = 'span'> =
  ComponentPropsWithRef<typeof SkeletonBlock<As>>;
