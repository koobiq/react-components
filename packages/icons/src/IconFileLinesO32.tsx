import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFileLinesO32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M10 19h6v2h-6zM22 14H10v2h12zM10 9h12v2H10z" />
        <path d="M8.3 29h12.1l6.6-6.5V6.25C26.993 4.46 25.518 3 23.7 3H8.3C6.478 3 5.001 4.456 5.001 6.25L5 25.75C5 27.545 6.477 29 8.3 29M20 26.389V22h4.489zM18 27H8.5A1.5 1.5 0 0 1 7 25.5V6.492a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5V20h-5a2 2 0 0 0-2 2z" />
      </g>
    </svg>
  )
);
IconFileLinesO32.displayName = 'IconFileLinesO32';
