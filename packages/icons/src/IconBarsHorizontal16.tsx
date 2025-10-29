import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBarsHorizontal16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M1 2.2c0-.11.09-.2.2-.2h13.6c.11 0 .2.09.2.2v2.1a.2.2 0 0 1-.2.2H1.2a.2.2 0 0 1-.2-.2zM1 11.7c0-.11.09-.2.2-.2h13.6c.11 0 .2.09.2.2v2.1a.2.2 0 0 1-.2.2H1.2a.2.2 0 0 1-.2-.2zM15 6.95a.2.2 0 0 0-.2-.2H1.2a.2.2 0 0 0-.2.2v2.1c0 .11.09.2.2.2h13.6a.2.2 0 0 0 .2-.2z" />
      </g>
    </svg>
  )
);
IconBarsHorizontal16.displayName = 'IconBarsHorizontal16';
