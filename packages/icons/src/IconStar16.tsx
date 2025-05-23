import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconStar16 = forwardRef(
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
        d="M7.808 1.627a.21.21 0 0 1 .384 0l1.843 4.312 4.772.373a.208.208 0 0 1 .118.367l-3.632 3.028 1.111 4.534a.209.209 0 0 1-.31.229L8 12.036 3.906 14.47a.209.209 0 0 1-.31-.229l1.11-4.534-3.63-3.028a.208.208 0 0 1 .117-.367l4.772-.373z"
      />
    </svg>
  )
);
IconStar16.displayName = 'IconStar16';
