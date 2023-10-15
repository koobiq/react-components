import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleDotO16 = forwardRef(
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
        d="M10.248 1.369c-.27.453-.43.978-.446 1.539a5.4 5.4 0 1 0 3.29 3.29 3.2 3.2 0 0 0 1.54-.446C14.87 6.458 15 7.214 15 8a7 7 0 1 1-4.752-6.631"
      />
      <g fill="currentColor">
        <path d="M15 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
        <path d="M15 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
      </g>
    </svg>
  )
);
IconCircleDotO16.displayName = 'IconCircleDotO16';