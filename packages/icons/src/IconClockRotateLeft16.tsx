import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconClockRotateLeft16 = forwardRef(
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
        <path d="M9.1 8.9a.2.2 0 0 1-.2.2H5a.2.2 0 0 1-.2-.2V7.7c0-.11.09-.2.2-.2h2.5v-3c0-.11.09-.2.2-.2h1.2c.11 0 .2.09.2.2z" />
        <path d="M5.136 12.579a5.4 5.4 0 1 0-1.718-7.441l1.136.709a.2.2 0 0 1-.019.35L.908 7.964a.2.2 0 0 1-.288-.18V3.75a.2.2 0 0 1 .305-.17l.33.208.806.503a7 7 0 1 1-.67 6.02.1.1 0 0 1 .049-.12l1.265-.631a.102.102 0 0 1 .142.06 5.38 5.38 0 0 0 2.29 2.96" />
      </g>
    </svg>
  )
);
IconClockRotateLeft16.displayName = 'IconClockRotateLeft16';
