import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFolderDot16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <circle
        cx={14}
        cy={4}
        r={2}
        fill="var(--icon-accent-color, currentColor)"
      />
      <g>
        <path d="M10.96 5H1v7.8A1.2 1.2 0 0 0 2.2 14h11.6a1.2 1.2 0 0 0 1.2-1.2V7.04q-.474.158-1 .16A3.2 3.2 0 0 1 10.96 5M1 3.2A1.2 1.2 0 0 1 2.2 2H5l1.8 1.8H1z" />
      </g>
    </svg>
  )
);
IconFolderDot16.displayName = 'IconFolderDot16';
