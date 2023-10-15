import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEject16 = forwardRef(
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
        <path d="m1 11.2 6.836-9.11a.2.2 0 0 1 .328 0L15 11.2zM15 13.8a.2.2 0 0 1-.2.2H1.2a.2.2 0 0 1-.2-.2v-1.4h14z" />
      </g>
    </svg>
  )
);
IconEject16.displayName = 'IconEject16';
