import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCalendarO16 = forwardRef(
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
        d="M10.2 2H5.8V.2a.2.2 0 0 0-.2-.2H4.4a.2.2 0 0 0-.2.2V2h-2A1.2 1.2 0 0 0 1 3.2v10.6A1.2 1.2 0 0 0 2.2 15h11.6a1.2 1.2 0 0 0 1.2-1.2V3.2A1.2 1.2 0 0 0 13.8 2h-2V.2a.2.2 0 0 0-.2-.2h-1.2a.2.2 0 0 0-.2.2zM2.8 13.4a.2.2 0 0 1-.2-.2v-7c0-.11.09-.2.2-.2h10.4c.11 0 .2.09.2.2v7a.2.2 0 0 1-.2.2z"
      />
    </svg>
  )
);
IconCalendarO16.displayName = 'IconCalendarO16';
