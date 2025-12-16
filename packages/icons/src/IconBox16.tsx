import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBox16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M0 3.2A1.2 1.2 0 0 1 1.2 2h3.6c.11 0 .2.09.2.2v5.6c0 .11.09.2.2.2h1.6a.2.2 0 0 0 .2-.2V2.2c0-.11.09-.2.2-.2h3.6A1.2 1.2 0 0 1 12 3.2v9.6a1.2 1.2 0 0 1-1.2 1.2H1.2A1.2 1.2 0 0 1 0 12.8zM16 12.8V3.2A1.2 1.2 0 0 0 14.8 2h-.4a1.2 1.2 0 0 0-1.2 1.2v9.6a1.2 1.2 0 0 0 1.2 1.2h.4a1.2 1.2 0 0 0 1.2-1.2" />
      </g>
    </svg>
  )
);
IconBox16.displayName = 'IconBox16';
