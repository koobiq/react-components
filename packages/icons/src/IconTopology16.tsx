import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconTopology16 = forwardRef(
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
        d="M3.8 4.834a2 2 0 1 0-1.6 0v6.332A2 2 0 1 0 4.834 13.8h6.332a2 2 0 1 0 0-1.6H4.931l6.338-6.338a2 2 0 1 0-1.131-1.131L3.8 11.069z"
      />
    </svg>
  )
);
IconTopology16.displayName = 'IconTopology16';
