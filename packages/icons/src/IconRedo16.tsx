import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconRedo16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M11.937 7.366 9.303 10l1.131 1.131L15 6.566 10.434 2 9.303 3.131l2.634 2.635H5.3C2.925 5.766 1 7.626 1 10c0 2.375 1.925 4 4.3 4H8v-1.6H5.3c-1.491 0-2.7-.909-2.7-2.4s1.209-2.634 2.7-2.634z" />
    </svg>
  )
);
IconRedo16.displayName = 'IconRedo16';
