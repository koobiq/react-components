import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCheck24 = forwardRef(
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
        d="M22.407 5.83a.306.306 0 0 1 .006.433L9.588 19.409a.3.3 0 0 1-.434 0l-7.567-7.764a.306.306 0 0 1 .006-.433l1.286-1.245a.3.3 0 0 1 .427.006L9.371 16.2 20.694 4.59a.3.3 0 0 1 .427-.006z"
      />
    </svg>
  )
);
IconCheck24.displayName = 'IconCheck24';
