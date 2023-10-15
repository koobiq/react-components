import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEllipsisHorizontal16 = forwardRef(
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
        <path d="M13.5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M8 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M1 8a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0" />
      </g>
    </svg>
  )
);
IconEllipsisHorizontal16.displayName = 'IconEllipsisHorizontal16';
