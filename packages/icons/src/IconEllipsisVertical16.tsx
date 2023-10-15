import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEllipsisVertical16 = forwardRef(
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
        <path d="M9.5 2.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M8 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
      </g>
    </svg>
  )
);
IconEllipsisVertical16.displayName = 'IconEllipsisVertical16';
