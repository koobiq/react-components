import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconShieldExclamation16 = forwardRef(
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
        d="M1 2.202A1.2 1.2 0 0 1 2.2 1h11.6A1.2 1.2 0 0 1 15 2.202v9.383a.2.2 0 0 1-.115.181l-6.8 4.215a.2.2 0 0 1-.17 0l-6.8-4.214A.2.2 0 0 1 1 11.585zM8.787 4H7.333a.2.2 0 0 0-.2.212l.31 4.952a.2.2 0 0 0 .199.187h.834a.2.2 0 0 0 .2-.187l.31-4.951A.2.2 0 0 0 8.788 4m-.727 7.804a.887.887 0 1 0 0-1.774.887.887 0 0 0 0 1.774"
      />
    </svg>
  )
);
IconShieldExclamation16.displayName = 'IconShieldExclamation16';
