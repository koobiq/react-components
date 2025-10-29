import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMap16 = forwardRef(
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
        <path d="M11 2.152a.1.1 0 0 1 .142-.09l2.742 1.278a.2.2 0 0 1 .116.182v10.377a.1.1 0 0 1-.142.092l-2.742-1.745a.2.2 0 0 1-.116-.183zM5 13.846a.1.1 0 0 1-.142.09l-2.743-1.278A.2.2 0 0 1 2 12.476V2.101a.1.1 0 0 1 .142-.092l2.742 1.745c.07.033.116.105.116.183zM9.654 2.019a.1.1 0 0 1 .146.09v9.96a.2.2 0 0 1-.109.179L6.346 13.98a.1.1 0 0 1-.146-.09v-9.96c0-.075.042-.144.109-.179z" />
      </g>
    </svg>
  )
);
IconMap16.displayName = 'IconMap16';
