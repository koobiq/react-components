import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconShield16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M1 2.202A1.2 1.2 0 0 1 2.2 1h11.6A1.2 1.2 0 0 1 15 2.202v9.383a.2.2 0 0 1-.115.181l-6.8 4.215a.2.2 0 0 1-.17 0l-6.8-4.214A.2.2 0 0 1 1 11.585z" />
    </svg>
  )
);
IconShield16.displayName = 'IconShield16';
