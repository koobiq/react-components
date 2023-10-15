import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconShieldO16 = forwardRef(
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
        d="M2.6 2.804c0-.11.09-.2.2-.2h10.4c.11 0 .2.09.2.2v7.908a.2.2 0 0 1-.095.17l-5.2 3.206a.2.2 0 0 1-.21 0l-5.2-3.205a.2.2 0 0 1-.095-.171zM1 11.61a.2.2 0 0 0 .095.17l6.8 4.191a.2.2 0 0 0 .21 0l6.8-4.19a.2.2 0 0 0 .095-.171V2.202C15 1.539 14.463 1 13.8 1H2.2C1.537 1 1 1.539 1 2.203z"
      />
    </svg>
  )
);
IconShieldO16.displayName = 'IconShieldO16';
