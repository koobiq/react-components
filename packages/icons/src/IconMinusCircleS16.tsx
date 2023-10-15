import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMinusCircleS16 = forwardRef(
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
        d="M3.757 12.243a6 6 0 1 0 8.486-8.485 6 6 0 0 0-8.486 8.485M5.2 7.4h5.6c.11 0 .2.09.2.2v.8a.2.2 0 0 1-.2.2H5.2a.2.2 0 0 1-.2-.2v-.8c0-.11.09-.2.2-.2"
      />
    </svg>
  )
);
IconMinusCircleS16.displayName = 'IconMinusCircleS16';
