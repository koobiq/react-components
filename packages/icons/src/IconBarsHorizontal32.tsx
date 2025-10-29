import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBarsHorizontal32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M27 7H5v3h22zM5 15h22v3H5zM5 23h22v3H5z" />
      </g>
    </svg>
  )
);
IconBarsHorizontal32.displayName = 'IconBarsHorizontal32';
