import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBarsVertical16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M2.2 14c-.11 0-.2-.067-.2-.15V2.15c0-.083.09-.15.2-.15h2.1c.11 0 .2.067.2.15v11.7c0 .083-.09.15-.2.15zM11.7 14c-.11 0-.2-.067-.2-.15V2.15c0-.083.09-.15.2-.15h2.1c.11 0 .2.067.2.15v11.7c0 .083-.09.15-.2.15zM6.95 2c-.11 0-.2.067-.2.15v11.7c0 .083.09.15.2.15h2.1c.11 0 .2-.067.2-.15V2.15c0-.083-.09-.15-.2-.15z" />
      </g>
    </svg>
  )
);
IconBarsVertical16.displayName = 'IconBarsVertical16';
