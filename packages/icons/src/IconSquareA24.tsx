import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSquareA24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M13.512 13.283h-3.018l1.462-4.54h.094z" />
        <path d="M20.7 1.5a1.8 1.8 0 0 1 1.8 1.8v17.4a1.8 1.8 0 0 1-1.8 1.8H3.3a1.8 1.8 0 0 1-1.8-1.8V3.3a1.8 1.8 0 0 1 1.8-1.8zM10.598 6a.3.3 0 0 0-.284.204l-3.897 11.4A.3.3 0 0 0 6.7 18h2.055a.3.3 0 0 0 .286-.208l.814-2.528h4.29l.814 2.528a.3.3 0 0 0 .286.208H17.3a.3.3 0 0 0 .284-.397l-3.892-11.4A.3.3 0 0 0 13.408 6z" />
      </g>
    </svg>
  )
);
IconSquareA24.displayName = 'IconSquareA24';
