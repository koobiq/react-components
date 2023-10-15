import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconAlignCenter16 = forwardRef(
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
        <path d="M3 13.8c0 .11.09.2.2.2h9.6a.2.2 0 0 0 .2-.2v-1.2a.2.2 0 0 0-.2-.2H3.2a.2.2 0 0 0-.2.2zM2.8 6.866c0 .11.09.2.2.2h10a.2.2 0 0 0 .2-.2v-1.2a.2.2 0 0 0-.2-.2H3a.2.2 0 0 0-.2.2zM0 10.333c0 .11.09.2.2.2h15.6a.2.2 0 0 0 .2-.2v-1.2a.2.2 0 0 0-.2-.2H.2a.2.2 0 0 0-.2.2zM0 3.4V2.2c0-.11.09-.2.2-.2h15.6c.11 0 .2.09.2.2v1.2a.2.2 0 0 1-.2.2H.2a.2.2 0 0 1-.2-.2" />
      </g>
    </svg>
  )
);
IconAlignCenter16.displayName = 'IconAlignCenter16';
