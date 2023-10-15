import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCapsule16 = forwardRef(
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
        d="M8 2.201A4.1 4.1 0 0 1 13.799 8L8 13.799A4.1 4.1 0 0 1 2.201 8zM6.794 5.594a.193.193 0 0 0 0 .273l3.339 3.34a.193.193 0 0 0 .273 0l2.3-2.3a2.554 2.554 0 1 0-3.613-3.613z"
      />
    </svg>
  )
);
IconCapsule16.displayName = 'IconCapsule16';
