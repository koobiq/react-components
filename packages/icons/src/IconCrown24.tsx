import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCrown24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M11.735 2.405a.305.305 0 0 1 .53 0l4.232 7.472 7.002-5.83c.225-.188.56.02.492.305l-3.15 13.199.002.003h-.037v-.002H3.195v.002H3.16l-.003.003L.008 4.351a.305.305 0 0 1 .493-.304l7.003 5.83zM3.194 19.38v2.065c0 .168.136.305.305.305H20.5a.305.305 0 0 0 .305-.305v-2.064z" />
      </g>
    </svg>
  )
);
IconCrown24.displayName = 'IconCrown24';
