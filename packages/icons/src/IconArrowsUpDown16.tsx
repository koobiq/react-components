import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowsUpDown16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M8.805 2.853 8.802 7.2a.2.2 0 0 1-.2.2h-1.2a.2.2 0 0 1-.2-.2V2.845L5.138 4.888a.2.2 0 0 1-.282 0l-.798-.79a.196.196 0 0 1 0-.279L7.86.058a.2.2 0 0 1 .282 0l3.8 3.761a.196.196 0 0 1 0 .28l-.797.79a.2.2 0 0 1-.282 0zM7.397 8.6a.2.2 0 0 0-.2.2l-.002 4.348-2.057-2.036a.2.2 0 0 0-.282 0l-.798.79a.196.196 0 0 0 0 .279l3.801 3.761a.2.2 0 0 0 .282 0l3.8-3.761a.196.196 0 0 0 0-.28l-.797-.79a.2.2 0 0 0-.282 0l-2.064 2.044.003-4.355a.2.2 0 0 0-.2-.2z" />
      </g>
    </svg>
  )
);
IconArrowsUpDown16.displayName = 'IconArrowsUpDown16';