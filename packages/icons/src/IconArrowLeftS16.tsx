import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowLeftS16 = forwardRef(
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
        d="m4.947 8.786 2.494 2.523a.2.2 0 0 1 0 .285l-.839.845a.206.206 0 0 1-.292 0L2.06 8.142a.2.2 0 0 1 0-.284L6.31 3.56c.08-.081.212-.081.292 0l.84.846a.2.2 0 0 1 0 .284L4.98 7.181h8.819a.2.2 0 0 1 .201.2v1.206a.2.2 0 0 1-.201.2z"
      />
    </svg>
  )
);
IconArrowLeftS16.displayName = 'IconArrowLeftS16';
