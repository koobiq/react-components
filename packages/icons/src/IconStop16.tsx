import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconStop16 = forwardRef(
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
        d="M3 4.2A1.2 1.2 0 0 1 4.2 3h7.6A1.2 1.2 0 0 1 13 4.2v7.6a1.2 1.2 0 0 1-1.2 1.2H4.2A1.2 1.2 0 0 1 3 11.8z"
      />
    </svg>
  )
);
IconStop16.displayName = 'IconStop16';
