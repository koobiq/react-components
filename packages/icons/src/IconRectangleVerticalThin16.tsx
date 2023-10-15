import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconRectangleVerticalThin16 = forwardRef(
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
        d="M4 1.2A1.2 1.2 0 0 1 5.2 0h5.6A1.2 1.2 0 0 1 12 1.2v13.6a1.2 1.2 0 0 1-1.2 1.2H5.2A1.2 1.2 0 0 1 4 14.8z"
      />
    </svg>
  )
);
IconRectangleVerticalThin16.displayName = 'IconRectangleVerticalThin16';
