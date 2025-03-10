import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowDownXs16 = forwardRef(
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
        d="M8.786 10.053 10.868 8a.2.2 0 0 1 .284 0l.846.84c.081.08.081.21 0 .291l-3.856 3.81a.2.2 0 0 1-.284 0l-3.856-3.81a.206.206 0 0 1 0-.292L4.848 8a.2.2 0 0 1 .284 0l2.05 2.02V3.201A.2.2 0 0 1 7.38 3h1.206c.11 0 .2.09.2.201z"
      />
    </svg>
  )
);
IconArrowDownXs16.displayName = 'IconArrowDownXs16';
