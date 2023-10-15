import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlay48 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={48}
      height={48}
      fill="currentColor"
      viewBox="0 0 48 48"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M9 9.532c0-1.554 1.696-2.514 3.029-1.715l24.113 14.468c1.294.777 1.294 2.653 0 3.43L12.029 40.183c-1.333.8-3.029-.16-3.029-1.715z"
      />
    </svg>
  )
);
IconPlay48.displayName = 'IconPlay48';
