import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBan16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m-3.79 4.343L3.656 4.791a5.4 5.4 0 0 0 7.553 7.553m1.133-1.134A5.4 5.4 0 0 0 4.79 3.656z" />
    </svg>
  )
);
IconBan16.displayName = 'IconBan16';
