import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconWrapText16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M14.788 3.587a.2.2 0 0 0 .2-.2V2.2a.2.2 0 0 0-.2-.2H1.2a.2.2 0 0 0-.2.2v1.187c0 .11.09.2.2.2zM1.2 14.012l4.39-.01v-1.587l-4.39.01a.2.2 0 0 0-.2.2v1.187c0 .11.09.2.2.2M11 15.601a.2.2 0 0 1-.305.168L6.883 13.4a.198.198 0 0 1 0-.336l3.812-2.37a.2.2 0 0 1 .305.169v1.553h.565a1.83 1.83 0 0 0 1.836-1.821 1.83 1.83 0 0 0-1.836-1.823H1.2a.2.2 0 0 1-.2-.2V7.384c0-.11.09-.2.2-.2h10.365c1.897 0 3.435 1.527 3.435 3.41 0 1.882-1.538 3.409-3.435 3.409H11z" />
      </g>
    </svg>
  )
);
IconWrapText16.displayName = 'IconWrapText16';
