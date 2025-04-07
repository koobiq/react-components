'use client';

import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';

import { clsx, polymorphicForwardRef, useRefs } from '@koobiq/react-core';
import { Transition } from 'react-transition-group';

import s from './AnimatedIcon.module.css';
import type { AnimatedIconBaseProps } from './index';

export const AnimatedIcon = polymorphicForwardRef<
  'span',
  AnimatedIconBaseProps
>((props, ref) => {
  const {
    transition = 300,
    as: Tag = 'span',
    activeIndex = 0,
    directions,
    className,
    icons = [],
    style: styleProp,
    ...other
  } = props;

  const refs = useRefs<HTMLDivElement>(icons.length);

  const singleIcon = icons?.[0];

  const innerRender =
    icons.length === 1
      ? singleIcon
      : icons.map((icon, index) => (
          <Transition
            in={activeIndex === index}
            timeout={transition}
            nodeRef={refs[index]}
            key={index}
            unmountOnExit
          >
            {(transition) => (
              <span
                className={s.icon}
                data-index={index}
                ref={refs[index]}
                data-transition={transition}
              >
                {icon}
              </span>
            )}
          </Transition>
        ));

  const style = {
    ...styleProp,
    '--animated-icon-transition': `${transition}ms`,
    ...(typeof directions?.[activeIndex] === 'number' && {
      '--animated-icon-direction': `rotate(${directions[activeIndex]}deg)`,
    }),
  } as CSSProperties;

  return (
    <Tag {...other} className={clsx(s.base, className)} style={style} ref={ref}>
      {innerRender}
    </Tag>
  );
});

export type AnimatedIconProps<As extends ElementType = 'span'> =
  ComponentPropsWithRef<typeof AnimatedIcon<As>>;
