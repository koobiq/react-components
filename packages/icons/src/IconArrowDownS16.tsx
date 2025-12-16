import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowDownS16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m8.786 11.053 2.523-2.494a.2.2 0 0 1 .285 0l.845.839c.081.08.081.212 0 .292L8.142 13.94a.2.2 0 0 1-.284 0L3.56 9.69a.206.206 0 0 1 0-.292l.846-.84a.2.2 0 0 1 .284 0l2.49 2.462V2.201a.2.2 0 0 1 .2-.201h1.206c.11 0 .2.09.2.201z" />
    </svg>
  )
);
IconArrowDownS16.displayName = 'IconArrowDownS16';
