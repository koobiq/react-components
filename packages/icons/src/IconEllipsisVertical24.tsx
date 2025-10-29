import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEllipsisVertical24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M14.25 3.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0M14.25 12a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0M12 22.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5" />
      </g>
    </svg>
  )
);
IconEllipsisVertical24.displayName = 'IconEllipsisVertical24';
