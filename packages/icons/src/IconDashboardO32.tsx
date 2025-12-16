import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDashboardO32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M29 25a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2l.001-17.982a2 2 0 0 1 1.999-2l21.998-.016a2 2 0 0 1 2.002 2zm-18 0v-6l-6 .005V25zm2 0h6v-6l-6 .005zm14 0v-6l-6 .005V25zM5 17h10v-4l-10 .004zm22 0v-4l-10 .004V17zM5 11h22V7l-21.999.004z" />
    </svg>
  )
);
IconDashboardO32.displayName = 'IconDashboardO32';
