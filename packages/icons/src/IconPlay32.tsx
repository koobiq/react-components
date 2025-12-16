import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlay32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M7 6.355c0-1.036.797-1.676 1.686-1.143l16.075 9.645a1.333 1.333 0 0 1 0 2.287L8.686 26.789C7.797 27.322 7 26.682 7 25.646z" />
    </svg>
  )
);
IconPlay32.displayName = 'IconPlay32';
