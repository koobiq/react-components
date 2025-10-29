import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEllipsisHorizontal24 = forwardRef(
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
        <path d="M20.25 14.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5M12 14.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5M1.5 12A2.25 2.25 0 1 0 6 12a2.25 2.25 0 0 0-4.5 0" />
      </g>
    </svg>
  )
);
IconEllipsisHorizontal24.displayName = 'IconEllipsisHorizontal24';
