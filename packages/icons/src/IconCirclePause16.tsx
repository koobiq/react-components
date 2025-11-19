import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCirclePause16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14M7 4.9v6.2a.2.2 0 0 1-.2.2H5.6a.2.2 0 0 1-.2-.2V4.9c0-.11.09-.2.2-.2h1.2c.11 0 .2.09.2.2m3.6 0v6.2a.2.2 0 0 1-.2.2H9.2a.2.2 0 0 1-.2-.2V4.9c0-.11.09-.2.2-.2h1.2c.11 0 .2.09.2.2" />
    </svg>
  )
);
IconCirclePause16.displayName = 'IconCirclePause16';
