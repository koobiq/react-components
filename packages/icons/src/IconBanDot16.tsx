import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBanDot16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M10.248 1.369c-.27.453-.43.978-.446 1.539A5.4 5.4 0 0 0 8 2.6a5.38 5.38 0 0 0-3.21 1.058l7.552 7.553A5.38 5.38 0 0 0 13.4 8c0-.632-.109-1.239-.308-1.802a3.2 3.2 0 0 0 1.54-.446C14.87 6.458 15 7.214 15 8a7 7 0 1 1-4.752-6.631m.963 10.973L3.658 4.79a5.4 5.4 0 0 0 7.553 7.553" />
      <g fill="var(--icon-accent-color, currentColor)">
        <path d="M15 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
        <path d="M15 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
      </g>
    </svg>
  )
);
IconBanDot16.displayName = 'IconBanDot16';
