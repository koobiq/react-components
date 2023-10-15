import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCompress16 = forwardRef(
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
        <path d="M1 6.05c0 .11.09.2.2.2h3.85a1.2 1.2 0 0 0 1.2-1.2V1.2a.2.2 0 0 0-.2-.2h-1.2a.2.2 0 0 0-.2.2v3.25a.2.2 0 0 1-.2.2H1.2a.2.2 0 0 0-.2.2zM1 9.95c0-.11.09-.2.2-.2h3.85a1.2 1.2 0 0 1 1.2 1.2v3.85a.2.2 0 0 1-.2.2h-1.2a.2.2 0 0 1-.2-.2v-3.25a.2.2 0 0 0-.2-.2H1.2a.2.2 0 0 1-.2-.2zM15 6.05a.2.2 0 0 1-.2.2h-3.85a1.2 1.2 0 0 1-1.2-1.2V1.2c0-.11.09-.2.2-.2h1.2c.11 0 .2.09.2.2v3.25c0 .11.09.2.2.2h3.25c.11 0 .2.09.2.2zM15 9.95a.2.2 0 0 0-.2-.2h-3.85a1.2 1.2 0 0 0-1.2 1.2v3.85c0 .11.09.2.2.2h1.2a.2.2 0 0 0 .2-.2v-3.25c0-.11.09-.2.2-.2h3.25a.2.2 0 0 0 .2-.2z" />
      </g>
    </svg>
  )
);
IconCompress16.displayName = 'IconCompress16';