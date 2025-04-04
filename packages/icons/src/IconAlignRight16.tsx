import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconAlignRight16 = forwardRef(
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
        <path d="M16 13.8v-1.2a.2.2 0 0 0-.2-.2H6.2a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h9.6a.2.2 0 0 0 .2-.2M16 6.866a.2.2 0 0 1-.2.2H6.11a.2.2 0 0 1-.2-.2v-1.2c0-.11.09-.2.2-.2h9.69c.11 0 .2.09.2.2zM16 10.333a.2.2 0 0 1-.2.2H.2a.2.2 0 0 1-.2-.2v-1.2c0-.11.09-.2.2-.2h15.6c.11 0 .2.09.2.2zM16 3.4a.2.2 0 0 1-.2.2H.2a.2.2 0 0 1-.2-.2V2.2c0-.11.09-.2.2-.2h15.6c.11 0 .2.09.2.2z" />
      </g>
    </svg>
  )
);
IconAlignRight16.displayName = 'IconAlignRight16';
