import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDesktop16 = forwardRef(
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
        <path d="M1 2.2A1.2 1.2 0 0 1 2.2 1h11.6A1.2 1.2 0 0 1 15 2.2v7.6a1.2 1.2 0 0 1-1.2 1.2H2.2A1.2 1.2 0 0 1 1 9.8zM6 12.2v1.2H3V15h10v-1.6H9.997v-1.2z" />
      </g>
    </svg>
  )
);
IconDesktop16.displayName = 'IconDesktop16';
