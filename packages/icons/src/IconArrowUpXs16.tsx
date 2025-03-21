import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowUpXs16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M8.786 5.947 10.868 8a.2.2 0 0 0 .284 0l.846-.84a.206.206 0 0 0 0-.291l-3.856-3.81a.2.2 0 0 0-.284 0l-3.856 3.81a.206.206 0 0 0 0 .292L4.848 8a.2.2 0 0 0 .284 0l2.05-2.02v6.819A.2.2 0 0 0 7.38 13h1.206a.2.2 0 0 0 .2-.201z"
      />
    </svg>
  )
);
IconArrowUpXs16.displayName = 'IconArrowUpXs16';
