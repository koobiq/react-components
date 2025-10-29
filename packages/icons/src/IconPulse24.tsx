import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPulse24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M11.94.837c.044-.145.252-.14.29.006l3.614 14.092 1.199-3.977a.3.3 0 0 1 .287-.212h6.37a.3.3 0 0 1 .3.298v1.79a.3.3 0 0 1-.3.299h-4.807l-3.081 10.742c-.044.144-.252.14-.29-.006L11.905 9.233 8.487 20.516a.15.15 0 0 1-.284.008L5.076 11.97l-.501.997a.3.3 0 0 1-.269.165H.3a.3.3 0 0 1-.3-.299v-1.79a.3.3 0 0 1 .3-.298h2.708l2.26-4.496a.15.15 0 0 1 .276.016l2.599 7.11z" />
    </svg>
  )
);
IconPulse24.displayName = 'IconPulse24';
