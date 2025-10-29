import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleHalf24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M12 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5m0-2.4a8.1 8.1 0 0 0 0-16.2v16.2" />
    </svg>
  )
);
IconCircleHalf24.displayName = 'IconCircleHalf24';
