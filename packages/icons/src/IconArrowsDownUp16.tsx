import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowsDownUp16 = forwardRef(
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
        <path d="M7.195 4.748 7.198.2c0-.11.09-.2.2-.2h1.2c.11 0 .2.09.2.2v4.555l2.064-2.043a.2.2 0 0 1 .282 0l.798.79a.196.196 0 0 1 0 .279L8.14 7.542a.2.2 0 0 1-.282 0l-3.8-3.761a.196.196 0 0 1 0-.28l.797-.789a.2.2 0 0 1 .282 0zM8.805 11.252 8.802 15.8a.2.2 0 0 1-.2.2h-1.2a.2.2 0 0 1-.2-.2v-4.555l-2.064 2.043a.2.2 0 0 1-.282 0l-.798-.79a.196.196 0 0 1 0-.279L7.86 8.458a.2.2 0 0 1 .282 0l3.8 3.761a.196.196 0 0 1 0 .28l-.797.789a.2.2 0 0 1-.282 0z" />
      </g>
    </svg>
  )
);
IconArrowsDownUp16.displayName = 'IconArrowsDownUp16';
