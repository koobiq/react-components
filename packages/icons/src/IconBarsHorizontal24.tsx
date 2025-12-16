import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBarsHorizontal24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M1.5 3.3a.3.3 0 0 1 .3-.3h20.4a.3.3 0 0 1 .3.3v3.15a.3.3 0 0 1-.3.3H1.8a.3.3 0 0 1-.3-.3zM1.5 17.55a.3.3 0 0 1 .3-.3h20.4a.3.3 0 0 1 .3.3v3.15a.3.3 0 0 1-.3.3H1.8a.3.3 0 0 1-.3-.3zM22.5 10.425a.3.3 0 0 0-.3-.3H1.8a.3.3 0 0 0-.3.3v3.15a.3.3 0 0 0 .3.3h20.4a.3.3 0 0 0 .3-.3z" />
      </g>
    </svg>
  )
);
IconBarsHorizontal24.displayName = 'IconBarsHorizontal24';
