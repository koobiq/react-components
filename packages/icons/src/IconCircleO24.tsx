import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleO24 = forwardRef(
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
        d="M12 20.1a8.1 8.1 0 1 1 0-16.2 8.1 8.1 0 0 1 0 16.2m0 2.4c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5"
      />
    </svg>
  )
);
IconCircleO24.displayName = 'IconCircleO24';
