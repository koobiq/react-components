import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBan24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12m-5.686 6.515L5.485 7.186a8.1 8.1 0 0 0 11.329 11.329m1.7-1.701A8.1 8.1 0 0 0 7.186 5.485z"
      />
    </svg>
  )
);
IconBan24.displayName = 'IconBan24';
