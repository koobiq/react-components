import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconShieldHalf16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M8.105 15.97a.2.2 0 0 1-.21 0l-6.8-4.19A.2.2 0 0 1 1 11.608V2.202C1 1.539 1.537 1 2.2 1h11.6c.663 0 1.2.539 1.2 1.203v9.406a.2.2 0 0 1-.095.17zM8 2.604v11.548l5.305-3.27a.2.2 0 0 0 .095-.17V2.804a.2.2 0 0 0-.2-.2z" />
    </svg>
  )
);
IconShieldHalf16.displayName = 'IconShieldHalf16';
