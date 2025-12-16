import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFolderOpen24 = forwardRef(
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
        <path d="M3.3 3a1.8 1.8 0 0 0-1.8 1.8v14.4A1.8 1.8 0 0 0 3.3 21h.048L7.94 10.669A1.8 1.8 0 0 1 9.585 9.6H22.5V7.8A1.8 1.8 0 0 0 20.7 6H12L9 3z" />
        <path d="m5.318 21 4.188-9.422a.3.3 0 0 1 .274-.178h13.759a.3.3 0 0 1 .274.422l-3.598 8.108A1.8 1.8 0 0 1 18.57 21z" />
      </g>
    </svg>
  )
);
IconFolderOpen24.displayName = 'IconFolderOpen24';
