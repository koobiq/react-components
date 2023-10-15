import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconExclamationTriangle32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M16.754 3.896c.28.15.508.378.657.658l12.332 23.092A1.6 1.6 0 0 1 28.332 30H3.668a1.6 1.6 0 0 1-1.411-2.354L14.589 4.554a1.6 1.6 0 0 1 2.165-.658M17 22l.5-9h-3l.5 9zm-1 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
      />
    </svg>
  )
);
IconExclamationTriangle32.displayName = 'IconExclamationTriangle32';
