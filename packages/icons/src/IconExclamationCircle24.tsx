import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconExclamationCircle24 = forwardRef(
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
        d="M12 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5m1.39-16.176-.467 7.427a.3.3 0 0 1-.3.281h-1.25a.3.3 0 0 1-.3-.281l-.463-7.427a.3.3 0 0 1 .3-.319h2.18a.3.3 0 0 1 .3.319M12 17.71a1.33 1.33 0 1 1 0-2.66 1.33 1.33 0 0 1 0 2.66"
      />
    </svg>
  )
);
IconExclamationCircle24.displayName = 'IconExclamationCircle24';
