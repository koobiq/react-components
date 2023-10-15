import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconExists16 = forwardRef(
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
        d="M3.7 14a.2.2 0 0 1-.2-.2v-1.377c0-.11.09-.2.2-.2h6.43V8.68H4.654a.2.2 0 0 1-.2-.2v-1.35c0-.11.09-.2.2-.2h5.476V3.786H3.747a.2.2 0 0 1-.2-.2V2.2c0-.11.09-.2.2-.2H12.3c.11 0 .2.09.2.2v11.6c0-.39-.09.2-.2.2z"
      />
    </svg>
  )
);
IconExists16.displayName = 'IconExists16';
